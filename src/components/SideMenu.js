import React from "react";
import { NavLink } from "react-router-dom";
import "../styling/SideMenu.css";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faSearch } from '@fortawesome/free-solid-svg-icons';

import vr from '../assets/v-r.png';
import mr from '../assets/m-r.png';
import ma from '../assets/m-a.png';
import mu from '../assets/m-u.png';
import mg from '../assets/m-g.png';
import md from '../assets/m-d.png';
import tbr from '../assets/t-b-r.png';
import pus from '../assets/p-u-s.png';
import mrr from '../assets/m-r-r.png';

function GradientText({ text, colors }) {
  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${colors.join(", ")})`,
    WebkitBackgroundClip: "text", // For Webkit browsers
    WebkitTextFillColor: "transparent", // For Webkit browsers
    color: "transparent",
    fontFamily: "FasterOne",
    fontSize: "40px",
  };

  return <div style={gradientStyle}>{text}</div>;
}

const SideMenu = () => {
  return (
    <div className="sidebar" style={{fontFamily: 'Poppins, sans-serif' }}>
    <div className="sidebar" style={{}}>
      <div className="sidebar-header customfont">
        <GradientText text="ON" colors={["#B0C5D0", "lightgrey"]} />
        <div style={{ margin: "0 2px" }}></div> {/* Add margin for space */}
        <GradientText text="TRACK" colors={["#A9EAFF", "#08C4FF"]} />
      </div>
      <NavLink to="/view-routes" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={vr} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        <span style={{ whiteSpace: "nowrap" }}>View Routes</span>
      </NavLink>
      <NavLink to="/manage-routes" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={mr} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-map"></i>
        Manage Routes
      </NavLink>
      <NavLink to="/manage-attendance" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={ma} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user-clock"></i>
        Manage Attendance
      </NavLink>
      <NavLink to="/manage-users" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={mu} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        Manage Passengers
      </NavLink>
      <NavLink to="/manage-guardians" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={mg} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        Manage Guardians
      </NavLink>
      <NavLink to="/manage-drivers" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={md} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        Manage Drivers
      </NavLink>
      <NavLink to="/track-buses-routes" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={tbr} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        Track Buses Routes
      </NavLink>
      <NavLink to="/provide-user-support" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={pus} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        Provide User Support
      </NavLink>
      <NavLink to="/manage-route-requests" activeClassName="active" style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
        <img src={mrr} alt="icon" style={{ width: "30px", paddingRight: "0px", paddingLeft: "0px" }} />
        <i className="fas fa-user"></i>
        <span style={{ whiteSpace: "nowrap" }}>Manage Route Requests</span>
      </NavLink>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
    </div>
    </div>
  );
};

export default SideMenu;
