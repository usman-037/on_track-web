import React, { useState } from 'react';
import axios from 'axios';
import '../styling/Manage.css';

const AddLostItemForm = () => {
  const [itemname, setItemName] = useState('');
  const [routeno, setRouteNo] = useState('');
  const [details, setDetails] = useState('');
  const [itemstatus, setItemStatus] = useState('Unclaimed'); //default value
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const postLostItem = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/reportandclaimlostitems', {
        itemname,
        routeno,
        details,
        base64string: image,
        itemstatus
      });
      alert('Item added successfully');
      console.log('Lost item added:', response.data);
      setItemName('');
      setRouteNo('');
      setDetails('');
      setItemStatus('');
      setImage(null);
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error('Error adding lost item:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Add Lost Item</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        postLostItem();
      }}>
        <div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Item Name</label>
            <input 
              type="text" 
              value={itemname} 
              onChange={(e) => setItemName(e.target.value)} 
              required 
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Route Number</label>
            <input 
              type="number" 
              value={routeno} 
              onChange={(e) => setRouteNo(e.target.value)} 
              required 
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Details</label>
            <textarea 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              required 
              style={{ width: '100%', maxWidth: '100%', minHeight: '70px' }}
              />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Item Status</label>
            <select
              value={itemstatus}
              onChange={(e) => setItemStatus(e.target.value)}
              required
            >
              <option value="Unclaimed">Unclaimed</option>
            </select>
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>
        </div>
        <div className="spacer25"></div>
        <button className="goto-button" type="submit">Add Lost Item</button>
      </form>
    </div>
  );
};

export default AddLostItemForm;