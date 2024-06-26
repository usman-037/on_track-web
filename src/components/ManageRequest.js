import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Popup from "reactjs-popup";
import "../styling/Manage.css";

const ManageRequest = () => {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [requestedRoute, setRequestedRoute] = useState(null);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [fcmtoken,setfcmtoken]=useState(''); // State to store attendance data
    const [femail,setemail]=useState(''); // State to store attendance data

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/changerouterequest/${id}`);
            setRequest(response.data);
            setemail(response.data.email);
            fetchRoute(response.data.currentroute, setCurrentRoute);
            fetchRoute(response.data.requestedroute, setRequestedRoute);
        } catch (error) {
            console.error('Error fetching change route request:', error);
        }
    };
    const fcmtokenn= async () => {
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
    const fetchRoute = async (routeNo, setRoute) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/routes/${routeNo}`);
            setRoute(response.data);
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    const handleApproveRequest = () => {
        setApproveDialogOpen(true);
    };

    const handleRejectRequest = () => {
        setRejectDialogOpen(true);
    };

    const approveRequest = async () => {
        try {
            // Fetch the fcmtoken if not already available in state
            if (!fcmtoken) {
                await fcmtokenn();
            }
    
            // Include the fcmtoken in the request body
            const requestBody = {
                fcmtoken: fcmtoken
            };
    
            // Make the PUT request with the updated data including the fcmtoken
            await axios.put(`http://localhost:3001/api/changerouterequest/${id}/approve`, requestBody);
    
            // Update the request in the state
            const updatedRequest = { ...request };
            updatedRequest.currentstop = request.requestedstop;
            updatedRequest.currentroute = request.requestedroute;
            setRequest(updatedRequest); 
    
            alert('Request status changed to Fulfilled.');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Error approving request. Please try again.');
        } finally {
            setApproveDialogOpen(false);
        }
    };
    

    const rejectRequest = async () => {
        try {
            // Fetch the fcmtoken if not already available in state
            if (!fcmtoken) {
                await fcmtokenn();
            }
    
            // Include the fcmtoken in the request body
            const requestBody = {
                fcmtoken: fcmtoken
            };
    
            // Make the PUT request with the updated data including the fcmtoken
            await axios.put(`http://localhost:3001/api/changerouterequest/${id}/reject`, requestBody);
    
            // Fetch updated request data
            await fetchRequest();
    
            alert('Request status changed to Unfulfilled.');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error rejecting request. Please try again.');
        } finally {
            setRejectDialogOpen(false);
        }
    };
    

    return (
        <div className="manage-routes-container">
            <div className="header">
                <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
                    <h1>Manage Change Route Requests</h1>
                </div>
                <hr className="bold-hr" />
            </div>

            {request ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <h1 className="poppins32">Request Details</h1>
                    </div>
                    <div className="spacer25"></div>
                    <div className="request-details">
                        <p><strong>Student Email:</strong> {request.email}</p>
                        <p className="blue-text"><strong>Status:</strong> {request.status}</p>
                        <p><strong>Current Route:</strong> {request.currentroute}</p>
                        <p><strong>Current Stop:</strong> {request.currentstop}</p>
                        <p><strong>Requested Route:</strong> {request.requestedroute}</p>
                        <p><strong>Requested Stop:</strong> {request.requestedstop}</p>
                        <p><strong>Request Date:</strong> {new Date(request.dateTime).toLocaleDateString()}</p>
                    </div>
                    <div className="spacer15"></div>
                    <div className="request-details">
                        <p><strong>Comments:</strong> {request.comments}</p>
                    </div>

                    <div className="spacer32"></div>
                    <button className="approve-button" onClick={handleApproveRequest}>Approve Request</button>
                    <button className="reject-button" onClick={handleRejectRequest}>Reject Request</button>

                    {/* Approval Confirmation Dialog */}
                    <Popup open={approveDialogOpen} closeOnDocumentClick onClose={() => setApproveDialogOpen(false)}>
                        <div className="confirmation-dialog">
                            <h3>Are you sure you want to approve this request?</h3>
                            <p>This action cannot be undone.</p>
                            <div className="confirmation-buttons">
                                <button className="confirm-button" onClick={approveRequest}>
                                    Confirm Approve
                                </button>
                                <button className="cancel-button" onClick={() => setApproveDialogOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Popup>

                    {/* Rejection Confirmation Dialog */}
                    <Popup open={rejectDialogOpen} closeOnDocumentClick onClose={() => setRejectDialogOpen(false)}>
                        <div className="confirmation-dialog">
                            <h3>Are you sure you want to reject this request?</h3>
                            <p>This action cannot be undone.</p>
                            <div className="confirmation-buttons">
                                <button className="confirm-button" onClick={rejectRequest}>
                                    Confirm Reject
                                </button>
                                <button className="cancel-button" onClick={() => setRejectDialogOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Popup>

                </div>
            ) : (
                <p>Loading...</p>
            )}

            
        </div>
    );
};

export default ManageRequest;