import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styling/Manage.css';
import Popup from 'reactjs-popup';

const ReportIssue = () => {
  const [reportedIssue, setReportedIssue] = useState([]);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [routeToEdit, setRouteToEdit] = useState(null); // New state to track the route to edit
  const [editedIssue, setEditedIssue] = useState(null);

  useEffect(() => {
    fetchReportedIssues();
  }, []);

  const fetchReportedIssues = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reportissue');
      setReportedIssue(response.data);
    } catch (error) {
      console.error('Error fetching reported items:', error);
    }
  };

  const handleEditReportedIssue = async (itemId) => {
    setRouteToEdit(itemId); // Set the route ID for editing
  };

  const handleDeleteReportedIssue = async (itemId) => {
    setRouteToDelete(itemId);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/reportissue/${routeToDelete}`);
      console.log('Reported issue deleted successfully');
      alert(`Reported issue deleted successfully.`);
      fetchReportedIssues();
    } catch (error) {
      console.error('Error deleting reported issue:', error);
    } finally {
      setRouteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRouteToDelete(null);
  };

  const handleEditConfirmation = async (itemId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/reportissue/${itemId}`, { status: newStatus });
      const updatedReportedIssues = reportedIssue.map(item =>
        item._id === itemId ? { ...item, status: newStatus } : item
      );
      setReportedIssue(updatedReportedIssues);
      alert(`Reported issue updated successfully to ${newStatus}.`);
    } catch (error) {
      console.error('Error editing reported issue:', error);
      alert('Error editing reported issue. Please try again.');
    } finally {
      setRouteToEdit(null); // Clear the route ID for editing
    }
  };

  const cancelEdit = () => {
    setRouteToEdit(null); // Clear the route ID for editing on cancel
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Reported Issues</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      {reportedIssue.length === 0 ? (
        <p>No reported issues.</p>
      ) : (
        <table className="routes-table">
          <thead>
            <tr>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Email</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Type</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Description</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Status</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Report Count</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reportedIssue.map((item) => (
              <tr key={item._id}>
                <td>{item.email}</td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td>{item.reportcount}</td>
                <td>
                  <button className="manage-button" onClick={() => handleEditReportedIssue(item._id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteReportedIssue(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Dialog (using reactjs-popup) */}
      <Popup open={routeToEdit !== null} closeOnDocumentClick onClose={cancelEdit}>
        <div className="confirmation-dialog">
          <h3>Edit Reported Issue</h3>
          <p>Please select a status:</p>
          <div className="confirmation-buttons">
            <button className="approve-button" onClick={() => handleEditConfirmation(routeToEdit, 'Fulfilled')}>
              Fulfilled
            </button>
            <button className="reject-button" onClick={() => handleEditConfirmation(routeToEdit, 'Unfulfilled')}>
              Unfulfilled
            </button>
            <button className="cancel-button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </Popup>

      {/* Delete Dialog (using reactjs-popup) */}
      <Popup open={routeToDelete !== null} closeOnDocumentClick onClose={cancelDelete}>
        <div className="confirmation-dialog">
          <h3>Are you sure you want to delete this reported issue?</h3>
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

export default ReportIssue;
