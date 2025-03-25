import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    API.get("trips/")
      .then((response) => setTrips(response.data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);

  return (
    <div>
      <h2>Trips</h2>
      {trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <strong>
                {trip.start_location} → {trip.end_location}
              </strong>{" "}
              <br />⏳ {trip.total_hours} hrs | ⛽ Fuel Stops: {trip.fuel_stops}{" "}
              | 🚛 Rest Stops: {trip.rest_stops}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
