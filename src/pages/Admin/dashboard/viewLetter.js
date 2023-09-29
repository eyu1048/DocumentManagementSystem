import React, { useState, useEffect } from "react";
import DashboardNav from "../dashboard-navbar";
import Dashboards from "../dashboard";
import { Modal, Button, Form, FormText, Table } from "react-bootstrap";

import Axios from "axios";
import Joi from "joi";
import moment from "moment";

const schema = Joi.object({
  subject: Joi.string().min(3).max(35).required().label("Subject"),
  Type: Joi.string().min(3).max(255).required().label("Type"),
  sender: Joi.string().min(3).max(30).required().label("Sender"),
  date_received: Joi.date().required().label("Received_Date"),
});

const ViewLetter = () => {
  const [letters, setLetters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updatedLetter, setUpdatedLetter] = useState({});
  const [formData, setFormData] = useState({
    subject: "",
    Type: "",
    sender: "",
    date_received: "",
  });

  const [text, setText] = useState({});
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/admin/letter");
        setLetters(response.data.data);
      } catch (ex) {
        console.log(ex);
      }
    };
    fetchData();
  }, [letters]);

  const handleSearch = (e) => {
    setText(e.target.value);

    const filteredLetters = letters.filter((project) =>
      project.subject.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLetters(filteredLetters);
  };

  const handleDelete = (id) => {
    Axios.delete(`http://localhost:3001/admin/letter/${id}`)
      .then(() =>
        setLetters((prevletter) => prevletter.filter((u) => u._id !== id))
      )
      .catch((ex) => console.log(ex));
  };

  const handleEdit = (letter) => {
    setShowModal(true);
    setUpdatedLetter(letter);
    setFormData({
      subject: letter.subject || "",
      Type: letter.Type || "",
      sender: letter.sender || "",
      date_received: letter.date_received || "",
    });
  };

  const handleUpdate = async () => {
    const { _id, files, __v, ...updatedLetterData } = updatedLetter;

    try {
      await schema.validateAsync(updatedLetterData, { abortEarly: false });
      const response = await Axios.put(
        `http://localhost:3001/admin/letter/${_id}`,
        updatedLetterData
      );

      const updatedLetters = letters.map((letter) => {
        if (letter._id === _id) {
          return response.data.data;
        } else {
          return letter;
        }
      });

      setLetters(updatedLetters);
      setUpdatedLetter({});
      setShowModal(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setUpdatedLetter((prevLetter) => ({
      ...prevLetter,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStartDateChange = (e) => {
    const formattedValue = e.target.value; // No need to format the value using moment here
    setUpdatedLetter((prevLetter) => ({
      ...prevLetter,
      [e.target.name]: formattedValue,
    }));
    handleChange({ target: { name: e.target.name, value: formattedValue } });
  };

  // const formattedStartDate = moment(
  //   updatedProjectData.startDate,
  //   "YYYY-MM-DD"
  // ).format("YYYY-MM-DD");

  return (
    <>
      <DashboardNav />
      <section className="dashboard-container">
        <Dashboards />
        <div className="dashboard-info p-3">
          <Form.Control
            type="text"
            placeholder="Enter subject to search"
            value={text}
            onChange={handleSearch}
            style={{ maxWidth: "40%", marginBottom: "1.5rem" }}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Type</th>
                <th>Sender</th>
                <th>Date_Received</th>
                <th>File_names</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(text !== "" && filteredLetters.length > 0
                ? filteredLetters
                : letters
              ).map((letter) => {
                if (!letter) return <div>Loading...</div>;

                const formattedDate = new Date(letter.date_received)
                  .toISOString()
                  .split("T")[0];
                return (
                  <tr key={letter._id}>
                    <td>{letter.subject}</td>
                    <td>{letter.Type}</td>
                    <td>{letter.sender}</td>
                    <td>{formattedDate}</td>
                    <td>
                      {letter.files.length > 0
                        ? letter.files.map((file) => (
                            <>
                              {/* {console.log(file.path)} */}
                              <a
                                style={{
                                  textDecoration: "none",
                                }}
                                key={file._id}
                                href={`http://localhost:3001/admin/${file.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {file.name}
                              </a>
                            </>
                          ))
                        : "No files"}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(letter)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(letter._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {showModal && (
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              id="editUserModal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Letters Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label className="label">Subject</Form.Label>
                    <Form.Control
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
                    <Form.Label className="label">Type</Form.Label>
                    <Form.Control
                      description="text"
                      name="Type"
                      value={formData.Type}
                      onChange={handleChange}
                    />
                    {errors.Type && (
                      <FormText className="text-danger">{errors.Type}</FormText>
                    )}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="label">Sender</Form.Label>
                    <Form.Control
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
                    <Form.Label className="label">received_date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_received"
                      value={
                        formData.date_received
                          ? moment(formData.date_received).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleStartDateChange}
                    />
                    {errors.received_date && (
                      <FormText className="text-danger">
                        {errors.received_date}
                      </FormText>
                    )}
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdate}
                  disabled={
                    !formData.subject ||
                    !formData.Type ||
                    !formData.sender ||
                    !formData.date_received
                  }
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </section>
    </>
  );
};

export default ViewLetter;
