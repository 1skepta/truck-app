import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    API.get("trips/")
      .then((response) => {
        console.log("Trips data:", response.data); // Debugging
        setTrips(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching trips:",
          error.response ? error.response.data : error.message
        );
      });
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
              {trip.start_location} → {trip.end_location} ({trip.total_hours}{" "}
              hrs)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
