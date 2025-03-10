import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/UserRegistration.CSS'; // Custom styling
import Layout from "./Layout";

const UserRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.role) {
      setError('All fields are required!');
      setSuccess('');
    } else {
      setError('');
      setSuccess('Registration Successful!');
    }
  };

  return (
    <Layout>
      <div id="raw-materials">
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
          <Row className="w-100">
            <Col md={12} className="bg-gradient p-5 rounded shadow-lg">
              <div className="registration-card">
                <h3 className="text-center mb-4 text-black font-weight-bold">Create an Account</h3>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label className="text-black">Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="registration-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label className="text-black">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="registration-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label className="text-black">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="registration-input"
                      required
                    />
                  </Form.Group>

                  {/* Role Select Dropdown */}
                  <Form.Group controlId="formRole" className="mb-3">
                    <Form.Label className="text-black">Role in Organization</Form.Label>
                    <Form.Control
                      as="select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="registration-input"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Sales">Sales</option>
                      <option value="Viewer">Viewer</option>
                    </Form.Control>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mt-4 registration-btn">
                    Register
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default UserRegistrationPage;
