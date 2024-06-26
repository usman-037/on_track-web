// ManageFee.js
import "../styling/Manage.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const ManageFee = () => {
    return (
    <div className="manage-routes-container">

     <div className="header">
     <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
      <h1>Manage Fee</h1>
      </div>
      <hr className="bold-hr" />
      </div>

      {/* Navigation Buttons */}
      
      <div style={{ display: 'flex', justifyContent: 'left'}}>
  <div className="button-container" style={{marginRight: '17px'}}>
    <Link to="/manage-buspass-fee">
      <button>Bus Pass Fee Management</button>
    </Link>
  </div>
  <div className="spacer15"></div>
  <div className="button-container" style={{marginLeft: '17px'}}>
    <Link to="/manage-transport-fee">
      <button>Transport Fee Management</button>
    </Link>
  </div>
</div>


      </div>
    );
};

export default ManageFee;
