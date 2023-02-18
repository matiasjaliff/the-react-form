import { useEffect, useState, useRef } from "react";
import type { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { updateInput, updateDocument, reset } from "../app/modules/formSlice";
import { generateSecrets, generateRequestBody } from "../lib/crypto";
import "./Form.css";

function Form() {
  // Declare and initialize variables

  // Redux
  const data = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  // States
  const [sharedSecret, setSharedSecret] = useState<string>("");
  const [macKey, setMacKey] = useState<string>("");
  // References
  const formRef = useRef<HTMLFormElement>(null);

  // Generate and set sharedSecret (for encryption) and macKey (for authentication)

  useEffect(() => {
    generateSecrets(setSharedSecret, setMacKey);
  }, []);

  // Form handlers

  function handleUpdateInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(updateInput({ name, value }));
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
    formRef.current?.reset();
  }

  async function handleSubmit() {
    try {
      const requestHeaders = { "Content-Type": "application/json" };
      const requestBody = await generateRequestBody(data, sharedSecret, macKey);
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: requestHeaders,
        body: requestBody,
      });
      console.log("Response: ", await response.json());
      handleReset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Registration Form</h1>
      <form
        encType="multipart/form-data"
        onSubmit={(event) => {
          event.preventDefault();
          void (async () => {
            await handleSubmit();
          })();
        }}
        ref={formRef}
      >
        <div className="inputs-container" id="personal-inputs-container">
          <h2>Personal Information</h2>
          <ul className="inputs-list">
            <li>
              <label htmlFor="firstName">First name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                minLength={2}
                required
                onChange={handleUpdateInput}
              />
            </li>
            <li>
              <label htmlFor="lastName">Last name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                minLength={2}
                required
                onChange={handleUpdateInput}
              />
            </li>
            <li>
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleUpdateInput}
              />
            </li>
          </ul>
        </div>
        <div className="inputs-container" id="business-inputs-container">
          <h2>Business Information</h2>
          <ul className="inputs-list">
            <li>
              <label htmlFor="companyName">Company name:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Company name"
                minLength={2}
                required
                onChange={handleUpdateInput}
              />
            </li>
          </ul>
        </div>
        <div className="inputs-container" id="documentation-inputs-container">
          <h2>Documents</h2>
          <ul className="inputs-list">
            <li>
              <label htmlFor="document">Upload documentation:</label>
              <input
                type="file"
                id="document"
                name="document"
                accept=".jpg, .jpeg, .png"
                required
                onChange={handleUpdateDocument}
              />
            </li>
          </ul>
        </div>
        <div className="buttons-container">
          <ul className="buttons-list">
            <li>
              <button type="submit">Send</button>
            </li>
            <li>
              <button type="reset" onClick={handleReset}>
                Reset
              </button>
            </li>
          </ul>
        </div>
      </form>
    </>
  );
}

export default Form;
