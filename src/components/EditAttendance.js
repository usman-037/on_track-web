import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styling/Manage.css";

const EditAttendance = () => {
  const { femail } = useParams(); // Assuming femail is used as a parameter
  const [attendanceData, setAttendanceData] = useState(null); // State to store attendance data
  const [fcmtoken,setfcmtoken]=useState(''); // State to store attendance data
  const [updatedAttendance, setUpdatedAttendance] = useState({
    femail: '',
    userName: '',
    routeNo: 0,
    attendanceStatus: '',
    date: ''
  }); // State to store updated attendance data

  useEffect(() => {
    fetchAttendanceData();
  }, [femail]); // Fetch attendance data whenever femail parameter changes
  const fcmtokenn = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/${femail}`);
      // Access the fcmtoken property from the response data
      const fetchedFcmtoken = response.data.fcmtoken;
      setfcmtoken(fetchedFcmtoken);
      console.log(fetchedFcmtoken); // Assuming 'fcmtoken' is the key in the response data
    } catch (error) {
      alert('Email not found');
      console.error('Error searching Attendance:', error);
    }
  };
  
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/attendance/search?femail=${femail}`);
      console.log('Attendance Data:', response.data); // Log the response data
  
      // Select the first attendance record from the array
      const firstAttendanceRecord = response.data[0];
  
      // Update the state with the selected attendance record
      setAttendanceData(response.data);
      setUpdatedAttendance({
        femail: firstAttendanceRecord.femail,
        userName: firstAttendanceRecord.userName,
        routeNo: firstAttendanceRecord.routeNo,
        attendanceStatus: firstAttendanceRecord.attendanceStatus,
        date: firstAttendanceRecord.date
      });
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAttendance({ ...updatedAttendance, [name]: value });
  };

  const updateAttendance = async () => {
    try {
      await fcmtokenn();
      const updatedAttendanceWithToken = {  fcmtoken,...updatedAttendance };
  
      // Make the API call with updated data
      await axios.put(`http://localhost:3001/api/attendance/${femail}`, updatedAttendanceWithToken);
      alert('Attendance updated successfully');
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Error updating attendance. Please try again.');
    }
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Edit Attendance</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <div>
        {attendanceData && (
          <div>
            <div className="form-group">
              <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Email:</label>
              <input type="text" name="femail" value={updatedAttendance.femail} onChange={handleInputChange} />
            </div>
            <div className="spacer15"></div>
            <div className="form-group">
              <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Name:</label>
              <input type="text" name="userName" value={updatedAttendance.userName} onChange={handleInputChange} />
            </div>
            <div className="spacer15"></div>
            <div className="form-group">
              <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Route No:</label>
              <input type="number" name="routeNo" value={updatedAttendance.routeNo} onChange={handleInputChange} />
            </div>
            <div className="spacer15"></div>
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Attendance Status:</label>
            <select
              name="attendanceStatus"
              value={updatedAttendance.attendanceStatus} // Corrected value prop
              onChange={handleInputChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <div className="spacer15"></div>
            <div className="form-group">
              <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Date:</label>
              <input type="text" name="date" value={updatedAttendance.date} onChange={handleInputChange} />
            </div>
          </div>
        )}
        <div className="spacer25"></div>
        <button className="goto-button" onClick={updateAttendance}>Update Attendance</button>
      </div>
    </div>
  );
};

export default EditAttendance;