// DeleteUser.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteUser = () => {

  const [deleteUserEmail, setDeleteUserEmail] = useState('');

  const handleDeleteInputChange = (e) => {
    setDeleteUserEmail(e.target.value);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL encode the email parameter
      const encodedEmail = encodeURIComponent(deleteUserEmail);
      await axios.delete(`http://localhost:3001/api/users/${encodedEmail}`);
      alert('User deleted successfully.');  
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');  
    }
  };
  

  return (
    <div className="manage-routes-container">
      <div className="header">
      <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
        <h1>Delete User</h1>
        </div>
        <hr className="bold-hr" />
      </div>

        <div className="form-group">
          <label>Complete User Email:</label>
          <input type="text" name="deleteUserEmail" value={deleteUserEmail} onChange={handleDeleteInputChange} required />
        </div>
        <br></br>
        
        <div>
        <div className="route-form">
          <button className="delete-button1" type="submit" onClick={handleDeleteSubmit}>Delete User</button>
        </div>
      </div>
      
    </div>
  );
};

export default DeleteUser;