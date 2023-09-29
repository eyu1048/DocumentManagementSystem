import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Table } from "react-bootstrap";
import DashboardNav from "../dashboard-navbar";
import Dashboards from "../dashboard";
import Dashboard from "../AdminPage";
import { Link } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { Modal, Button, Form, FormText } from "react-bootstrap";
import "./modal.css";
import Joi from "joi";
// import Form from 'react-bootstrap/Form';

const schema = Joi.object({
  empId: Joi.number().min(0).max(500).required().label("empID"),

  name: Joi.string().min(3).max(30).required().label("Name"),
  occupation: Joi.string().required().label("Occupation"),
  department: Joi.string().required().label("Department"),
  file: Joi.any().optional(),
});

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    occupation: "",
    department: "",
  });
  const [text, setText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/admin/user");
        // console.log(response.data);
        setUsers(response.data.data);
      } catch (ex) {
        console.log(ex);
      }
    };
    fetchData();
  }, [users]);

  const handleSearch = (e) => {
    setText(e.target.value);

    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredUsers(filteredUsers);
  };

  const handleEdit = (user) => {
    console.log(user);
    console.log(showModal);
    setShowModal(true);
    console.log(showModal);
    setUpdatedUser(user);
    setFormData({
      empId: user.empId || "",
      name: user.name || "",
      occupation: user.occupation || "",
      department: user.department || "",
    });
  };

  const handleUpdate = async () => {
    console.log(updatedUser);
    const { _id, files, __v, ...updatedUserData } = updatedUser; // Exclude _id from updatedUser
    //

    try {
      await schema.validateAsync(updatedUserData, { abortEarly: false });
      const response = await Axios.put(
        `http://localhost:3001/admin/user/${_id}`,
        updatedUserData
      );

      const updatedUsers = users.map((user) => {
        if (user._id === _id) {
          console.log(response.data.data);
          return response.data.data;
        } else {
          return user;
        }
      });

      setUsers(updatedUsers);

      setUpdatedUser({});
      setShowModal(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleDelete = (id) => {
    Axios.delete(`http://localhost:3001/admin/user/${id}`)
      .then(() =>
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id))
      )
      .catch((ex) => console.log(ex));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  return (
    <>
      <DashboardNav />
      <section className="dashboard-container">
        <Dashboards />
        <div className="dashboard-info p-3">
          {/* <input
            type="text"
            placeholder="Enter name to search"
            value={text}
            onChange={handleSearch}
          /> */}
          <Form.Control
            type="text"
            placeholder="Enter name to search"
            value={text}
            onChange={handleSearch}
            style={{ width: "40%", marginBottom: "1.5rem" }}
          />
          <Table
            striped
            bordered
            hover

            // style={{ padding: "1.5rem" }}
          >
            <thead>
              <tr>
                <th>EmpId</th>
                <th>Name</th>
                <th>Occupation</th>
                <th>Department</th>
                <th>Files</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(users)} */}
              {(text !== "" && filteredUsers.length > 0
                ? filteredUsers
                : users
              ).map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user.empId}</td>
                    <td>{user.name}</td>
                    <td>{user.occupation}</td>
                    <td>{user.department}</td>

                    <td>
                      {user.files.length > 0
                        ? user.files.map((file) => (
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
                        onClick={() => handleEdit(user)}
                      >
                        Update
                      </button>{" "}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                      {/* Delete */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {/* ) : (
                <p>No users found</p>
              )} */}
          {showModal && (
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              id="editUserModal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit User Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="editEmpID">
                    <Form.Label className="label">EmpId</Form.Label>
                    <Form.Control
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
                  <Form.Group controlId="name">
                    <Form.Label className="label">Name</Form.Label>
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
                  <Form.Group controlId="editUserOccupation">
                    <Form.Label className="label">Occupation</Form.Label>
                    <Form.Control
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
                  <Form.Group controlId="editUserDepartment">
                    <Form.Label className="label">Department</Form.Label>
                    <Form.Control
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
                    !formData.empId ||
                    !formData.name ||
                    !formData.occupation ||
                    !formData.department
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
export default ViewUser;

// {
//   {showModal && (
//     <div
//       className="modal-dialog"
//       id="editUserModal"
//       tabIndex="-1"
//       aria-labelledby="editUserModalLabel"
//       aria-hidden="true"
//     >
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title" id="editUserModalLabel">
//               Edit User Details
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//               onClick={() => setShowModal(false)}
//             ></button>
//           </div>
//           <div className="modal-body">
//             {/* <input type="hidden" id="editUserId"> */}
//             <div className="mb-3">
//               <label htmlFor="editEmpId" className="form-label">
//                 EmpId
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="editEmpID"
//                 name="empId"
//                 value={formData.empId}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="name" className="form-label">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="editUserOccupation"
//                 className="form-label"
//               >
//                 Occupation
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="editUserOccupation"
//                 name="occupation"
//                 value={formData.occupation}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="editUserDepartment"
//                 className="form-label"
//               >
//                 Department
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="editUserDepartment"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               data-bs-dismiss="modal"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handleUpdate}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )}
