import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const NavBar = () => {
  const [showNavbarItems, setShowNavbarItems] = useState(false);

  const toggleNavbarItems = () => {
    setShowNavbarItems(!showNavbarItems);
  };

  return (
    <header>
      <div className="navbar-containers">
        <div className="navbar-brands">
          <h2>
            {/* <GiHamburgerMenu /> */}
            FileMangementSystem
          </h2>
        </div>
        <div className={`navbar-item ${showNavbarItems ? "show" : ""}`}>
          <Link to="/AdminLogin" className="navbar-links">
            Admin
          </Link>
          <Link to="/userLogin" className="navbar-links">
            User
          </Link>
        </div>
        <div className="humburger-icon" onClick={toggleNavbarItems}>
          {showNavbarItems ? <IoMdClose /> : <GiHamburgerMenu />}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
