// AddDriver.js
import React, { useState } from 'react';
import axios from 'axios';
import "../styling/Manage.css";

const AddDriver = () => {
    const [newDriver, setNewDriver] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Driver',
        route: '',
        stop: '',
        fee_status: ''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDriver({ ...newDriver, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:3001/api/users', newDriver);
          alert('Driver added successfully');
          setNewDriver({
            name: '',
            email: '',
            password: '',
            role: '',
            route: '',
            stop: '',
            fee_status: ''
          });
        } catch (error) {
          console.error('Error adding driver:', error);
          alert('Failed to add driver. Please try again.');
        }
      };


  return (
    <div className="manage-routes-container">
      <div className="header">
      <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
        <h1>Add Driver</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <form onSubmit={handleSubmit} >
        <div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Driver Name:</label>
            <input type="text" name="name" value={newDriver.name} onChange={handleInputChange} required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Email/Phone:</label>
            <input type="text" name="email" value={newDriver.email} onChange={handleInputChange} required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Password:</label>
            <input type="password" name="password" value={newDriver.password} onChange={handleInputChange} required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Route Assigned:</label>
            <input type="number" name="route" value={newDriver.route} onChange={handleInputChange} autoComplete="off" required />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Start Stop:</label>
            <input type="text" name="stop" value={newDriver.stop} onChange={handleInputChange} autoComplete="off" required />
          </div>
          <div className="form-group" style={{color: 'white' }}>
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Role (cannot be changed):</label>
        </div>
        </div>
        <button className="goto-button" type="submit">Add Driver</button>
      </form>
    </div>
  );
};

export default AddDriver;