import "../styling/Manage.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRouteTerm, setSearchRouteTerm] = useState(""); // New state for searching by route
  const [isOpen, setIsOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      const filteredDrivers = response.data.filter(user =>
        user.role.toLowerCase() === 'driver'
      );
      setDrivers(filteredDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleDeleteRoute = async (itemId) => {
    setDriverToDelete(itemId);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/users/driver/${driverToDelete}`);
      console.log("Driver Deleted Successfully");
      alert('Driver deleted successfully.');  
      fetchDrivers();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting driver:", error);
      setIsOpen(false);
    } finally {
      setDriverToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsOpen(false);
    setDriverToDelete(null);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    String(driver.route).includes(searchRouteTerm) // Convert route to string for comparison
);

  return (
    <div className="container">
        <div className="header">
            <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
                <h1>Manage Drivers</h1>
            </div>
            <hr className="bold-hr" />

            <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
            <input
                type="text"
                placeholder="Search Driver Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px"}}
            />
            <FontAwesomeIcon icon={faSearch} style={{ paddingLeft: "20px", marginRight: "10px", marginLeft: "10px" }} />
            <input
                type="text"
                placeholder="Search Route"
                value={searchRouteTerm}
                onChange={(e) => setSearchRouteTerm(e.target.value)}
                style={{width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px"}}
            />
            <Link to="/add-driver">
                <button className="add-route-button">Add Driver</button>
            </Link>

            {filteredDrivers.length > 0 ? (
                <table className="routes-table">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Driver Name</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Phone</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Password</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Route Assigned</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Start Stop</th>
                            <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers.map(driver => (
                            <tr key={driver._id}>
                                <td>{driver.name}</td>
                                <td>{driver.email}</td>
                                <td>{driver.password}</td>
                                <td>{driver.route}</td>
                                <td>{driver.stop}</td>
                                <td>
                                    <Link to={`/edit-driver/${driver.email}`}>
                                        <button className="manage-button">Update</button>
                                    </Link>
                                    <button
                                        className="delete-button "
                                        onClick={() => handleDeleteRoute(driver.email)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No drivers found.</p>
            )}
        </div>
        {/* Confirmation Dialog (using reactjs-popup)  */}
        <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
            <div className="confirmation-dialog">
                <h3>Are you sure you want to delete this driver?</h3>
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

export default ManageDrivers;
