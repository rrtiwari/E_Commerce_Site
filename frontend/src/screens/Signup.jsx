import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Navbar from "../components/Navbar"; // Optional: Uncomment if you want Navbar on Signup

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  let [address, setAddress] = useState("");
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: long } = position.coords;
        const response = await fetch(
          "http://localhost:5000/api/auth/getlocation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latlong: { lat, long } }),
          }
        );
        const { location } = await response.json();
        setAddress(location);
        setCredentials({ ...credentials, geolocation: location });
      },
      (error) => {
        console.error(error);
        alert("Location permission denied or error occurred.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/createuser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            location: credentials.geolocation || address,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        alert("Signup Successful! Please Login to continue.");
        navigate("/login"); // Redirect to Login page
      } else {
        alert("Invalid Credentials or User Already Exists");
      }
    } catch (error) {
      console.error(error);
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
          'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg")',
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div className="container h-100 d-flex justify-content-center align-items-center">
        <form
          className="w-50 border bg-dark border-success rounded p-4 text-white"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center mb-4">Sign Up</h2>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              onClick={handleClick}
              className="btn btn-success btn-sm"
            >
              Fetch Current Location
            </button>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
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
          <Link to="/login" className="mt-3 btn btn-danger w-100">
            Already a User? Login
          </Link>
        </form>
      </div>
    </div>
  );
}
