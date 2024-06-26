// App.js
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ManageRoutes from "./components/ManageRoutes";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import ManageAttendance from "./components/ManageAttendance";
import EditAttendance from "./components/EditAttendance";
import AddAttendance from "./components/AddAttendance";
import DeleteAttendance from "./components/DeleteAttendance";
import ProvideUserSupport from "./components/ProvideUserSupport";
import ReportIssue from "./components/ReportIssue";
import ReportAndClaimLostItems from "./components/ReportAndClaimLostItems";
import AddLostItemForm from "./components/AddLostItemForm";

import ManageUsers from "./components/ManageUsers"
import AddUser from "./components/AddUser"
import EditUser from "./components/EditUser"
import DeleteUser from "./components/DeleteUser"

import ManageDrivers from "./components/ManageDrivers"
import AddDriver from "./components/AddDriver"
import EditDriver from "./components/EditDriver"
import DeleteDriver from "./components/DeleteDriver"

import ManageGuardians from "./components/ManageGuardians"
import AddGuardian from "./components/AddGuardian"
import EditGuardian from "./components/EditGuardian"
import DeleteGuardian from "./components/DeleteGuardian"

import ManageFee from "./components/ManageFee"
import ManageBuspassFee from "./components/ManageBuspassFee"
import ManageTransportFee from "./components/ManageTransportFee"

import ManageRequest from "./components/ManageRequest"
import ManageRouteRequests from "./components/ManageRouteRequests"
import TrackRoute from "./components/TrackRoute";

import ViewRoutes from "./components/ViewRoutes"
import AddRoute from "./components/AddRoute"
import EditRoute from "./components/EditRoute"

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={

              <Login />

            }
          />
          <Route
            path="/login"
            element={

              <Login />

            }
          />
          <Route
            path="/home"
            element={

              <Home />

            }
          />
          <Route
            path="/view-routes"
            element={
              <Layout>
                <ViewRoutes />
              </Layout>
            }
          />
          <Route
            path="/manage-routes"
            element={
              <Layout>
                <ManageRoutes />
              </Layout>
            }
          />
          <Route
            path="/add-route"
            element={
              <Layout>
                <AddRoute />
              </Layout>
            }
          />
          <Route
            path="/edit-route/:routeno"
            element={
              <Layout>
                <EditRoute />
              </Layout>
            }
          />
          <Route
            path="/manage-users"
            element={
              <Layout>
                <ManageUsers />
              </Layout>
            }
          />
          <Route
            path="/manage-attendance"
            element={
              <Layout>
                <ManageAttendance />
              </Layout>
            }
          />
          <Route path="/add-attendance" element={<Layout><AddAttendance /></Layout>} />
          <Route path="/edit-attendance/:femail" element={<Layout><EditAttendance /></Layout>} />
          <Route path="/delete-attendance" element={<Layout><DeleteAttendance /></Layout>} />

          <Route path="/provide-user-support" element={<Layout><ProvideUserSupport /></Layout>} />
          <Route path="/goto-reportissue" element={<Layout><ReportIssue /></Layout>} />
          <Route path="/goto-reportandclaimlostitems" element={<Layout><ReportAndClaimLostItems /></Layout>} />
          <Route path="/add-lost-item" element={<Layout><AddLostItemForm /></Layout>} />
          <Route path="/add-user" element={<Layout><AddUser /></Layout>} />
          <Route path="/edit-user/:email" element={<Layout><EditUser /></Layout>} />
          <Route path="/delete-user" element={<Layout><DeleteUser /></Layout>} />
          <Route
            path="/manage-drivers"
            element={
              <Layout>
                <ManageDrivers />
              </Layout>
            }
          />
          <Route path="/add-driver" element={<Layout><AddDriver /></Layout>} />
          <Route path="/edit-driver/:email" element={<Layout><EditDriver /></Layout>} />
          <Route path="/delete-driver" element={<Layout><DeleteDriver /></Layout>} />
          <Route
            path="/manage-fee"
            element={
              <Layout>
                <ManageFee />
              </Layout>
            }
          />
          <Route path="/manage-buspass-fee" element={<Layout><ManageBuspassFee /></Layout>} />
          <Route path="/manage-transport-fee" element={<Layout><ManageTransportFee /></Layout>} />
          <Route
            path="/manage-guardians"
            element={
              <Layout>
                <ManageGuardians />
              </Layout>
            }
          />
          <Route path="/add-guardian" element={<Layout><AddGuardian /></Layout>} />
          <Route path="/edit-guardian/:email" element={<Layout><EditGuardian /></Layout>} />
          <Route path="/delete-guardian" element={<Layout><DeleteGuardian /></Layout>} />
          <Route
            path="/manage-route-requests"
            element={
              <Layout>
                <ManageRouteRequests />
              </Layout>
            }
          />
          <Route path="/manage-request/:id" element={<Layout><ManageRequest /></Layout>} />
          <Route
            path="/manage-routes"
            element={
              <Layout>
                <ManageRoutes />
              </Layout>
            }
          />
          <Route path="/track-buses-routes" element={<Layout><TrackRoute /></Layout>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
