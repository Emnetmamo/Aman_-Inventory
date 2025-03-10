import React, { useState } from 'react';
import axios from 'axios';
import '../../CSS/CustomerRegistration.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerRegistration() {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    email: '',
    tinNumber: ''
  });

  axios.defaults.withCredentials = true;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://amaninventoryserver.vercel.app/api/sales/customer/register', formData);
      toast.success('Customer registered successfully');
      setFormData({ customerName: '', phoneNumber: '', address: '', email: '', tinNumber: '' });
    } catch (error) {
      console.error('There was an error registering the customer!', error);
      toast.error('Error registering the customer');
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email (Optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">TIN Number</label>
          <input
            type="text"
            name="tinNumber"
            value={formData.tinNumber}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Register Customer</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CustomerRegistration;
