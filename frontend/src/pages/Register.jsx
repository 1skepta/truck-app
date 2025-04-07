import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    last_name: "",
    first_name: "",
  });
  const [profileData, setProfileData] = useState({
    license_number: "",
    truck_type: "",
    years_of_experience: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedData = {
      ...formData,
      profile: profileData,
    };

    try {
      await API.post("register/", combinedData);
      alert("Account created! Please log in");
      navigate("/");
    } catch (error) {
      alert("Signup failed. Try again");
    }
  };

  return (
    <div className=" bg-[#F3FFFD]">
      <h2 className="mt-10 mb-6 font-extrabold text-2xl text-center">
        REGISTER
      </h2>
      <div className="text-black flex flex-col justify-between min-h-screen relative bg-[#F3FFFD] md:flex-row md:pl-20">
        <div className="p-7 flex flex-col items-center bg-[#F3FFFD] rounded-lg overflow-y-auto max-h-[75vh] md:w-1/2 md:max-h-none md:p-0 ">
          <form onSubmit={handleSubmit} className="flex flex-col w-4/5">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <input
              type="text"
              name="username"
              placeholder="Preferred Username"
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
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <input
              type="text"
              name="license_number"
              placeholder="License Number"
              onChange={handleProfileChange}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <input
              type="text"
              name="truck_type"
              placeholder="Truck Type"
              onChange={handleProfileChange}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <input
              type="number"
              name="years_of_experience"
              placeholder="Years of Experience"
              onChange={handleProfileChange}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <button className="bg-[#00cca6] py-2 text-white font-bold rounded-sm cursor-pointer">
              Register
            </button>
          </form>
          <p className="mt-4 text-sm">
            Already have an account?
            <a href="/" className="text-[#00cca6] font-bold pl-1">
              Login
            </a>
          </p>
        </div>

        <img
          src="assets/auth.png"
          alt="background"
          className="absolute bottom-0 left-0 w-full md:static md:w-1/2 h-[25vh] md:h-auto object-cover"
        />
      </div>
    </div>
  );
}

export default Register;
