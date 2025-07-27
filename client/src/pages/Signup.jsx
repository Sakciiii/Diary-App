// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate(); // 🧭 used for redirecting

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      // 🔐 Save token to localStorage
      localStorage.setItem("token", res.data.token);
      
       console.log("✅ Signup Success:", res.data);
    alert("Signup successful!");
     navigate("/login");
      // ✅ Redirect to Diary page
      navigate("/diary");
    } catch (err) {
      console.error("❌ Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <p>Secure Your Journals / Notes</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="signup-button" type="submit">Sign Up</button>
        </form>
        <p className="signin-link">Already a member? <a href="/login">Sign in</a></p>
      </div>
    </div>
  );
}

export default Signup;

