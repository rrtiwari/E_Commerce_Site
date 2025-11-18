import React from "react";
import "./App.css";
import "bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import MyOrder from "./screens/MyOrder";
import { CartProvider } from "./components/ContextReducer";

function App() {
  // Check if token exists in localStorage
  const isAuthenticated = () => {
    return localStorage.getItem("token");
  };

  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            {/* ROUTE PROTECTION LOGIC:
              1. If user is logged in -> Show Home
              2. If user is NOT logged in -> Redirect to Signup
            */}
            <Route
              exact
              path="/"
              element={isAuthenticated() ? <Home /> : <Navigate to="/signup" />}
            />

            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />

            {/* Protect the MyOrder route as well */}
            <Route
              exact
              path="/myorder"
              element={
                isAuthenticated() ? <MyOrder /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
