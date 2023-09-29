import React from "react";
import "../styles/adminPage.css";
import { Link } from "react-router-dom";

const UserNavBar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-items">
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/userPage" className="navbar-link ">
          <p className="pre-hamburger">User</p>
        </Link>
      </div>
      <div></div>
    </div>
  );
};

export default UserNavBar;
