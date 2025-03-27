import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import bg from "../assets/login.png";

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
    <div className="text-black flex flex-col justify-between min-h-screen relative">
      <div className="p-7 flex flex-col items-center bg-white rounded-lg">
        <h2 className="mt-20 mb-10 font-extrabold text-2xl">REGISTER</h2>
        <form onSubmit={handleSubmit} className="flex flex-col w-5/6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-4 focus:border-gray-200 focus:ring-0"
          />
          <button className="bg-[#00cca6] py-2 text-white font-bold rounded-md">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <a href="/" className="text-[#00cca6] font-bold">
            Login
          </a>
        </p>
      </div>

      <img
        src={bg}
        alt="background"
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: "40vh",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export default Register;
