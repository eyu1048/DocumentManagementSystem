import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, FormText } from "react-bootstrap";

import Axios from "axios";

import "../../styles/login.css";
import "../../styles/adminPage.css";

import DashboardNav from "../dashboard-navbar";
import Dashboards from "../dashboard";
import Joi from "joi";

const schema = Joi.object({
  empId: Joi.number().min(0).max(500).required().label("empID"),

  name: Joi.string().min(3).max(30).required().label("Name"),
  occupation: Joi.string().required().label("Occupation"),
  department: Joi.string().required().label("Department"),
  file: Joi.any().optional(),
});

const Dashboard = () => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    occupation: "",
    department: "",
  });
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    Axios.get("http://localhost:3001/admin/files")
      .then((response) => setFiles(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { empId, name, occupation, department } = formData;

    const requestData = {
      empId,
      name,
      occupation,
      department,
    };

    try {
      await schema.validateAsync(requestData, { abortEarly: false });

      const response = await Axios.post(
        "http://localhost:3001/admin/addUser",
        requestData
      );

      // Upload the file if selected

      if (response.status === 200) {
        // const empId = response.data.data.empId;
        // The request was successful

        if (files) {
          const fileFormData = new FormData();
          fileFormData.append("file", selectedFile);

          try {
            const fileResponse = await Axios.post(
              `http://localhost:3001/admin/upload`,
              fileFormData
            );

            // console.log(fileResponse.data);

            const fileId = fileResponse.data._id;

            await Axios.put(`http://localhost:3001/admin/user/${empId}/files`, {
              fileId,
            });

            // update the files state with the new file
            setFiles([...files, fileResponse.data]);
            // reset the selected file and error state

            // show the alert here
            alert("file uploaded successfully");
            setSelectedFile(null);

            setErrors((prev) => ({ ...prev, file: "" }));
          } catch (error) {
            console.error(error);
          }

          alert("user created");
          // setFormData(response.data.data);

          setFormData({
            empId: "",
            name: "",
            occupation: "",
            department: "",
          });
          // navigate("/adminPage");
        } else if (response.status === 409) {
          // The request failed due to a conflict
          alert("empId must be unique");
        } else {
          // The request failed for some other reason
          alert(`Something went wrong: ${response.statusText}`);
        }
      }
    } catch (ex) {
      if (ex.response) {
        // The server returned an error response
        console.log(ex.response.data);
        console.log(ex.response.status);
        console.log(ex.response.headers);
        alert(` ${ex.response.data.message}`);
      } else if (ex.request) {
        // The request was made but no response was received
        console.log(ex.request);
        alert("Network error: Please check your internet connection");
      } else {
        // Something else happened in setting up or executing the request
        console.log(ex.message);
        alert(`Unknown error: ${ex.message}`);
      }
      if (ex?.details) {
        // Extract the validation errors from the Joi validation error
        const validationErrors = {};
        ex.details.forEach((error) => {
          validationErrors[error.context.key] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <>
      <DashboardNav />
      <section className="dashboard-container">
        <Dashboards />
        <div className="dashboard-info">
          <Container fluid className="mt-5">
            <Row className="justify-content-center">
              <Col lg={6}>
                <h2 className="mb-4 form-label">Create User</h2>

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formId">
                    <Form.Label className="m-2 input-txt">ID</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="empId"
                      value={formData.empId}
                      onChange={handleChange}
                    />
                    {errors.empId && (
                      <FormText className="text-danger">
                        {errors.empId}
                      </FormText>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formName">
                    <Form.Label className="m-2 input-txt">Name</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    {errors.name && (
                      <FormText className="text-danger">{errors.name}</FormText>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formOccupation">
                    <Form.Label className="m-2 input-txt">
                      Occupation
                    </Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                    {errors.occupation && (
                      <FormText className="text-danger">
                        {errors.occupation}
                      </FormText>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formDepartment">
                    <Form.Label className="m-2 input-txt">
                      Department
                    </Form.Label>
                    <Form.Control
                      className="input input-last"
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                    {errors.department && (
                      <FormText className="text-danger">
                        {errors.department}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group controlId="formFile">
                    <Form.Label className="m-2 input-txt">File</Form.Label>
                    {/* <button onClick={handleUpload}>Upload</button> */}
                    <Form.Control
                      className="input"
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" className="button">
                      Create User
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};

export default Dashboard;

// // handle file upload
// const handleUpload = () => {
//   const formData = new FormData();
//   // append the selected file to the form data
//   formData.append("file", selectedFile);
//   // send a post request to the server with the form data
//   Axios.post("http://localhost:3001/upload", formData)
//     .then((response) => {
//       // update the files state with the new file
//       setFiles([...files, response.data]);
//       // reset the selected file and error state

//       alert("file uploaded successfully");
//       setSelectedFile(null);
//       setErrors((prev) => ({ ...prev, file: "" }));
//     })
//     .catch((error) => {
//       // set the error state with the error message
//       // setError(error.message);
//       setErrors((prev) => ({ ...prev, file: error.message }));
//     });
// };
