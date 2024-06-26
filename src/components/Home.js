import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManageRoute from "./ManageRoutes";
import SideMenu from "./SideMenu";

const Home = () => {
  return (
    <div className="main-dashboard-container">
      <div className="dashboard-content">
        <SideMenu />
       
      </div>
    </div>
  );
};

export default Home;

