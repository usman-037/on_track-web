import "../styling/Manage.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const ViewRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/routes`);
        setRoutes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase().trim());
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.route_no.toString().includes(searchText) ||
      route.stops.toLowerCase().includes(searchText)
  );

  const highlightMatch = (text, search) => {
    if (search.trim() !== "") {
      const regex = new RegExp(
        `(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
        "gi"
      );
      return text.replace(regex, '<mark class="highlighted">$1</mark>');
    } else {
      return text;
    }
  };

  return (
    <div className="manage-routes-container">
      <div className="header">
        <div
          className="manage"
          style={{ fontFamily: "Poppins-Medium, sans-serif" }}
        >
          <h1>View Routes</h1>
        </div>
        <hr className="bold-hr" />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <br></br>
        <br></br>
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search stop or route number"
          value={searchText}
          onChange={handleSearch}
          style={{
            width: "320px", // Adjust the width as needed
            fontFamily: "Poppins, sans-serif", // Set font family to Poppins
            height: "50px", // Adjust the height as needed
            paddingLeft: "10px", // Add padding to the left
          }}
        />
      </div>

      {loading ? (
        <p>
          <br></br>Loading...
        </p>
      ) : (
        <table className="routes-table">
          <thead>
            <tr>
              <th
                className="centered"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Route No
              </th>
              <th
                className="centered"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Stops
              </th>
              <th
                className="centered"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Arrival Times
              </th>
              <th
                className="centered"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Capacity
              </th>
              
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
                
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewRoutes;
