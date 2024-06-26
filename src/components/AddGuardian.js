// AddGuardian.js
import React, { useState } from 'react';
import axios from 'axios';
import "../styling/Manage.css";

const AddGuardian = () => {
  const [newGuardian, setNewGuardian] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Guardian',
    route: '',
    stop: '',
    fee_status: '',
    student_email: '' // Make sure student_email is included
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuardian({ ...newGuardian, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make sure newGuardian includes student_email
      await axios.post('http://localhost:3001/api/guardians', newGuardian);
      alert('Guardian added successfully');
      setNewGuardian({
        name: '',
        email: '',
        password: '',
        role: 'Guardian',
        route: '',
        stop: '',
        fee_status: '',
        student_email: '' // Reset student_email after successful submission
      });
    } catch (error) {
      console.error('Error adding guardian:', error);
      alert('Failed to add guardian. Please try again.');
    }
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Add Guardian</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Guardian Name:</label>
            <input type="text" name="name" value={newGuardian.name} onChange={handleInputChange} required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Phone:</label>
            <input type="text" name="email" value={newGuardian.email} onChange={handleInputChange} autoComplete="off" required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Password:</label>
            <input type="password" name="password" value={newGuardian.password} onChange={handleInputChange} autoComplete="off" required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Child's Route:</label>
            <input type="number" name="route" value={newGuardian.route} onChange={handleInputChange} required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Child's Stop:</label>
            <input type="text" name="stop" value={newGuardian.stop} onChange={handleInputChange} required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Child's Email:</label>
            <input type="text" name="student_email" value={newGuardian.student_email} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ color: 'white' }}>
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Role (cannot be changed):</label>
          </div>
        </div>
        <button className="goto-button" type="submit">Add Guardian</button>
      </form>
    </div>
  );
};

export default AddGuardian;