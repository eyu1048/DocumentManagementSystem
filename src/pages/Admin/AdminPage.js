import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import DashboardNav from "./dashboard-navbar";
import Dashboards from "./dashboard";

import "../styles/adminPage.css";

const Dashboard = () => {
  return (
    <>
      <DashboardNav />

      <section className="dashboard-container">
        <Dashboards />
        <div className="dashboard-info background"></div>
      </section>
    </>
  );
};

export default Dashboard;
