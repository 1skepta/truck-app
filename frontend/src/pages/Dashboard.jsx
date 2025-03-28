import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = () => {
    API.get("trips/")
      .then((response) => {
        setTrips(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          setError("Failed to load trips. Please try again.");
        }
        setLoading(false);
      });
  };

  return (
    <div className="px-5">
      <h2>My Trips</h2>
      {loading ? (
        <p>Loading trips...</p>
      ) : error ? (
        <p>{error}</p>
      ) : trips.length === 0 ? (
        <p>No trips found. Start a new journey!</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li
              className="bg-gray-100 p-5 mt-4 rounded-md cursor-pointer bg-[url('/images/trips.png')] bg-no-repeat bg-right bg-contain"
              key={trip.id}
              onClick={() => navigate(`/trip/${trip.id}`)}
            >
              <p>
                {trip.start_location} → {trip.end_location}
              </p>
              <p>Cycle Hours: {trip.total_hours} hrs used</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
