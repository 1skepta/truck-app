import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    <div className="p-5 md:mx-16">
      {loading ? (
        <p>Loading trip details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="md:mx-16">
          <h2 className="text-center font-bold">Trip Details</h2>

          <div className="flex-col justify-between flex ">
            <span>
              <strong>From:</strong> {trip.start_location}
            </span>
            <span>
              <strong>To:</strong> {trip.end_location}
            </span>
            <span>
              <strong>Hours Used:</strong> {trip.total_hours} hrs
            </span>
          </div>

          <h3 className="text-center font-bold mt-6 mb-3">Trip Route</h3>
          <Map
            startLocation={trip.start_location}
            endLocation={trip.end_location}
          />

          <h3 className="text-center font-bold mt-6 mb-3">Trip Analysis</h3>
          <LogChart tripId={trip.id} />
        </div>
      )}
    </div>
  );
}

export default TripDetails;
