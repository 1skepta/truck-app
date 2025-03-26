import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Profile() {
  const [profile, setProfile] = useState({
    license_number: "",
    truck_type: "",
    years_of_experience: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("profile/")
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          setError("Failed to load profile.");
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put("profile/update/", profile)
      .then((response) => {
        setMessage("✅ Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("❌ Failed to update profile.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-700 mb-4 text-center">
          🚛 My Profile
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                License Number
              </label>
              <input
                type="text"
                name="license_number"
                value={profile.license_number}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Truck Type
              </label>
              <input
                type="text"
                name="truck_type"
                value={profile.truck_type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Years of Experience
              </label>
              <input
                type="number"
                name="years_of_experience"
                value={profile.years_of_experience}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-semibold transition"
            >
              Update Profile
            </button>
          </form>
        )}

        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
