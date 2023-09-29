import React from "react";
import "./styles/Home.css";
import FrontImage from "../images/front-image.jpeg";
import dms1 from "../images/dms1.jpeg";
import dms2 from "../images/dms2.jpeg";
import dms3 from "../images/dms3.jpeg";
import { Link } from "react-router-dom";

const HomeInfo = () => {
  return (
    <div>
      <section className="block black">
        <div class="block-container">
          <header className="block-header">
            <h1>File Management System</h1>
            <p>
              Effortlessly organize your files with our innovative solutions.
            </p>
          </header>
          <picture className="block-picture">
            <img src={FrontImage} alt="image" className="img" />
          </picture>
        </div>
      </section>

      <section>
        <div className="document-header">
          <h2 className="blue">Track and Manage Your Documents</h2>
          <p className="gray">
            Simplifying Document Management for Your Business.
          </p>
        </div>
        <div class="block-container">
          <header className="block-header ">
            <h3 className="blue">Super Easy To Use</h3>
            <p className="gray">
              Say goodbye to complicated file management systems - ours is
              simple and easy to use, allowing you to focus on what really
              matters - getting your work done efficiently. Our file management
              system is designed with user-friendliness in mind, making it
              incredibly easy to navigate and use.
            </p>
          </header>
          <picture className="block-picture">
            <img src={dms1} alt="image" className="img" />
          </picture>
        </div>
      </section>
      <section>
        <div class="block-container">
          <picture className="block-picture">
            <img src={dms2} alt="image" className="img" />
          </picture>
          <header className="block-header ">
            <h3 className="blue">Securely Store and Access Your Documents</h3>
            <p className="gray">
              Our document management system offers a secure and convenient way
              to store and access your documents. Our system allows you to
              upload, organize, and manage your documents with ease, making it
              simple to find the files you need quickly and efficiently.
            </p>
          </header>
        </div>
      </section>

      <section>
        <div class="block-container">
          <header className="block-header ">
            <h3 className="blue">Working Smarter with Your Documents</h3>
            <p className="gray">
              Our file management system is designed to help you work smarter
              with your documents. With our system, you can quickly and easily
              upload, organize, and manage all your files in one place, making
              it simple to find what you need when you need it.
            </p>
          </header>
          <picture className="block-picture">
            <img src={dms3} alt="image" className="img" />
          </picture>
        </div>
      </section>
      <footer className="footer">
        <p>© 2023 by File Management System. All rights reserved.</p>
        <div>
          <Link className="navbar-link blue">Admin</Link>
          <Link className="navbar-link blue">User</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomeInfo;
