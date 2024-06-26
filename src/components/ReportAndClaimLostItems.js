import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styling/ReportAndClaimLostItems.css';
import '../styling/Manage.css';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ReportAndClaimLostItems = () => {
  const [reportedItems, setReportedItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [routeToEdit, setRouteToEdit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for searching items by name

  useEffect(() => {
    fetchReportedItems();
    fetchClaimedItems();
  }, []);

  const fetchReportedItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reportandclaimlostitems');
      setReportedItems(response.data);
    } catch (error) {
      console.error('Error fetching reported items:', error);
    }
  };

  const fetchClaimedItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/claimitems');
      setClaimedItems(response.data);
    } catch (error) {
      console.error('Error fetching claimed items:', error);
    }
  };

  const handleEditReportedItem = async (itemId) => {
    setRouteToEdit(itemId);
  };

  const handleEditConfirmation = async (itemId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/reportandclaimlostitems/${itemId}`, { itemstatus: newStatus });
      const updatedReportedItems = reportedItems.map(item =>
        item._id === itemId ? { ...item, itemstatus: newStatus } : item
      );
      setReportedItems(updatedReportedItems);
      alert(`Reported item updated successfully to ${newStatus}.`);
    } catch (error) {
      console.error('Error editing reported item:', error);
      alert('Error editing reported item. Please try again.');
    } finally {
      setRouteToEdit(null);
    }
  };

  const cancelEdit = () => {
    setRouteToEdit(null);
  };

  const handleDeleteReportedItem = (itemId) => {
    setItemToDelete(itemId);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/reportandclaimlostitems/${itemToDelete}`);
      setReportedItems(reportedItems.filter(item => item._id !== itemToDelete));
      console.log('Reported item deleted successfully');
      alert('Reported item deleted successfully.');
    } catch (error) {
      console.error('Error deleting reported item:', error);
      alert('Error deleting reported item. Please try again.');
    } finally {
      setIsOpen(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteClaimedItem = async (itemId) => {
    const confirmed = window.confirm('Are you sure you want to delete this claimed item?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3001/api/claimitems/${itemId}`);
      fetchClaimedItems();
      alert('Claimed item deleted successfully.');
    } catch (error) {
      console.error('Error deleting claimed item:', error);
      alert('Error deleting claimed item. Please try again.');
    }
  };

  const handleAddLostItem = async (newItem) => {
    try {
      const response = await axios.post('http://localhost:3001/api/reportandclaimlostitems', newItem);
      setReportedItems([...reportedItems, response.data]);
      console.log('Lost item added successfully:', response.data);
    } catch (error) {
      console.error('Error adding lost item:', error);
    }
  };

  const filteredItems = reportedItems.filter(item =>
    item.itemname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif', display: 'flex', alignItems: 'center' }}>
          <h1>Lost and Found Portal</h1>
        </div>
        <hr className="bold-hr" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h1 className="poppins32">Reported Lost Items</h1>
        </div>
        <div style={{ marginTop: '20px' }}>
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
          <input
            type="text"
            placeholder="Search Item Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px" }}
          />
          <Link to="/add-lost-item" style={{ marginTop: '10px' }}>
            <button className='add-route-button'>Add Item</button>
          </Link>
        </div>
      </div>

      <table className="routes-table">
        <thead>
          <tr>
            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Image</th>
            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Item Name</th>
            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Route</th>
            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Description</th>
            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Status</th>
            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <tr key={item._id}>

                <td>
                  {(item.base64string && item.base64string.startsWith('data:image')) ? (
                    <img src={item.base64string} alt="Item Preview" className="item-image" />
                  ) : (
                    <img src={`data:image/jpeg;base64,${item.base64string}`} alt="Item Preview" className="item-image" />
                  )}
                </td>

                <td>{item.itemname}</td>
                <td>{item.routeno}</td>
                <td>{item.details}</td>
                <td>{item.itemstatus}</td>
                <td>
                  <button className="manage-button" onClick={() => handleEditReportedItem(item._id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteReportedItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="spacer15"></div>

      <Popup open={routeToEdit !== null} closeOnDocumentClick onClose={cancelEdit}>
        <div className="confirmation-dialog">
          <h3>Edit Reported Item</h3>
          <p>Please select a status:</p>
          <div className="confirmation-buttons">
            <button className="approve-button" onClick={() => handleEditConfirmation(routeToEdit, 'Claimed')}>
              Claimed
            </button>
            <button className="reject-button" onClick={() => handleEditConfirmation(routeToEdit, 'Unclaimed')}>
              Unclaimed
            </button>
            <button className="cancel-button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </Popup>

      <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
        <div className="confirmation-dialog">
          <h3>Are you sure you want to delete this item?</h3>
          <p>This action cannot be undone.</p>
          <div className="confirmation-buttons">
            <button className="confirm-button" onClick={confirmDelete}>
              Confirm Delete
            </button>
            <button className="cancel-button" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ReportAndClaimLostItems;