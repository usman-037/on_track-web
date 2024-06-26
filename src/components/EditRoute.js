// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Autocomplete from "react-autocomplete";
import "../styling/Manage.css";
import { set } from "mongoose";
import { Bounce, Slide } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";

const EditRoute = () => {
  const { routeno } = useParams(); // Extract route ID from URL params
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [route, setRoute] = useState(null); // State to store route details
  const [route_no, setRouteno] = useState(""); // State to store route number
  const [newRouteno, setNewRouteno] = useState(""); // State to store the new route number

  const [stops, setStops] = useState([]); // State to store stops
  const [capacity, setCapacity] = useState(""); // State to store capacity
  const [newStop, setNewStop] = useState(""); // State to store new stop
  const [suggestions, setSuggestions] = useState([]); // State to store autocomplete suggestions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  useEffect(() => {
    // Fetch route details when component mounts
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/routes/${routeno}`
      );
      const { stops, capacity } = response.data;
      console.log("API Response:", response.data);
      console.log("Fetched route number:", route_no); // Log the fetched route number
      setRoute(response.data);
      setRouteno(routeno); // Set route number
      setNewRouteno(routeno);
      setStops(stops.split(": ")); // Set stops
      setCapacity(capacity); // Set capacity
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
  const checkRoute = async (routeID) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/checkRoutes?input=${routeID}`
      );
      console.log(response.data);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking route:", error);
      throw error;
    }
  };
  const fetchSuggestions = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/places-autocomplete?input=${inputValue}`
      );
      return response.data.predictions || [];
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if the route number has been changed
      if (newRouteno !== routeno) {
        // Route number has been changed, check if the new route number exists
        const routeExists = await checkRoute(newRouteno);
        if (routeExists) {
          toast.error("Route already exists", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          return; // Exit the function if the route already exists
        }
        // If the route doesn't exist, proceed with updating the route
        const stopsString = stops.join(": ");
        console.log(newRouteno);
        await axios.put(`http://localhost:3001/api/routes/${routeno}`, {
          route_no: newRouteno, // Use newRouteno instead of routeno
          stops: stopsString,
          capacity,
          arrivalTime, // Include arrival time in the request
        });
        // Clear the form inputs and show success toast
        setStops([]);
        setNewRouteno("");
        setCapacity("");
        toast.success("Route updated successfully", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        // If the route number hasn't been changed, update the route with the existing route number
        const stopsString = stops.join(": ");
        await axios.put(`http://localhost:3001/api/routes/${routeno}`, {
          route_no,
          stops: stopsString,
          capacity,
        });
        // Clear the form inputs and show success toast
        setStops([]);
        setNewRouteno("");
        setCapacity("");
        toast.success("Route updated successfully", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error updating route:", error);
      if (error.response && error.response.data) {
        console.error("Response data:", error.response.data);
        setError("Error updating route. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        setError("Unexpected error. Please try again later.");
      }
    }
  };

  // Define onChange function
  const onChange = async (e) => {
    const inputValue = e.target.value;
    setNewStop(inputValue);
    const newSuggestions = await fetchSuggestions(inputValue);
    setSuggestions(newSuggestions);
  };

  // Define onSelect function
  const onSelect = (val) => {
    setNewStop(val);
  };

  // Define addItem function
  const addItem = () => {
    setStops([...stops, newStop]);
    setNewStop("");
  };
  const handleArrivalTimeChange = (e) => {
    setArrivalTime(e.target.value);
  };
  // Define removeItem function
  const removeItem = (index) => {
    const updatedStops = [...stops];
    updatedStops.splice(index, 1);
    setStops(updatedStops);
  };

  return (
    <div className="manage-routes-container">
      <ToastContainer />
      <div className="header">
        <div
          className="manage"
          style={{ fontFamily: "Poppins-Medium, sans-serif" }}
        >
          <h1>Edit Route</h1>
        </div>
        <hr className="bold-hr" />
      </div>
      {route && (
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Route No</label>
              <input
                type="number"
                name="route_no"
                min={1}
                max={25}
                value={newRouteno}
                onChange={(e) => setNewRouteno(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                min={1}
                max={25}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="autocomplete-group form-group">
              <div className="autocomplete-input-container">
                <Autocomplete
                  getItemValue={(item) => item.description}
                  items={suggestions}
                  value={newStop}
                  onChange={onChange}
                  onSelect={onSelect}
                  inputProps={{ placeholder: "Enter Stop Location" }}
                  wrapperStyle={{ position: "relative" }}
                  menuStyle={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    zIndex: 1,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                className="goto-button"
              >
                Add Location
              </button>
            </div>
            <div className="form-group">
              <label>Arrival Time at First Stop</label>
              <input
                type="time"
                value={arrivalTime}
                onChange={handleArrivalTimeChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
          <button className="add-route-button" type="submit">Update Route</button>
        </div>
          <div className="form-group selected-locations">
            <label>Selected Stops:</label>
            <ul style={{ maxHeight: "auto", overflowY: "auto" }}>
              {stops.map((location, index) => (
                <li key={index} className="stop-item">
                  {location}
                  <button
                    onClick={() => removeItem(index)}
                    className="remove-button"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditRoute;
