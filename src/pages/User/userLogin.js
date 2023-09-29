import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import Header from "../header";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required().label("User Name"),
  empId: Joi.number().required().label("User empId"),
}).options({ abortEarly: false });

const UserLogin = () => {
  // const [empId, setEmpId] = useState("");
  const [form, setForm] = useState({ name: "", empId: "" });
  const [errors, setErrors] = useState({});
  const [_, setCookies] = useCookies(["access_user_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validateAsync(form);
      const response = await Axios.post(
        "http://localhost:3001/users/userLogin",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response.data);
      setCookies("access_user_token", response.data.token);
      window.localStorage.setItem("empID", response.data.empId);
      navigate("/userPage");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (error.response.data.message === "name does not match with empId") {
          setErrors({ ...errors, empId: "name does not match with empId" });
          // } else if (error.response.data.message === "employee id Invalid") {
          //   setErrors({ ...errors, empId: "Employee ID Invalid" });
          // }
        } else if (error.response && error.response.status === 500) {
          console.log(error.response.data.error);
        } else {
          console.log(error);
        }
      }
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    const processedValue = name === "empId" ? parseInt(value, 10) : value;
    setForm((prev) => ({ ...prev, [name]: processedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  return (
    <>
      <Header />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={6}>
            <h2 className="mb-4 form-label">User Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label className="m-2 input-txt">Name</Form.Label>
                <Form.Control
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {/* {errors.name && <p className="text-danger">{errors.name}</p>} */}
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label className="m-2 input-txt">empId</Form.Label>
                <Form.Control
                  className="input input-last"
                  type="number"
                  name="empId"
                  placeholder="Enter your ID"
                  value={form.empId}
                  onChange={handleChange}
                  required
                />
                {errors.empId && <p className="text-danger">{errors.empId}</p>}
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

export default UserLogin;
