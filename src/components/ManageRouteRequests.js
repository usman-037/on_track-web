import "../styling/Manage.css";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ManageRouteRequests = () => {
    const [changeRouteRequests, setChangeRouteRequests] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // State for confirmation dialog
    const [requestToDelete, setRequestToDelete] = useState(null); // Track request ID for deletion
    const [selectedRequestType, setSelectedRequestType] = useState("All"); // State for selected request type filter
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    useEffect(() => {
        fetchChangeRouteRequests();
    }, []);

    const fetchChangeRouteRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/changerouterequest');
            setChangeRouteRequests(response.data);
        } catch (error) {
            console.error('Error fetching change route requests:', error);
        }
    };

    const handleDelete = async (id) => {
        setRequestToDelete(id); // Set request ID for deletion confirmation
        setIsOpen(true); // Open confirmation dialog
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/changerouterequest/${requestToDelete}`);
            setChangeRouteRequests(prevState => prevState.filter(request => request._id !== requestToDelete));
            setIsOpen(false); // Close confirmation dialog
            alert('Request deleted successfully.');
        } catch (error) {
            console.error('Error deleting change route request:', error);
            setIsOpen(false); // Close confirmation dialog in case of error
            alert('Error deleting request. Please try again.');
        } finally {
            setRequestToDelete(null); // Clear request ID for deletion after confirmation
        }
    };

    const cancelDelete = () => {
        setIsOpen(false); // Close confirmation dialog on cancel
        setRequestToDelete(null); // Clear request ID for deletion on cancel
    };

    // Filter change route requests based on selected request type and search term
    const filteredRequests = changeRouteRequests.filter(request => {
        // Filter by request type
        if (selectedRequestType === "All") {
            return true; // Show all requests
        } else {
            return request.status === selectedRequestType; // Show requests of selected type
        }
    }).filter(request => {
        // Filter by search term
        return request.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="manage-routes-container">
            <div className="header">
                <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
                    <h1>Manage Change Route Requests</h1>
                </div>
                <hr className="bold-hr" />
            </div>

            {/* Filter and Search */}
            <FontAwesomeIcon icon={faSearch} style={{marginRight: "10px"}} />
            <input
                type="text"
                placeholder="Search by Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px" }}
            />
            <div className="spacer25"></div>
            <div className="filter-search">
                <div className="role-filter" style={{ paddingLeft: "3px", paddingRight: "3px" }}>
                    <label
                        style={{ width: "220px", fontFamily: 'Poppins, sans-serif', height: "0px", paddingLeft: "3px" }}
                        htmlFor="role">Filter by Status:</label>
                    <div className="spacer8"></div>                    
                    <select id="requestType" value={selectedRequestType} onChange={(e) => setSelectedRequestType(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Fulfilled">Fulfilled</option>
                        <option value="Unfulfilled">Unfulfilled</option>
                    </select>
                </div>
            </div>

            {filteredRequests.length > 0 ? (
                <table className="routes-table">
                    <thead>
                        <tr>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Student Email</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Status</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Current Route</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Current Stop</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Requested Route</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Requested Stop</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Comments</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Date</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.email}</td>
                                <td>{request.status}</td>
                                <td>{request.currentroute}</td>
                                <td>{request.currentstop}</td>
                                <td>{request.requestedroute}</td>
                                <td>{request.requestedstop}</td>
                                <td>{request.comments}</td>
                                <td>{new Date(request.dateTime).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="delete-button" onClick={() => handleDelete(request._id)}>Delete</button>
                                        <Link to={`/manage-request/${request._id}`}>
                                            <button className="manage-button">Manage</button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No change route requests found.</p>
            )}

            {/* Confirmation Dialog (using reactjs-popup) */}
            <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
                <div className="confirmation-dialog">
                    <h3>Are you sure you want to delete this request?</h3>
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

export default ManageRouteRequests;
