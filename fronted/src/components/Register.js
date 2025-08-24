import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Solo frontend - no funcionalidad
    console.log('Formulario enviado:', formData);
  };

  return (
    <Container className="page-transition">
      <Row className="justify-content-center">
        <Col lg={6} md={8}>
          <Card className="shadow">
            <Card.Header className="text-center bg-success text-white">
              <h3 className="mb-0">
                <FaUserPlus className="me-2" />
                Crear Cuenta
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUserTag className="me-2" />
                    Nombre de Usuario
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="usuario123"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" />
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Tu nombre completo"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Correo Electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Confirmar Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Acepto los términos y condiciones"
                    required
                  />
                </Form.Group>

                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 mb-3"
                  size="lg"
                >
                  <FaUserPlus className="me-2" />
                  Crear Cuenta
                </Button>

                <div className="text-center">
                  <small className="text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Inicia sesión aquí
                    </Link>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
