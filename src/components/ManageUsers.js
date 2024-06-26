import "../styling/Manage.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchRouteTerm, setSearchRouteTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("None");
  const [isOpen, setIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    setNotification(e.target.value);
  };

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/send-notification", {
        message: notification,
      });
      alert("Notification sent successfully.");
      console.log(response.data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (email) => {
    setUserToDelete(email);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${userToDelete}`);
      console.log("User Deleted Successfully");
      alert("User deleted successfully.");
      fetchUsers();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setIsOpen(false);
    } finally {
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      String(user.route).includes(searchRouteTerm) &&
      user.role !== "Driver" &&
      user.role !== "Guardian" &&
      (selectedRole === "None" || user.role === selectedRole)
  );

  return (
    <div className="container">
      <div className="header">
        <div
          className="manage"
          style={{ fontFamily: "Poppins-Medium, sans-serif" }}
        >
          <h1>Manage Passengers</h1>
        </div>
        <hr className="bold-hr" />

        <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "220px",
            fontFamily: "Poppins, sans-serif",
            height: "40px",
            paddingLeft: "10px",
          }}
        />
        <Link to="/add-user">
          <button className="add-route-button">Add Passenger</button>
        </Link>

        <FontAwesomeIcon
          icon={faSearch}
          style={{
            paddingLeft: "20px",
            marginRight: "10px",
            marginLeft: "10px",
          }}
        />
        <input
          type="text"
          placeholder="Search Route"
          value={searchRouteTerm}
          onChange={(e) => setSearchRouteTerm(e.target.value)}
          style={{
            width: "220px",
            fontFamily: "Poppins, sans-serif",
            height: "40px",
            paddingLeft: "10px",
          }}
        />

        <div className="spacer25"></div>

        <div
          className="role-filter"
          style={{ paddingLeft: "3px", paddingRight: "3px" }}
        >
          <label
            style={{
              width: "220px",
              fontFamily: "Poppins, sans-serif",
              height: "0px",
              paddingLeft: "3px",
            }}
            htmlFor="role"
          >
            Filter by Role:
          </label>
          <div className="spacer8"></div>
          <select
            style={{ fontFamily: "Poppins, sans-serif" }}
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="None">None</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Hostelite">Hostelite</option>
            <option value="Bus Supervisor">Bus Supervisor</option>
          </select>
          <div className="spacer15"></div>
          <div>
            <input
              type="text"
              placeholder="Write a message for all passengers..."
              style={{
                width: "520px",
                fontFamily: "Poppins, sans-serif",
                height: "43px",
                paddingLeft: "10px",
              }}
              name="noti"
              min={1}
              max={100}
              value={notification}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={handleClick}
              className="goto-button"
              style={{ marginLeft: "10px" }}
            >
              Send Notification
            </button>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <table className="routes-table">
            <thead>
              <tr>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Name
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Email
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Password
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Role
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Route
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Stop
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Fee Status
                </th>
                <th
                  className="centered"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>{user.route}</td>
                  <td>{user.stop}</td>
                  <td>{user.fee_status}</td>
                  <td>
                    <Link to={`/edit-user/${user.email}`}>
                      <button className="manage-button">Update</button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
        <div className="confirmation-dialog">
          <h3>Are you sure you want to delete this user?</h3>
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

export default ManageUsers;
