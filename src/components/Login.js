import React, { useState } from "react";
import "../styling/Login.css";
import "../styling/Manage.css";
import axios from "axios";

function GradientText({ text, colors }) {
  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${colors.join(", ")})`,
    WebkitBackgroundClip: "text", // For Webkit browsers
    WebkitTextFillColor: "transparent", // For Webkit browsers
    color: "transparent",
    fontFamily: "FasterOne",
    fontSize: "55px",
  };

  return <div style={gradientStyle}>{text}</div>;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false); // State for shaking animation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful");
        window.location.href = "/view-routes";
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError("Error sending request");
      }
      setShakeScreen(true); // Trigger shake animation on error
      setTimeout(() => setShakeScreen(false), 500); // Reset shake animation after 0.5 second
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`vh-100 d-flex align-items-center justify-content-center gradient-custom${
        shakeScreen ? " shake" : ""
      }`}
    >
      <div className="container">
      <div className="manage" style={{fontFamily: 'Poppins-Medium, sans-serif' }}>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white animated fadeInDown"
              style={{ borderRadius: "1rem", height: "85vh" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-3 mt-md-4 pb-5">
                <div className="sidebar-header customfont">
                  <GradientText text="ON" colors={["#B0C5D0", "lightgrey"]} />
                  <div style={{ margin: "0 2px" }}></div> {/* Add margin for space */}
                  <GradientText text="TRACK" colors={["#A9EAFF", "#08C4FF"]} />
                </div>
                <br></br>
                <div className="manage" style={{fontFamily: 'Lato, sans-serif' }}>
                  <h2 className="fw-bold mb-1">
                    Admin Login
                  </h2>
                </div>
                <br></br>
                  
                  <div className="form-outline form-white mb-1">
                  <div className="manage" style={{ fontFamily: 'Poppins, sans-serif', color: 'gray' }}>
                    <input
                      type="text"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typeEmailX">
                      Username
                    </label>
                  </div>
                  </div>

                  <div className="form-outline form-white mb-4">
                  <div className="manage" style={{ fontFamily: 'Poppins, sans-serif', color: 'gray' }}>
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typePasswordX">
                      Password
                    </label>
                  </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                  {error && (
                    <div
                      className={`error-message animated ${
                        shakeScreen ? "shake" : ""
                      }`}
                    >
                      {/* {error} */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Login;
