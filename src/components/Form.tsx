import type { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { updateInput, updateDocument, reset } from "../app/modules/formSlice";
import "./Form.css";

function Form() {
  const data = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();

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
      })
    );
  }

  function handleReset() {
    dispatch(reset());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.firstName);
    formData.append("email", data.email);
    formData.append("companyName", data.companyName);
    if (data.document.url && data.document.name) {
      const file = await (await fetch(data.document.url)).blob();
      formData.append("document", file, data.document.name);
    }
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: formData,
      });
      const jsonRes = (await response.json()) as unknown;
      console.log(jsonRes);
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
        onReset={handleReset}
        onSubmit={(event) => {
          void (async (event) => {
            await handleSubmit(event);
          })(event);
        }}
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
              <button type="reset">Reset</button>
            </li>
          </ul>
        </div>
      </form>
    </>
  );
}

export default Form;
