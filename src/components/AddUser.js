import React, { useState } from "react";
import axios from "axios";
import "../styling/Manage.css";

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    route: "",
    stop: "",
    fee_status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/users", newUser);
      alert("Passenger added successfully.");
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "",
        route: "",
        stop: "",
        fee_status: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add passenger. Please try again.");
    }
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
        <div
          className="manage"
          style={{ fontFamily: "Poppins-Medium, sans-serif" }}
        >
          <h1>Add Passenger</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-group">
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Role:
            </label>
            <select
              name="role"
              value={newUser.role}
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
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Route:
            </label>
            <input
              type="number"
              name="route"
              value={newUser.route}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Stop:
            </label>
            <input
              type="text"
              name="stop"
              value={newUser.stop}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="spacer15"></div>
          <div className="form-group">
            <label style={{ fontFamily: "Poppins-Medium, sans-serif" }}>
              Fee Status:
            </label>
            <select
              name="fee_status"
              value={newUser.fee_status}
              onChange={handleInputChange}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="spacer25"></div>
        <button className="goto-button" type="submit">
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
