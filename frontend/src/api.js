import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  // baseURL: "http://192.168.1.101:8000/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && !config.url.includes("register")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
