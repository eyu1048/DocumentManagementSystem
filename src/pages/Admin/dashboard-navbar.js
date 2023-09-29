import React from "react";
import "../styles/adminPage.css";
import { Link } from "react-router-dom";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const DashboardNav = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    navigate("/adminLogin");
  };
  return (
    <div className="navbar-container">
      <div className="navbar-items">
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/adminPage" className="navbar-link ">
          <p className="pre-hamburger">Admin</p>
        </Link>
      </div>
      <div className="logout">
        {/* <GiHamburgerMenu /> */}
        <button className="btn btn-primary" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardNav;
