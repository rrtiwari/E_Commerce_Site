import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Navbar from "../components/Navbar"; // Optional

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();

      if (json.success) {
        // Save Token
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("token", json.authToken);

        // Redirect to Home (App.jsx will now allow access)
        navigate("/");
      } else {
        alert("Enter Valid Credentials");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Server Error");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg")',
        height: "100vh",
        backgroundSize: "cover",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div className="container h-100 d-flex justify-content-center align-items-center">
        <form
          className="w-50 border bg-dark border-success rounded p-4 text-white"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center mb-4">Login</h2>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Submit
          </button>
          <Link to="/signup" className="mt-3 btn btn-danger w-100">
            I'm a New User
          </Link>
        </form>
      </div>
    </div>
  );
}
