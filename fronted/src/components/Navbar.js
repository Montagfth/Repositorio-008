import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import peepsLogo from '../assets/peeps-logo.jpg';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
          <img
            src={peepsLogo}
            height="45"
            className="d-inline-block align-top me-3"
            alt="Peeps Logo"
            style={{ borderRadius: '8px' }}
          />
          <span className="fw-bold fs-3 text-primary">Peeps</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center px-3 fw-medium">
              <FaHome className="me-2" />
              INICIO
            </Nav.Link>
          </Nav>
          
          <Nav className="ms-auto">
            <Button 
              as={Link} 
              to="/login" 
              variant="outline-light" 
              className="me-2 px-3"
            >
              <FaSignInAlt className="me-2" />
              Iniciar Sesión
            </Button>
            <Button 
              as={Link} 
              to="/register" 
              variant="primary"
              className="px-3"
            >
              <FaUserPlus className="me-2" />
              Registrarse
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;