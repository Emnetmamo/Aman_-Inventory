import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import LOGIN_IMAGE from '../Images/sunsetreal.jpeg';
import LOGO from '../Images/the guy.avif';

const LoginPage = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      navigate('/raw-materials');
    } else {
      alert('Please enter both username and password');
    }
  };



  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: '100vh', background: '#f4f7fc' }}>
      <Row className="w-100 shadow-lg" style={{ maxWidth: '900px', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Left Side - Login Form */}
        <Col md={6} className="p-5 bg-white d-flex flex-column justify-content-center">
        <h1 className="text-center fw-bold mb-5">AMK Plc</h1>
          <h3 className="fw-bold mb-3">Welcome Back!</h3>
          <p className="text-muted">Please log in to your account.</p>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-between mb-3">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="#" className="text-danger">Forgot password?</a>
            </div>
            <Button type="submit" className="w-100 py-2" style={{ backgroundColor: '#12323a', borderRadius: '20px' }}>
              Login
            </Button>
            <Button variant="outline-warning" className="w-100 mt-2 py-2" style={{ borderRadius: '20px' }}>
              Create Account
            </Button>
          </Form>
        </Col>

        {/* Right Side - Image Section */}
        <Col md={6} className="d-none d-md-block position-relative" style={{ backgroundImage: `url(${LOGIN_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
