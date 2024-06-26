import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styling/Manage.css";

const EditUser = () => {
    const { email } = useParams(); 
    const [userData, setUserData] = useState(null); 
    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        route: '',
        stop: '',
        fee_status: ''
    });

    useEffect(() => {
        fetchUserData();
    }, [email]); // Fetch user data whenever email parameter changes

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/search?email=${email}`);
            setUserData(response.data);
            // Set initial data in the input fields
            setUpdatedData({
                name: response.data.name,
                email: response.data.email,
                password: response.data.password,
                role: response.data.role,
                route: response.data.route,
                stop: response.data.stop,
                fee_status: response.data.fee_status
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const updateUser = async () => {
        try {
            await axios.put(`http://localhost:3001/api/users/${email}`, updatedData);
            alert('Passenger updated successfully.');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating passenger. Please try again.');
        }
    };

    return (
        <div className="manage-routes-container">
            <div className="header">
                <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
                    <h1>Edit Passenger</h1>
                </div>
                <hr className="bold-hr" />
            </div>

            <div>
                {userData && (
                    <div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>User Name:</label>
                            <input type="text" name="name" value={updatedData.name} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Email:</label>
                            <input type="text" name="email" value={updatedData.email} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Password:</label>
                            <input type="text" name="password" value={updatedData.password} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                        <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Role:</label>
                            <select
                                name="role"
                                value={updatedData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Hostelite">Hostelite</option>
                                <option value="Bus Supervisor">Bus Supervisor</option>
                            </select>
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Route:</label>
                            <input type="text" name="route" value={updatedData.route} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Stop:</label>
                            <input type="text" name="stop" value={updatedData.stop} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Fee Status:</label>
                            <input type="text" name="fee_status" value={updatedData.fee_status} onChange={handleInputChange} />
                        </div>
                    </div>
                )}
                <div className="spacer25"></div>
                <button className="goto-button" onClick={updateUser}>Update Changes</button>
            </div>
        </div>
    );  
};

export default EditUser;