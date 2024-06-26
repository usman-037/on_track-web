import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styling/Manage.css";

const EditGuardian = () => {
    const { email } = useParams(); 
    const [guardianData, setGuardianData] = useState(null); 
    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Guardian',
        route: '',
        stop: '',
        fee_status: '',
        student_email: ''
    });

    useEffect(() => {
        fetchGuardianData();
    }, [email]); // Fetch guardian data whenever email parameter changes

    const fetchGuardianData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/guardian/search?email=${email}`);
            setGuardianData(response.data);
            // Set initial data in the input fields
            setUpdatedData({
                name: response.data.name,
                email: response.data.email,
                password: response.data.password,
                route: response.data.route,
                stop: response.data.stop,
                fee_status: response.data.fee_status,
                student_email: response.data.student_email
            });
        } catch (error) {
            console.error('Error fetching guardian data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const updateGuardian = async () => {
        try {
            await axios.put(`http://localhost:3001/api/users/${email}`, updatedData);
            alert('Guardian updated successfully');
        } catch (error) {
            console.error('Error updating guardian:', error);
            alert('Error updating guardian. Please try again.');
        }
    };

    return (
        <div className="manage-routes-container">
            <div className="header">
                <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
                    <h1>Update Guardian</h1>
                </div>
                <hr className="bold-hr" />
            </div>

            <div>
                {guardianData && (
                    <div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Guardian Name:</label>
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
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Child's Route:</label>
                            <input type="text" name="route" value={updatedData.route} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Child's Stop:</label>
                            <input type="text" name="stop" value={updatedData.stop} onChange={handleInputChange} />
                        </div>
                        <div className="spacer15"></div>
                        <div className="form-group">
                            <label style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>Child's Email:</label>
                            <input type="text" name="student_email" value={updatedData.student_email} onChange={handleInputChange} />
                        </div>
                    </div>
                )}
                <div className="spacer25"></div>
                <button className="goto-button" onClick={updateGuardian}>Update Changes</button>
            </div>
        </div>
    );  
};

export default EditGuardian;