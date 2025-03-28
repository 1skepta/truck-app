import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import Map from "../components/Map";
import LogChart from "../components/LogChart";

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`trips/${id}/`)
      .then((response) => {
        setTrip(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        setError("Failed to load trip details.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-5">
      {loading ? (
        <p>Loading trip details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>Trip Details</h2>
          <p>
            <strong>From:</strong> {trip.start_location} <br />
            <strong>To:</strong> {trip.end_location} <br />
            <strong>Hours Used:</strong> {trip.total_hours} hrs
          </p>

          <h3>Trip Route</h3>
          <Map
            startLocation={trip.start_location}
            endLocation={trip.end_location}
          />

          <h3>Trip Analysis</h3>
          <LogChart tripId={trip.id} />
        </>
      )}
    </div>
  );
}

export default TripDetails;
