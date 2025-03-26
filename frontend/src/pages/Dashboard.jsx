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
    current_location: "",
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
    // We assume that pickup_location becomes the trip's start_location and
    // dropoff_location becomes the trip's end_location.
    const now = new Date();
    const estimatedDurationHours = 4; // You can adjust this logic later.
    const formattedTrip = {
      start_location: newTrip.pickup_location,
      end_location: newTrip.dropoff_location,
      distance_miles: 100, // or compute if needed
      start_time: now.toISOString(),
      end_time: new Date(
        now.getTime() + estimatedDurationHours * 3600000
      ).toISOString(),
      total_hours: parseFloat(newTrip.current_cycle_hours) || 0,
    };

    console.log("Submitting trip:", formattedTrip);

    API.post("trips/", formattedTrip)
      .then((response) => {
        console.log("Trip added successfully:", response.data);
        fetchTrips();
        setMessage("Trip added successfully!");
        // Clear only the fields used for the trip addition.
        setNewTrip({
          current_location: "",
          pickup_location: "",
          dropoff_location: "",
          current_cycle_hours: "",
        });
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Failed to add trip:", error.response?.data);
        setError(`Failed to add trip: ${JSON.stringify(error.response?.data)}`);
      });
  };

  return (
    <div>
      <div>
        <div>
          <h2>My Trips</h2>
          <button onClick={() => setShowModal(true)}>Add Trip</button>
        </div>

        {loading ? (
          <p>Loading trips...</p>
        ) : error ? (
          <p>{error}</p>
        ) : trips.length === 0 ? (
          <p>No trips found. Start a new journey!</p>
        ) : (
          <ul>
            {trips.map((trip) => (
              <li key={trip.id} onClick={() => setSelectedTrip(trip)}>
                <p>
                  {trip.start_location} → {trip.end_location}
                </p>
                <p>Cycle Hours: {trip.total_hours} hrs used</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedTrip && (
        <div>
          <h3>Trip Route:</h3>
          <Map
            startLocation={selectedTrip.start_location}
            endLocation={selectedTrip.end_location}
          />
          <LogChart tripId={selectedTrip.id} />
        </div>
      )}

      {showModal && (
        <div>
          <div>
            <h2>Add New Trip</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Current Location</label>
                <input
                  type="text"
                  name="current_location"
                  value={newTrip.current_location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Pickup Location</label>
                <input
                  type="text"
                  name="pickup_location"
                  value={newTrip.pickup_location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Dropoff Location</label>
                <input
                  type="text"
                  name="dropoff_location"
                  value={newTrip.dropoff_location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Current Cycle Used (Hrs)</label>
                <input
                  type="number"
                  name="current_cycle_hours"
                  value={newTrip.current_cycle_hours}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
