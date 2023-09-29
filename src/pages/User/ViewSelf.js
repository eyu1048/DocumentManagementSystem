import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import UserDashboard from "./user-dashboard";
import UserNavBar from "./user-navbar";

const ViewSelf = () => {
  const [singleUser, setSingleUser] = useState([]);

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const empId = window.localStorage.getItem("empID");
        const response = await Axios.get(
          `http://localhost:3001/users/${empId}`
        );

        console.log(response.data);
        setSingleUser([response.data]);
      } catch (ex) {
        console.log(ex);
      }
    };

    fetchSingleData();
  }, []);
  return (
    <>
      <UserNavBar />
      <section className="dashboard-container">
        <UserDashboard />

        <div className="dashboard-info p-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>EmpId</th>
                <th>Name</th>
                <th>Occupation</th>
                <th>Department</th>
                <th>Files</th>
              </tr>
            </thead>
            <tbody>
              {singleUser.map((user) => {
                {
                  console.log(user);
                }
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
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
};

export default ViewSelf;
