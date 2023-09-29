import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/adminPage.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const UserDashboard = () => {
  const [showDashboardLists, setshowDashboardLists] = useState(false);

  const toggleIcon = () => {
    setshowDashboardLists(!showDashboardLists);
  };
  return (
    <div>
      <div className={`dashboard ${showDashboardLists ? "show" : ""}`}>
        <div className="dashboard-list">
          {/* <FaChartBar className="dashboard-icon" /> */}
          <Link className="dashboard-link">Dashboard</Link>
        </div>
        <div className="dashboard-list">
          <FaUsers className="dashboard-icon" />
          <Link to="/viewSelf" className="dashboard-link">
            View Info
          </Link>
        </div>
      </div>
      <div className="hamburger-icon " onClick={toggleIcon}>
        {showDashboardLists ? <IoMdClose /> : <GiHamburgerMenu />}
      </div>
    </div>
  );
};

export default UserDashboard;
