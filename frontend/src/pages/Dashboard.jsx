import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state for the modal
  const [currentLocation, setCurrentLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [cycleHours, setCycleHours] = useState("");

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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Clear the form fields
    setCurrentLocation("");
    setPickupLocation("");
    setDropoffLocation("");
    setCycleHours("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build payload mapping form fields to model fields.
    // Since your Trip model requires start_time and end_time, we'll use the current time.
    const nowISO = new Date().toISOString();
    const payload = {
      start_location: pickupLocation,
      end_location: dropoffLocation,
      total_hours: parseFloat(cycleHours),
      start_time: nowISO,
      end_time: nowISO,
    };

    API.post("trips/", payload)
      .then((response) => {
        // Refresh the trips list and close the modal
        fetchTrips();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding trip:", error);
        setError("Failed to add trip. Please try again.");
      });
  };

  return (
    <div className="px-5">
      <div className="flex items-center justify-between">
        <h2>My Trips</h2>
        <button
          onClick={handleOpenModal}
          className="bg-[#00cca6] py-1 px-3 text-white rounded-sm"
        >
          Add Trip
        </button>
      </div>
      {loading ? (
        <p className="text-center mt-5">Loading trips...</p>
      ) : error ? (
        <p>{error}</p>
      ) : trips.length === 0 ? (
        <p className="text-center mt-5">No trips found. Start a new journey!</p>
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

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded p-5 w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="mb-4 text-lg font-semibold">Add New Trip</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Current Location
                </label>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  placeholder="Enter your current location"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  placeholder="Enter pickup location"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  placeholder="Enter dropoff location"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Current Cycle Used (Hrs)
                </label>
                <input
                  type="number"
                  value={cycleHours}
                  onChange={(e) => setCycleHours(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  placeholder="Enter cycle hours used"
                  step="0.1"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#00cca6] text-white py-1 px-3 rounded-sm w-full"
              >
                Add Trip
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
