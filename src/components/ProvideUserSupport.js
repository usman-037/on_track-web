import React from 'react';
import { Link } from 'react-router-dom';
import "../styling/Manage.css";

const ProvideUserSupport = () => {
    return (
        <div className="manage-routes-container">
            <div className="header">
                <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif' }}>
                    <h1>Provide User Support</h1>
                </div>
                <hr className="bold-hr" />
            </div>
            <div className="spacer25"></div>
            <div style={{ textAlign: 'left' }}>
                <Link to="/goto-reportissue">
                    <button className="goto-button">Reported Issues</button>
                </Link>
                <div className="spacer15"></div>
                <Link to="/goto-reportandclaimlostitems">
                    <button className="goto-button">Lost & Found Portal</button>
                </Link>
            </div>
        </div>
    );
};

export default ProvideUserSupport;
