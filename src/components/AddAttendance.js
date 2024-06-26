import React, { useState } from "react";
import axios from 'axios';
import "../styling/Manage.css";

const AddAttendance = () => {
  const [newAttendance, setNewAttendance] = useState({
    femail: '',
    userName: '',
    routeNo: 0,
    attendanceStatus: 'Present', // Default status set to 'Present'
    date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance({ ...newAttendance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/attendance', newAttendance);
      alert('Attendance Added Successfully');
      setNewAttendance({
        femail: '',
        userName: '',
        routeNo: 0,
        attendanceStatus: 'Present', // Reset status to 'Present' after submission
        date: ''
      });
    } catch (error) {
      console.error('Error adding attendance:', error);
      alert('Failed to add attendance. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="header">
      <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Add Attendance Record</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Name:</label>
          <input type="text" name="userName" value={newAttendance.userName} onChange={handleInputChange} required />
        </div>
        <div className="spacer15"></div>
        <div className="form-group">
          <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Email:</label>
          <input type="text" name="femail" value={newAttendance.femail} onChange={handleInputChange} required />
        </div>
        <div className="spacer15"></div>
        <div className="form-group">
          <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Route No:</label>
          <input type="number" name="routeNo" value={newAttendance.routeNo} onChange={handleInputChange} required />
        </div>
        <div className="spacer15"></div>
        <div className="form-group">
          <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Attendance Status:</label>
          <select
            name="attendanceStatus"
            value={newAttendance.attendanceStatus}
            onChange={handleInputChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <div className="spacer15"></div>
        <div className="form-group">
          <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Date:</label>
          <input type="text" name="date" value={newAttendance.date} onChange={handleInputChange} required />
        </div>
        <div className="spacer25"></div>
        <button type="submit" className="goto-button">Add Attendance</button>
      </form>
    </div>
  );
};

export default AddAttendance;