import React, { useState, useEffect } from "react";
import DashboardNav from "../dashboard-navbar";
import Dashboards from "../dashboard";
import { Modal, Button, Form, FormText, Table } from "react-bootstrap";

import Axios from "axios";
import Joi from "joi";
import moment from "moment";

const schema = Joi.object({
  name: Joi.string().min(3).max(35).required().label("Name"),
  description: Joi.string().min(3).max(255).required().label("Description"),
  status: Joi.string().min(3).max(30).required().label("Status"),
  priority: Joi.string().min(3).max(30).required().label("Priority"),

  startDate: Joi.date().required().label("StartDate"),
  endDate: Joi.date().required().label("EndDate"),
  budget: Joi.number().min(10000).required().label("Budget"),
});

const ViewProject = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
    budget: 0,
  });
  const [text, setText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/admin/project");
        setProjects(response.data.data);
      } catch (ex) {
        console.log(ex);
      }
    };
    fetchData();
  }, [projects]);

  const handleSearch = (e) => {
    setText(e.target.value);

    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProjects(filteredProjects);
  };

  const handleEdit = (project) => {
    setShowModal(true);
    setUpdatedProject(project);
    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "",
      priority: project.priority || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      budget: project.budget || 0,
    });
  };

  const handleUpdate = async () => {
    const { _id, files, __v, ...updatedProjectData } = updatedProject;

    const formattedStartDate = moment(
      updatedProjectData.startDate,
      "YYYY-MM-DD"
    ).format("YYYY-MM-DD");
    const formattedEndDate = moment(
      updatedProjectData.endDate,
      "YYYY-MM-DD"
    ).format("YYYY-MM-DD");
    try {
      await schema.validateAsync(updatedProjectData, { abortEarly: false });
      const response = await Axios.put(
        `http://localhost:3001/admin/project/${_id}`,
        updatedProjectData
      );

      const updatedProjects = projects.map((project) => {
        if (project._id === _id) {
          console.log(response.data.data);
          return response.data.data;
        } else {
          return project;
        }
      });

      setProjects(updatedProjects);
      setUpdatedProject({});
      setShowModal(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleDelete = (id) => {
    Axios.delete(`http://localhost:3001/admin/project/${id}`)
      .then(() =>
        setProjects((prevproject) => prevproject.filter((u) => u._id !== id))
      )
      .catch((ex) => console.log(ex));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setUpdatedProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStartDateChange = (e) => {
    const formattedValue = e.target.value; // No need to format the value using moment here
    setUpdatedProject((prevProject) => ({
      ...prevProject,
      [e.target.name]: formattedValue,
    }));
    handleChange({ target: { name: e.target.name, value: formattedValue } });
  };

  return (
    <>
      <DashboardNav />

      <section className="dashboard-container">
        <Dashboards />
        <div className="dashboard-info p-3">
          <Form.Control
            type="text"
            placeholder="Enter name to search"
            value={text}
            onChange={handleSearch}
            style={{ maxWidth: "40%", marginBottom: "1.5rem" }}
          />
          <Table
            striped
            bordered
            hover

            // style={{ padding: "1.5rem" }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>StartDate</th>
                <th>EndDate</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {(text !== "" && filteredProjects.length > 0
                ? filteredProjects
                : projects
              ).map((project) => {
                if (!project) return <div>Loading...</div>;

                // Format start date and end date
                const formattedStartDate = new Date(project.startDate)
                  .toISOString()
                  .split("T")[0];
                const formattedEndDate = new Date(project.endDate)
                  .toISOString()
                  .split("T")[0];
                return (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td>{project.status}</td>
                    <td>{project.priority}</td>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{project.budget}</td>
                    <td>
                      {project.files.length > 0
                        ? project.files.map((file) => (
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
                                {/* {file.path} */}
                              </a>
                              {/* <FiEye size={20} /> */}
                            </>
                          ))
                        : "No files"}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(project)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(project._id)}
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
                <Modal.Title>Edit Project Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label className="label">name</Form.Label>
                    <Form.Control
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
                    <Form.Label className="label">description</Form.Label>
                    <Form.Control
                      description="text"
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
                    <Form.Label className="label">status</Form.Label>
                    <Form.Control
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
                    <Form.Label className="label">priority</Form.Label>
                    <Form.Control
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
                    <Form.Label className="label">StartDate</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={
                        formData.startDate
                          ? moment(formData.startDate).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleStartDateChange}
                    />
                    {errors.startDate && (
                      <FormText className="text-danger">
                        {errors.startDate}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="label">EndDate</Form.Label>
                    <Form.Control
                      type="date"
                      // placeholder="YYYY-MM-DD"
                      name="endDate"
                      // value={formData.endDate}
                      // value={moment(formData.endDate).format("YYYY-MM-DD")}
                      // onChange={handleChange}
                      value={
                        formData.endDate
                          ? moment(formData.endDate).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleStartDateChange}
                    />
                    {errors.endDate && (
                      <FormText className="text-danger">
                        {errors.endDate}
                      </FormText>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="label">Budget</Form.Label>
                    <Form.Control
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
                    !formData.name ||
                    !formData.description ||
                    !formData.status ||
                    !formData.priority ||
                    !formData.startDate ||
                    !formData.endDate ||
                    !formData.budget
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

export default ViewProject;
