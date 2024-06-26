import React, { useEffect, useState } from "react";
import Autocomplete from "react-autocomplete";
import axios from "axios";
import Popup from "reactjs-popup"; // Import reactjs-popup
import "../styling/Manage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const ManageRoutes = () => {
  const [manageRoutes, setManageRoutes] = useState([]);
  const [searchStopTerm, setSearchStopTerm] = useState("");
  const [searchRouteTerm, setSearchRouteTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State for confirmation dialog
  const [routeToDelete, setRouteToDelete] = useState(null); // Track route ID for deletion
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/routes");
      setManageRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes", error);
    }
  };

  const handleDeleteRoute = async (itemId) => {
    setRouteToDelete(itemId); // Set route ID for deletion confirmation
    setIsOpen(true); // Open confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/routes/${routeToDelete}`);
      console.log("Route Deleted Successfully");
      fetchRoutes();
      setIsOpen(false); // Close confirmation dialog
    } catch (error) {
      console.error("Error deleting Route:", error);
      setIsOpen(false); // Close confirmation dialog in case of error
    } finally {
      setRouteToDelete(null); // Clear route ID for deletion after confirmation
    }
  };

  const cancelDelete = () => {
    setIsOpen(false); // Close confirmation dialog on cancel
    setRouteToDelete(null); // Clear route ID for deletion on cancel
  };

  
  const filteredRoutes = manageRoutes.filter((route) =>
    route.stops.toLowerCase().includes(searchStopTerm.toLowerCase())
  ).filter((route) =>
    route.route_no.toString().includes(searchRouteTerm)
  );

  return (
    <div className="container">
      <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Manage Routes</h1>
        </div>
        <hr className="bold-hr" />

        {/* Stop Search */}
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search Stop"
          value={searchStopTerm}
          onChange={(e) => setSearchStopTerm(e.target.value)}
          style={{ width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px" }}
        />

        {/* Add Route Button */}
        <Link to="/add-route">
          <button className="add-route-button">Add Route</button>
        </Link>

        {/* Route Search */}
        <FontAwesomeIcon icon={faSearch} style={{ paddingLeft: "20px", marginRight: "10px", marginLeft: "10px" }} />
        <input
          type="text"
          placeholder="Search Route"
          value={searchRouteTerm}
          onChange={(e) => setSearchRouteTerm(e.target.value)}
          style={{ width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px" }}
        />

        {/* Routes Table */}
  <table className="routes-table">
          <thead>
            <tr>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Route No</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Stops</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Arrival Times</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Capacity</th>
              <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => {
              console.log(route); // Add this line for debugging
              return (
                <tr key={route._id}>
                  <td>{route.route_no}</td>
                  <td>
                    {route.stops.split(":").map((stop, index) => (
                      <div key={index}>{stop}</div>
                    ))}
                  </td>
                  <td>
                    {route.arrivalTime.map((time, index) => (
                      <div key={index}>{time}</div>
                    ))}
                  </td>
                  <td>{route.capacity}</td>
                  <td>
                  <Link to={`/edit-route/${route.route_no}`}>
                    <button className="manage-button">Update</button>
                  </Link>
                  <button
                    className="delete-button "
                    onClick={() => handleDeleteRoute(route.route_no)}
                  >
                    Delete
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        
        </table>

      {/* Confirmation Dialog (using reactjs-popup)  */}
      <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
        <div className="confirmation-dialog">
          <h3>Are you sure you want to delete this route?</h3>
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

export default ManageRoutes;
