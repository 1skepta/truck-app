import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Map from "../components/Map";
import LogChart from "../components/LogChart";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("trips/")
      .then((response) => {
        setTrips(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
        if (error.response && error.response.status === 401) {
          navigate("/"); // Redirect to login if unauthorized
        } else {
          setError("Failed to load trips. Please try again.");
        }
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/"); // Redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">🚛 My Trips</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading trips...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : trips.length === 0 ? (
          <div className="text-center mt-6">
            <p className="text-gray-500">
              No trips found. Start a new journey!
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add a New Trip
            </button>
          </div>
        ) : (
          <ul className="space-y-4 mt-4">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedTrip(trip)}
              >
                <p className="text-lg font-semibold text-gray-800">
                  {trip.start_location} → {trip.end_location}
                </p>
                <p className="text-sm text-gray-600">
                  ⏳ {trip.total_hours} hrs | ⛽ {trip.fuel_stops} Fuel Stops |
                  🚛 {trip.rest_stops} Rest Stops
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedTrip && (
        <div className="max-w-4xl mx-auto mt-6">
          <h3 className="text-xl font-bold">Trip Route:</h3>
          <Map
            startLocation={selectedTrip.start_location}
            endLocation={selectedTrip.end_location}
          />
          <LogChart tripId={selectedTrip.id} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
