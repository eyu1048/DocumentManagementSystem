import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../header";
import "../styles/login.css";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required().label("Admin name"),
  password: Joi.string().required().label("Admin Password"),
}).options({ abortEarly: false });

const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validateAsync({ name, password });
      const response = await Axios.post(
        "http://localhost:3001/admin/login",
        {
          name,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      setCookies("access_token", response.data.token);
      navigate("/adminPage");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        setErrors({ ...errors, password: "password Invalid" });
      } else if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data.message;
        setErrors({ ...errors, name: "Admin not found" });
      } else {
        console.log(error);
      }
    }
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
    setErrors({ ...errors, name: "" }); // Clear the name error
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setErrors({ ...errors, password: "" }); // Clear the password error
  };

  return (
    <>
      <Header />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={6}>
            <h2 className="mb-4 form-label">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label className="m-2 input-txt">Admin name</Form.Label>
                <Form.Control
                  className="input"
                  type="text"
                  // placeholder="Enter your name"
                  value={name}
                  onChange={handleChangeName}
                  required
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label className="m-2 input-txt">
                  Admin Password
                </Form.Label>
                <Form.Control
                  className="input input-last"
                  type="password"
                  // placeholder="Enter your password"
                  value={password}
                  onChange={handleChangePassword}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password}</p>
                )}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" className="button">
                  Login
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLogin;
