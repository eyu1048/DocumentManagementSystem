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
  name: Joi.string().min(3).max(30).required().label("Name"),
  description: Joi.string().min(3).max(255).required().label("Description"),
  status: Joi.string().min(3).max(30).required().label("Status"),
  priority: Joi.string().min(3).max(30).required().label("Priority"),

  startDate: Joi.date().required().label("StartDate"),
  endDate: Joi.date().required().label("EndDate"),
  budget: Joi.number().min(10000).required().label("Budget"),
});

const AddProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
    budget: 0,
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
    // setFormData({ ...formData, [name]: value });
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, status, priority, startDate, endDate, budget } =
      formData;

    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

    const requestData = {
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      budget,
    };

    try {
      await schema.validateAsync(requestData, { abortEarly: false });

      console.log("Before Axios.post");
      const response = await Axios.post(
        "http://localhost:3001/admin/addProject",
        requestData
      );
      console.log("After Axios.post");

      console.log("response:", response.data.data);
      if (response.status === 200) {
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

            const projectId = response.data.data._id;

            await Axios.put(
              `http://localhost:3001/admin/project/${projectId}/files`,
              {
                fileId,
              }
            );

            // setFiles([...files, fileResponse.data]);
            setFiles((prevFiles) => [...prevFiles, fileResponse.data]);
            // reset the selected file and error state

            // show the alert here
            alert("file uploaded successfully");
            setSelectedFile(null);

            setErrors((prev) => ({ ...prev, file: "" }));
          } catch (error) {
            console.error(error);
          }

          alert("Project created");

          setFormData({
            name: "",
            description: "",
            status: "",
            priority: "",
            startDate: "",
            endDate: "",
            budget: 0,
          });
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
                <h2 className="mb-4 form-label">Add Project</h2>

                <Form onSubmit={handleSubmit}>
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

                  <Form.Group>
                    <Form.Label className="m-2 input-txt">
                      Description
                    </Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <FormText className="text-danger">
                        {errors.description}
                      </FormText>
                    )}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="m-2 input-txt">status</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    />
                    {errors.status && (
                      <FormText className="text-danger">
                        {errors.status}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">priority</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    />
                    {errors.priority && (
                      <FormText className="text-danger">
                        {errors.priority}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">StartDate</Form.Label>
                    <Form.Control
                      className="input"
                      type="date"
                      // placeholder="YYYY-MM-DD"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                    {errors.startDate && (
                      <FormText className="text-danger">
                        {errors.startDate}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">EndDate</Form.Label>
                    <Form.Control
                      className="input"
                      type="date"
                      // placeholder="YYYY-MM-DD"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                    {errors.endDate && (
                      <FormText className="text-danger">
                        {errors.endDate}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">budget</Form.Label>
                    <Form.Control
                      className="input"
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                    {errors.budget && (
                      <FormText className="text-danger">
                        {errors.budget}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group controlId="formFile">
                    <Form.Label className="m-2 input-txt">
                      Project File
                    </Form.Label>
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
                      Create Project
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
export default AddProject;
