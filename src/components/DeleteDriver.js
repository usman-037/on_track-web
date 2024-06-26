// DeleteDriver.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteDriver = () => {

    const [deleteUserEmail, setDeleteUserEmail] = useState('');

  const handleDeleteInputChange = (e) => {
    setDeleteUserEmail(e.target.value);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL encode the email parameter
      const encodedEmail = encodeURIComponent(deleteUserEmail);
      await axios.delete(`http://localhost:3001/api/users/driver/${encodedEmail}`);
      alert('Driver deleted successfully.');  
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete driver. Please try again.');  
    }
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
      <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
        <h1>Delete Driver</h1>
        </div>
        <hr className="bold-hr" />
      </div>

        <div className="form-group">
          <label>Complete Driver Email:</label>
          <input type="text" name="deleteUserEmail" value={deleteUserEmail} onChange={handleDeleteInputChange} required />
        </div>
        <br></br>
        
        <div>
        <div className="route-form">
          <button className="delete-button1" type="submit" onClick={handleDeleteSubmit}>Delete Driver</button>
        </div>
      </div>
      
    </div>
  );

};

export default DeleteDriver;