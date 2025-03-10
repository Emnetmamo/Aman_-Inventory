import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LOGIN from "../Images/sunsetreal.jpeg";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
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
    <Container fluid style={{
      height: '100vh',
      backgroundImage: `url(${LOGIN})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Row className="w-100">
        <Col md={6} className="d-none d-md-block">
          {/* The background image is applied to the Container, no need for additional image in the column */}
        </Col>
        <Col md={6} style={{
          background: 'rgba(0, 0, 0, 0.1)', /* Semi-transparent background */
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 6px 12px rgba(255, 255, 255, 0.01)',
          backdropFilter: 'blur(15px)', /* Apply blur effect behind the card */
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ width: '100%' }}>
            <h2 className="text-center mb-4 text-white ">AMK PLC</h2>
            {/* <h4 className="text-center mb-2 text-white">Welcome Back!</h4> */}
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label className="text-black">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  className="login-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '20px',
                    fontSize: '1.1rem',
                    transition: 'border-color 0.3s ease-in-out'
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label className="text-black">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '20px',
                    fontSize: '1.1rem',
                    transition: 'border-color 0.3s ease-in-out'
                  }}
                />
              </Form.Group>
              <Button type="submit" className="w-100 mt-4" style={{
                backgroundColor: '#12323a',
                border: 'none',
                color: '#fff',
                padding: '12px',
                fontSize: '1.2rem',
                borderRadius: '12px',
                transition: 'background-color 0.3s ease'
              }}>
                Log In
              </Button>
              <div className="text-center mt-3">
                <a href="#" className="text-muted" style={{
                  color: '#6c757d',
                  textDecoration: 'none'
                }}>Forgot Password?</a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
