// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://journly.onrender.com/api/auth/register",
        form
      );

      // Save token
      localStorage.setItem("token", res.data.token);

      console.log("✅ Signup Success:", res.data);

      alert("Signup successful!");

      // Go to login page after signup
      navigate("/login");
    } catch (err) {
      console.error(
        "❌ Signup Error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        <p>Secure Your Journals / Notes</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            className="signup-button"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        <p className="signin-link">
          Already a member?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;