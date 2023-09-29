import React, { useState } from "react";
import { FaChartBar, FaUserPlus, FaUsers, FaFileAlt } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import "../styles/adminPage.css";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const Dashboards = () => {
  const [showDashboardLists, setshowDashboardLists] = useState(false);

  const toggleIcon = () => {
    setshowDashboardLists(!showDashboardLists);
  };
  // {`dashboard ${showDashboardLists ? "show" : ""}`}
  return (
    <div className="container-dashboard">
      <div className={`dashboard ${showDashboardLists ? "show" : ""}`}>
        <div className="dashboard-list dashboard-list-item">
          {/* <FaChartBar className="dashboard-icon" /> */}

          <Link className="dashboard-link">Dashboard</Link>
        </div>
        <div className="dashboard-list dashboard-list-item">
          <FaUserPlus className="dashboard-icon" />
          <Link to="/addUser" className="dashboard-link">
            Add User
          </Link>
        </div>
        <div className="dashboard-list dashboard-list-item">
          <FaUsers className="dashboard-icon" />
          <Link to="/viewUser" className="dashboard-link">
            View User
          </Link>
        </div>
        <div className="dashboard-list dashboard-list-item">
          <FaFileAlt className="dashboard-icon" />
          <Link to="/addProject" className="dashboard-link">
            Add Project
          </Link>
        </div>
        <div className="dashboard-list dashboard-list-item">
          <FaFileAlt className="dashboard-icon" />
          <Link to="/viewProject" className="dashboard-link">
            View Project
          </Link>
        </div>

        <div className="dashboard-list dashboard-list-item">
          <AiOutlineMail className="dashboard-icon" />
          <Link to="/addLetter" className="dashboard-link">
            Add Letter
          </Link>
        </div>
        <div className="dashboard-list dashboard-list-item">
          <AiOutlineMail className="dashboard-icon" />
          <Link to="/viewLetter" className="dashboard-link">
            View Letter
          </Link>
        </div>
      </div>
      <div className="hamburger-icon " onClick={toggleIcon}>
        {showDashboardLists ? <IoMdClose /> : <GiHamburgerMenu />}
      </div>
    </div>
  );
};

export default Dashboards;
