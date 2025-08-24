import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FaHome, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <Container className="page-transition">
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 mb-4">
              <FaHome className="text-primary me-3" />
              Bienvenido a Peeps
            </h1>
            <p className="lead text-muted">
              Tu red social para conectar con amigos y compartir momentos especiales
            </p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Alert variant="info" className="text-center">
            <h5 className="mb-3">
              <FaUserPlus className="me-2" />
              ¿Eres nuevo en Peeps?
            </h5>
            <p className="mb-3">
              Regístrate para comenzar a usar todas las funcionalidades de la plataforma
            </p>
            <p className="mb-0">
              <strong>¡Únete a nuestra comunidad!</strong>
            </p>
          </Alert>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={6} className="mb-4">
          <div className="text-center p-4">
            <FaUserPlus className="text-primary mb-3" style={{ fontSize: '3rem' }} />
            <h4>Regístrate</h4>
            <p className="text-muted">
              Crea tu cuenta y comienza a explorar Peeps
            </p>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="text-center p-4">
            <FaSignInAlt className="text-primary mb-3" style={{ fontSize: '3rem' }} />
            <h4>Inicia Sesión</h4>
            <p className="text-muted">
              Accede a tu cuenta existente
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
