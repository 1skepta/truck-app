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
    <div>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button>Register</button>
        </form>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
