import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";
import "../styling/TrackRoute.css";
import busPin from "../assets/buspin.png";
import marker from "../assets/marker.png";

const Map = ({ center, zoom, markers, stops }) => {
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyD0_zoemZLywa_RZRwygqDA7ch-9Jzy0Nw",
      version: "weekly",
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
      });

      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // Suppress default markers
      });

      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);

      markers.forEach((marker) => {
        const markerIcon = {
          url: marker.icon,
          scaledSize: new window.google.maps.Size(32, 32),
        };
        new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          icon: markerIcon,
        });
      });

    });
  }, [center, zoom, markers, stops]);

  return <div id="map" style={{ height: "82vh", width: "100%" }}></div>;
};

const TrackRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const universityMarker = {
    lat: 31.601014333135275,
    lng: 73.03575159515287,
    icon: marker,
  };
  const [liveTrackingInterval, setLiveTrackingInterval] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/fetchRouteNumbers");
        setRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  const handleRouteSelect = async (routeId) => {
    // Clear previous live tracking interval
    if (liveTrackingInterval) {
      clearInterval(liveTrackingInterval);
    }

    if (routeId) {
      try {
        // Fetch initial coordinates
        const initialResponse = await axios.get(`http://localhost:3001/fetchRouteCoordinates/${routeId}`);
        setSelectedRoute({
          ...initialResponse.data,
          coordinates: { lat: initialResponse.data.lat, lng: initialResponse.data.lng },
        });
        setStops(initialResponse.data.stops);

        // Start live tracking every 5 seconds
        const intervalId = setInterval(async () => {
          const response = await axios.get(`http://localhost:3001/fetchRouteCoordinates/${routeId}`);
          setSelectedRoute({
            ...response.data,
            coordinates: { lat: response.data.lat, lng: response.data.lng },
          });
          setStops(response.data.stops);
        },  10000);

        // Set interval ID to state
        setLiveTrackingInterval(intervalId);
      } catch (error) {
        console.error("Error fetching route coordinates:", error);
      }
    } else {
      setSelectedRoute(null);
      setStops([]);
    }
  };

  //track route changes from return to select container:

  return (
    <div className="containert">

      <div className="container">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
          <h1>Track Routes</h1>
        </div>
        <hr className="bold-hr" />
      </div>
      
      <div className="select-container">
      <select
        onChange={(e) => handleRouteSelect(parseInt(e.target.value))}
        style={{
          width: "280px",
          fontFamily: "Poppins, sans-serif",
          height: "40px",
        }}
      >
        <option value="">Select a route</option>
        {routes.map((routeId) => (
          <option key={routeId} value={routeId}>
            Route {routeId}
          </option>
        ))}
      </select>
    </div>
      {selectedRoute && selectedRoute.coordinates && (
        <Map
          center={{ lat: selectedRoute.lat, lng: selectedRoute.lng }}
          zoom={12}
          markers={[
            {
              lat: selectedRoute.lat,
              lng: selectedRoute.lng,
              icon: busPin,
            },
            universityMarker,
          ]}
          stops={stops}
        />
      )}
    </div>
  );
};

export default TrackRoute;