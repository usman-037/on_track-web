import "../styling/Manage.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ManageGuardians = () => {
  const [guardians, setGuardians] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEmailTerm, setSearchEmailTerm] = useState(""); // New state for searching by child's email
  const [isOpen, setIsOpen] = useState(false);
  const [guardianToDelete, setGuardianToDelete] = useState(null);

  useEffect(() => {
    fetchGuardians();
  }, []);

  const fetchGuardians = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      const filteredGuardians = response.data.filter(user =>
        user.role.toLowerCase() === 'guardian'
      );
      setGuardians(filteredGuardians);
    } catch (error) {
      console.error('Error fetching guardians:', error);
    }
  };

  const handleDeleteGuardian = async (email) => {
    setGuardianToDelete(email);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/users/guardian/${guardianToDelete}`);
      console.log("Guardian Deleted Successfully");
      alert('Guardian deleted successfully.');  
      fetchGuardians();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting guardian:", error);
      setIsOpen(false);
    } finally {
      setGuardianToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsOpen(false);
    setGuardianToDelete(null);
  };

  const filteredGuardians = guardians.filter(guardian =>
    guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (guardian.student_email && guardian.student_email.toLowerCase().includes(searchEmailTerm.toLowerCase())) // Check if guardian.student_email exists
);

  return (
    <div className="container">
        <div className="header">
            <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
                <h1>Manage Guardians</h1>
            </div>
            <hr className="bold-hr" />

            <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
            <input
                type="text"
                placeholder="Search Guardian Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px"}}
            />
            <FontAwesomeIcon icon={faSearch} style={{ paddingLeft: "20px", marginRight: "10px", marginLeft: "10px" }} />
            <input
                type="text"
                placeholder="Search Child's Email"
                value={searchEmailTerm}
                onChange={(e) => setSearchEmailTerm(e.target.value)}
                style={{width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px"}}
            />
            <Link to="/add-guardian">
                <button className="add-route-button">Add Guardian</button>
            </Link>

            {filteredGuardians.length > 0 ? (
                <table className="routes-table">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Guardian Name</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Phone</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Password</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Child's Route</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Child's Stop</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Child's Email</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuardians.map(guardian => (
                            <tr key={guardian._id}>
                                <td>{guardian.name}</td>
                                <td>{guardian.email}</td>
                                <td>{guardian.password}</td>
                                <td>{guardian.route}</td>
                                <td>{guardian.stop}</td>
                                <td>{guardian.student_email}</td>
                                <td>
                                    <Link to={`/edit-guardian/${guardian.email}`}>
                                        <button className="manage-button">Update</button>
                                    </Link>
                                    <button
                                        className="delete-button "
                                        onClick={() => handleDeleteGuardian(guardian.email)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No guardians found.</p>
            )}
        </div>
        <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
            <div className="confirmation-dialog">
                <h3>Are you sure you want to delete this guardian?</h3>
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

export default ManageGuardians;
