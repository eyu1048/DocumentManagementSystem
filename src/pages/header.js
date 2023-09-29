import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar
      bg="gray"
      variant="dark"
      expand="lg"
      style={{ backgroundColor: "rgb(251, 248, 248)" }}
    >
      <Navbar.Brand
        as={Link}
        to="/"
        style={{ paddingLeft: "1rem", color: "#777", fontWeight: "500" }}
      >
        Home
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          {/* Add additional navigation links here */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
