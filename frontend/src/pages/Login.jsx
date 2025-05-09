import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("token/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2 className="pt-20 font-extrabold text-2xl text-center bg-[#F3FFFD]">
        LOGIN
      </h2>
      <div className="text-black bg-[#F3FFFD] flex flex-col justify-between min-h-screen relative md:flex-row md:px-20 md:pt-10 ">
        <div className="p-7 flex flex-col items-center bg-[#F3FFFD] rounded-lg md:p-0 md:w-1/2">
          <form
            onSubmit={handleLogin}
            className="flex flex-col w-5/6 md:w-4/6 md:mt-5"
          >
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-2 focus:border-gray-200 focus:ring-0"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-100 border-2 border-gray-200 rounded-md p-2 mb-4 focus:border-gray-200 focus:ring-0"
            />
            <button className="bg-[#00cca6] py-2 text-white font-bold rounded-md cursor-pointer">
              Login
            </button>
          </form>

          <p className="mt-4 text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-[#00cca6] font-bold">
              Create one
            </a>
          </p>
        </div>

        <img
          src="assets/auth.png"
          alt="background"
          className="absolute bottom-0 left-0 w-full md:w-1/2 md:static"
          style={{
            height: "45vh",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}

export default Login;
