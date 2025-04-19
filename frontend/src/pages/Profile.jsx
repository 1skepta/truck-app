import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Profile() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
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
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put("profile/update/", {
      license_number: profile.license_number,
      truck_type: profile.truck_type,
      years_of_experience: profile.years_of_experience,
    })
      .then((response) => {
        setMessage("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      {loading ? (
        <p className="text-gray-600">Loading profile...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white shadow rounded p-6">
          <div className="mb-6 border-b pb-4">
            <h3 className="text-xl font-medium mb-2">User Information</h3>
            <p>
              <span className="font-bold">Full Name: </span>
              {profile.first_name} {profile.last_name}
            </p>
            <p>
              <span className="font-bold">Username: </span>
              {profile.username}
            </p>
            <p>
              <span className="font-bold">Email: </span>
              {profile.email}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-4">Driver Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="license_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Number
                </label>
                <input
                  type="text"
                  name="license_number"
                  id="license_number"
                  value={profile.license_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="truck_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Truck Type
                </label>
                <input
                  type="text"
                  name="truck_type"
                  id="truck_type"
                  value={profile.truck_type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="years_of_experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="years_of_experience"
                  id="years_of_experience"
                  value={profile.years_of_experience}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Update Profile
              </button>
            </form>
          </div>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default Profile;
