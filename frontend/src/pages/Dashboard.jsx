import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    setCurrentLocation("");
    setPickupLocation("");
    setDropoffLocation("");
    setCycleHours("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        fetchTrips();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding trip:", error);
        setError("Failed to add trip. Please try again.");
      });
  };

  return (
    <div className="px-5 md:mx-16">
      <div className="flex items-center justify-between md:mx-12">
        <h2 className="font-black">My Trips</h2>
        <button
          onClick={handleOpenModal}
          className="bg-[#00cca6] py-1 px-3 text-white rounded-sm cursor-pointer"
        >
          Add Trip
        </button>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-[10] flex items-center text-xs font-light leading-4 justify-center px-5 pb-5">
        <div className="bg-[#F3FFFD] w-60 mr-3 h-36 pt-3 pl-2 shadow-md">
          <img src="assets/handshake.png" alt="handshake" className="w-10" />
          <p>Manage your business deals and partnerships with ease</p>
        </div>
        <div className="bg-[#F3FFFD] w-60 mr-3 h-36 pt-3 pl-2 shadow-md">
          <img src="assets/truck.png" alt="truck" className="w-10" />
          <p>Track and monitor all your rides in one place</p>
        </div>
        <div className="bg-[#00cca6] w-60 h-36 pt-3 pl-2 shadow-md">
          <img src="assets/insurance.png" alt="insurance" className="w-10" />
          <p>Stay updated on your truck's insurance coverage</p>
        </div>
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
            className="bg-white rounded px-5 py-10 w-96 relative mx-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Trip</h3>
              <button
                onClick={handleCloseModal}
                className="text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
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
                className="bg-[#00cca6] text-white py-1 px-3 rounded-sm w-full font-bold cursor-pointer"
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
