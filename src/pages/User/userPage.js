import React from "react";

import UserNavBar from "./user-navbar";
import UserDashboard from "./user-dashboard";

const UserPage = () => {
  return (
    <>
      <UserNavBar />
      <section className="dashboard-container">
        <UserDashboard />

        <div className="dashboard-info background"></div>
      </section>

      {/* <Container fluid className="dashboard-container">
        <Row>
          <Col xs={12} md={2} className="dashboard-column">
            <div className="dashboard-list">
              <FaChartBar className="dashboard-icon" />
              <h4>Dashboard</h4>
            </div>
            <div className="dashboard-list">
              <h4>
                <FaUsers className="dashboard-icon" />
                <Link to="/viewSelf" className="dashboard-link">
                  View User List
                </Link>
              </h4>
            </div>
          </Col>
          <Col
            xs={12}
            md={10}
            className="dashboard-column dashboard-info-column"
          >
            <div className="dashboard-info">
              {/* Place your dashboard information components here */}
      {/* </div>
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default UserPage;
