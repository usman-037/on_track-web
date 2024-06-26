import React, { useState, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import axios from "axios";
import "../styling/Manage.css";
import { Bounce } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
// Google Maps API Key
const MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API";
const AddRoute = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [route_no, setRouteNo] = useState("");
  const [capacity, setCapacity] = useState("");
  const [stops, setLocations] = useState([]);
  const [map, setMap] = useState(null); // Reference to the map instance
  const [marker, setMarker] = useState(null); // Reference to the current marker
  const [arrivalTime, setArrivalTime] = useState("");
  useEffect(() => {
    // Initialize Google Maps after component mounts
    loadGoogleMaps();
  }, []);

  const loadGoogleMaps = () => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      initMap();
    };
    document.body.appendChild(script);
  };

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(
      document.getElementById("map"),
      {
        center: { lat: 0, lng: 0 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
      }
    );
    setMap(mapInstance);
  };

  // Function to add marker to map
  const addMarkerToMap = (location) => {
    if (map) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results[0]) {
          // Remove previous marker
          if (marker) {
            marker.setMap(null);
          }
          // Add new marker
          const newMarker = new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            title: location,
          });
          map.setCenter(results[0].geometry.location);
          setMarker(newMarker);
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
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
      setError("Error fetching suggestions");
      return [];
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const routeExists = await checkRoute(route_no);
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
      } else {
        const stopsString = stops.join(": ");
        await axios.post("http://localhost:3001/api/routes", {
          route_no,
          stops: stopsString,
          capacity,
          arrivalTime, // Include arrival time in the request
        });
        setLocations([]);
        setRouteNo("");
        setCapacity("");
        setArrivalTime(""); // Clear arrival time after submission
        console.log("Route added successfully:");
        toast.success("Route added successfully", {
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
      console.error("Error adding route:", error.response.data);
      setError("Error adding route. Please try again.");
    }
  };

  const onChange = async (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    const newSuggestions = await fetchSuggestions(inputValue);
    setSuggestions(newSuggestions);
  };

  const onSelect = (val) => {
    setValue(val);
    addMarkerToMap(val); // Add marker to map when location is selected
  };

  const addItem = () => {
    setLocations([...stops, value]);
    setValue("");
    addMarkerToMap(value); // Add marker to map when location is added
  };

  const removeItem = (index) => {
    const updatedLocations = [...stops];
    updatedLocations.splice(index, 1);
    setLocations(updatedLocations);
    // Remove marker from map when location is removed
    if (marker) {
      marker.setMap(null);
    }
  };
  const handleArrivalTimeChange = (e) => {
    setArrivalTime(e.target.value);
  };
  const handleRouteNoChange = (e) => {
    setRouteNo(e.target.value);
  };

  const handleCapacityChange = (e) => {
    setCapacity(e.target.value);
  };

  const renderItem = (item, isHighlighted) => (
    <div style={{ background: isHighlighted ? "lightgray" : "white" }}>
      {item.description}
    </div>
  );

  return (
    <div className="manage-routes-container">
      <ToastContainer />
      <div className="header">
      <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
        <h1>Add Route</h1>
        </div>
        <hr className="bold-hr" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Route No</label>
            <input
              type="number"
              name="route_no"
              min={1}
              max={25}
              value={route_no}
              onChange={handleRouteNoChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              min={1}
              max={70}
              value={capacity}
              onChange={handleCapacityChange}
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
                renderItem={renderItem}
                value={value}
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
          <button className="add-route-button" type="submit">Add Route</button>
        </div>
        <div className="form-group selected-locations">
          <label>Selected Locations:</label>
          <ul style={{ maxHeight: "auto", overflowY: "auto" }}>
            {" "}
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
      <div
        id="map-container"
        style={{ borderRadius: "20px", overflow: "hidden" }}
      >
        <div id="map" style={{ height: "400px" }}></div>
      </div>
    </div>
  );
};

export default AddRoute;
