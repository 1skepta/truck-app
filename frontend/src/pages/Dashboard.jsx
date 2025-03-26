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
  const [showModal, setShowModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    start_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_hours: "",
  });
  const [message, setMessage] = useState("");
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

  const handleChange = (e) => {
    setNewTrip({ ...newTrip, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedTrip = {
      start_location: newTrip.start_location,
      end_location: newTrip.dropoff_location,
      distance_miles: 100,
      start_time: new Date().toISOString(),
      end_time: new Date(new Date().getTime() + 4 * 3600000).toISOString(),
      total_hours: parseFloat(newTrip.current_cycle_hours) || 0,
    };

    console.log("Submitting trip:", formattedTrip);

    API.post("trips/", formattedTrip)
      .then((response) => {
        console.log("Trip added successfully:", response.data);
        fetchTrips();
        setMessage("Trip added successfully!");
        setNewTrip({
          start_location: "",
          dropoff_location: "",
          current_cycle_hours: "",
        });
        setShowModal(false);
      })
      .catch((error) => {
        console.error("❌ Failed to add trip:", error.response.data);
        setError(
          `❌ Failed to add trip: ${JSON.stringify(error.response.data)}`
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">🚛 My Trips</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add Trip
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading trips...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : trips.length === 0 ? (
          <p className="text-gray-500 mt-4 text-center">
            No trips found. Start a new journey!
          </p>
        ) : (
          <ul className="space-y-4 mt-4">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedTrip(trip)}
              >
                <p className="text-lg font-semibold text-gray-800">
                  {trip.pickup_location} → {trip.dropoff_location}
                </p>
                <p className="text-sm text-gray-600">
                  ⏳ {trip.current_cycle_hours} hrs used
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
            startLocation={selectedTrip.pickup_location}
            endLocation={selectedTrip.dropoff_location}
          />
          <LogChart tripId={selectedTrip.id} />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              ➕ Add New Trip
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Current Location
                </label>
                <input
                  type="text"
                  name="start_location"
                  value={newTrip.start_location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickup_location"
                  value={newTrip.pickup_location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  name="dropoff_location"
                  value={newTrip.dropoff_location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Current Cycle Used (Hrs)
                </label>
                <input
                  type="number"
                  name="current_cycle_hours"
                  value={newTrip.current_cycle_hours}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600"
                >
                  Add Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
