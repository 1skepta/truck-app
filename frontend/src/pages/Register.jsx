import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("register/", formData);
      alert("Account created! Please log in");
      navigate("/");
    } catch (error) {
      alert("Signup failed. Try again");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
