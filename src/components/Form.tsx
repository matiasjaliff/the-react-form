////////// IMPORTS //////////

// Components
import { Form, Input, Button, DatePicker, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
// React and Redux
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// Reducers
import { updateInput, updateDocument, reset } from "../app/modules/formSlice";
// Styles
import "./Form.css";
// Types
import type { RootState } from "../app/store";
// Utils
import { generateSecrets, generateRequestBody } from "../lib/crypto";

////////// COMPONENT //////////

function RegistrationForm() {
  // Declare and initialize variables

  // Messages
  const [messageApi, contextHolder] = message.useMessage();
  // Redux
  const data = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  // References
  const [form] = Form.useForm();
  // States
  const [sharedSecret, setSharedSecret] = useState<string>("");
  const [macKey, setMacKey] = useState<string>("");
  const [formIsDisabled, setFormIsDisabled] = useState(false);

  // Generate and set sharedSecret (for encryption) and macKey (for authentication)

  useEffect(() => {
    generateSecrets(setSharedSecret, setMacKey);
  }, []);

  // Form handlers

  function handleUpdateInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(updateInput({ name, value }));
  }

  function handleUpdateDate(date: string) {
    dispatch(updateInput({ name: "creationDate", value: date }));
  }

  function handleUpdateDocument(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    dispatch(
      updateDocument({
        url: files ? URL.createObjectURL(files[0]) : null,
        name: files ? files[0].name : null,
        data: null,
      })
    );
  }

  function handleReset() {
    dispatch(reset());
    form.resetFields();
  }

  async function handleSubmit() {
    try {
      setFormIsDisabled(true);
      const requestHeaders = { "Content-Type": "application/json" };
      const requestBody = await generateRequestBody(data, sharedSecret, macKey);
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: requestHeaders,
        body: requestBody,
      });
      console.log("Response: ", await response.json());
      await successMessage();
      handleReset();
    } catch (error) {
      console.error(error);
      await errorMessage();
    } finally {
      setFormIsDisabled(false);
    }
  }

  // Return Messages

  async function successMessage() {
    try {
      await messageApi.open({
        type: "success",
        content: "Your information has been saved",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function errorMessage() {
    try {
      await messageApi.open({
        type: "error",
        content: "Your information hasn't been saved",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        disabled={formIsDisabled}
        onFinish={() => {
          void (async () => {
            await handleSubmit();
          })();
        }}
      >
        <h1>Registration Form</h1>
        <h2>Personal Information</h2>
        <Form.Item
          name="firstName"
          label="First name"
          rules={[
            {
              required: true,
              type: "string",
              message: "Your first name is required",
            },
          ]}
        >
          <Input
            placeholder="First name"
            name="firstName"
            onChange={handleUpdateInput}
          />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last name"
          rules={[
            {
              required: true,
              type: "string",
              message: "Your last name is required",
            },
          ]}
        >
          <Input
            placeholder="Last name"
            name="lastName"
            onChange={handleUpdateInput}
          />
        </Form.Item>
        <Form.Item
          name="idNumber"
          label="ID"
          rules={[
            {
              required: true,
              type: "string",
              min: 7,
              max: 8,
              pattern: /^\d+$/,
              message: "Enter a valid ID (only numbers)",
            },
          ]}
        >
          <Input
            placeholder="ID number"
            name="idNumber"
            onChange={handleUpdateInput}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              type: "email",
              message: "A valid e-mail is required",
            },
          ]}
        >
          <Input
            placeholder="E-mail"
            name="email"
            onChange={handleUpdateInput}
          />
        </Form.Item>
        <h2>Business Information</h2>
        <Form.Item
          name="companyName"
          label="Company name"
          rules={[
            {
              required: true,
              type: "string",
              message: "The name of the company is required",
            },
          ]}
        >
          <Input
            placeholder="Company name"
            name="companyName"
            onChange={handleUpdateInput}
          />
        </Form.Item>
        <Form.Item
          name="creationDate"
          label="Creation date"
          rules={[
            {
              required: true,
              message: "Enter the company creation date",
            },
          ]}
        >
          <DatePicker
            name="creationDate"
            format="YYYY-MM-DD"
            onChange={(date, dateString) => handleUpdateDate(dateString)}
          />
        </Form.Item>
        <h2>Documentation</h2>
        <Form.Item
          name="document"
          label="Document"
          rules={[
            {
              required: false,
            },
          ]}
          tooltip={{
            title: "Document is optional",
            icon: <InfoCircleOutlined />,
          }}
        >
          <Input
            type="file"
            name="document"
            accept=".jpg, .jpeg, .png"
            bordered={false}
            onChange={handleUpdateDocument}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} className="buttons-container">
          <Button className="button" type="primary" htmlType="submit">
            Submit
          </Button>
          <Button
            className="button"
            type="primary"
            htmlType="button"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default RegistrationForm;
