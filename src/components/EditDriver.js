import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styling/Manage.css";

const EditDriver = () => {
    const { email } = useParams(); 
    const [driverData, setDriverData] = useState(null); 
    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Driver',
        route: '',
        stop: '',
        fee_status: ''
    });

    useEffect(() => {
        fetchDriverData();
    }, [email]); // Fetch driver data whenever email parameter changes

    const fetchDriverData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/driver/search?email=${email}`);
            setDriverData(response.data);
            // Set initial data in the input fields
            setUpdatedData({
                name: response.data.name,
                email: response.data.email,
                password: response.data.password,
                route: response.data.route,
                stop: response.data.stop,
                fee_status: response.data.fee_status
            });
        } catch (error) {
            console.error('Error fetching driver data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const updateDriver = async () => {
        try {
            await axios.put(`http://localhost:3001/api/users/${email}`, updatedData);
            alert('Driver updated successfully');
        } catch (error) {
            console.error('Error updating driver:', error);
            alert('Error updating driver. Please try again.');
        }
    };

    return (
        <div className="manage-routes-container">
            <div className="header">
                <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
                    <h1>Update Driver</h1>
                </div>
                <hr className="bold-hr" />
            </div>

            <div>
                {driverData && (
                    <div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Driver Name:</label>
                            <input type="text" name="name" value={updatedData.name} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Phone:</label>
                            <input type="text" name="email" value={updatedData.email} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Password:</label>
                            <input type="text" name="password" value={updatedData.password} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Assigned Route:</label>
                            <input type="text" name="route" value={updatedData.route} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Start Stop:</label>
                            <input type="text" name="stop" value={updatedData.stop} onChange={handleInputChange} />
                        </div>
                    </div>
                )}
                <div className="spacer25"></div>
                <button className="goto-button" onClick={updateDriver}>Update Changes</button>
            </div>
        </div>
    );  
};

export default EditDriver;