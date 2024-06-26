import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageBuspassFee = () => {
    const [buspassFees, setBuspassFees] = useState([]);

    useEffect(() => {
        fetchBuspassFees();
    }, []);

    const fetchBuspassFees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/buspassfees');
            setBuspassFees(response.data);
        } catch (error) {
            console.error('Error fetching buspass fees:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this record?');
        if (!confirmed) return; // If user cancels, do nothing
        try {
            await axios.delete(`http://localhost:3001/api/buspassfees/${id}`);
            setBuspassFees(prevState => prevState.filter(fee => fee._id !== id));
            alert('Record deleted successfully.');  
        } catch (error) {
            console.error('Error deleting buspass fee:', error);
        }
    };

    return (
        <div className="manage-routes-container">
            <div className="header">
     <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
                <h1>Buspass Fee</h1>
                </div>
                <hr className="bold-hr" />
            </div>

            {buspassFees.length > 0 ? (
                <table className="routes-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Section</th>
                            <th>Batch</th>
                            <th>Transaction ID</th>
                            <th>Transaction Date</th>
                            <th>Action</th> {/* New column for delete button */}
                        </tr>
                    </thead>
                    <tbody>
                        {buspassFees.map((fee) => (
                            <tr key={fee._id}>
                                <td>{fee.name}</td>
                                <td>{fee.rollno}</td>
                                <td>{fee.section}</td>
                                <td>{fee.batch}</td>
                                <td>{fee.transactionid}</td>
                                <td>{new Date(fee.transactiondate).toLocaleDateString()}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(fee._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No buspass fees found.</p>
            )}
        </div>
    );
};

export default ManageBuspassFee;
