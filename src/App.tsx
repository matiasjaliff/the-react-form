import { useState } from "react";
import "./App.css";

interface Data {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  document: File | null;
}

function App() {
  const [data, setData] = useState<Data>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    document: null,
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const document = event.target.files ? event.target.files[0] : null;
    setData((prevState) => ({ ...prevState, document }));
  }

  async function handleSubmit() {
    console.log("Submit");
    const formData = new FormData();
    formData.append("first-name", data.firstName);
    formData.append("last-name", data.firstName);
    formData.append("email", data.email);
    formData.append("company-name", data.companyName);
    if (data.document) {
      formData.append("document", data.document);
    }
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: formData,
      });
      const jsonRes = (await response.json()) as unknown;
      console.log(jsonRes);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <h1>Registration Form</h1>
      <form
        encType="multipart/form-data"
        onSubmit={(event) => {
          event.preventDefault();
          void (async () => await handleSubmit())();
        }}
      >
        <div className="inputs-container" id="personal-inputs-container">
          <h2>Personal Information</h2>
          <ul className="inputs-list">
            <li>
              <label htmlFor="first-name">First name:</label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                placeholder="First name"
                minLength={2}
                required
                onChange={handleInputChange}
              />
            </li>
            <li>
              <label htmlFor="last-name">Last name:</label>
              <input
                type="text"
                id="last-name"
                name="lastName"
                placeholder="Last name"
                minLength={2}
                required
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </li>
          </ul>
        </div>
        <div className="inputs-container" id="business-inputs-container">
          <h2>Business Information</h2>
          <ul className="inputs-list">
            <li>
              <label htmlFor="company-name">Company name:</label>
              <input
                type="text"
                id="company-name"
                name="companyName"
                placeholder="Company name"
                minLength={2}
                required
                onChange={handleInputChange}
              />
            </li>
          </ul>
        </div>
        <div className="inputs-container" id="documentation-inputs-container">
          <h2>Documents</h2>
          <ul className="inputs-list">
            <li>
              <label htmlFor="documentation">Upload documentation:</label>
              <input
                type="file"
                id="documentation"
                name="documentation"
                accept=".jpg, .jpeg, .png"
                required
                onChange={handleDocumentChange}
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
    </div>
  );
}

export default App;
