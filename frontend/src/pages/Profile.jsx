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
        setMessage("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile.");
      });
  };

  return (
    <div>
      <div>
        <h2>My Profile</h2>

        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>License Number</label>
              <input
                type="text"
                name="license_number"
                value={profile.license_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Truck Type</label>
              <input
                type="text"
                name="truck_type"
                value={profile.truck_type}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Years of Experience</label>
              <input
                type="number"
                name="years_of_experience"
                value={profile.years_of_experience}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Profile;
