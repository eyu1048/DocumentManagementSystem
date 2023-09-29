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
  subject: Joi.string().min(3).max(30).required().label("Subject"),
  Type: Joi.string().required().label("Type"),
  sender: Joi.string().required().label("Sender"),
  date_received: Joi.date().required().label("Date_received"),
});

const AddLetter = () => {
  const [formData, setFormData] = useState({
    subject: "",
    Type: "",
    sender: "",
    date_received: "",
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

    const { subject, Type, sender, date_received } = formData;

    const requestData = {
      subject,
      Type,
      sender,
      date_received,
    };

    try {
      await schema.validateAsync(requestData, { abortEarly: false });

      const response = await Axios.post(
        "http://localhost:3001/admin/addLetter",
        requestData
      );

      if (response.status === 200) {
        if (files) {
          const fileFormData = new FormData();
          fileFormData.append("file", selectedFile);

          try {
            const fileResponse = await Axios.post(
              `http://loca
              lhost:3001/admin/upload`,
              fileFormData
            );

            // console.log(fileResponse.data);

            const fileId = fileResponse.data._id;

            const letterId = response.data.data._id;

            await Axios.put(
              `http://localhost:3001/admin/letter/${letterId}/files`,
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
            subject: "",
            Type: "",
            sender: "",
            date_received: "",
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
                <h2 className="mb-4 form-label">Add Letter</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">Subject</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {errors.subject && (
                      <FormText className="text-danger">
                        {errors.subject}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">Type</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="Type"
                      value={formData.Type}
                      onChange={handleChange}
                    />
                    {errors.Type && (
                      <FormText className="text-danger">{errors.Type}</FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">Sender</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="sender"
                      value={formData.sender}
                      onChange={handleChange}
                    />
                    {errors.sender && (
                      <FormText className="text-danger">
                        {errors.sender}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="m-2 input-txt">
                      Date_Received
                    </Form.Label>
                    <Form.Control
                      className="input"
                      type="date"
                      name="date_received"
                      value={formData.date_received}
                      onChange={handleChange}
                    />
                    {errors.date_received && (
                      <FormText className="text-danger">
                        {errors.date_received}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group controlId="formFile">
                    <Form.Label className="m-2 input-txt">
                      Letter File
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
                      Create Letter
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

export default AddLetter;
