import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useState, useEffect } from "react";

function Map({ startLocation, endLocation }) {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);

  useEffect(() => {
    async function getCoordinates(city, setCoords) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
        );
        const data = await response.json();
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          console.error(`No coordinates found for ${city}`);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }

    getCoordinates(startLocation, setStartCoords);
    getCoordinates(endLocation, setEndCoords);
  }, [startLocation, endLocation]);

  return (
    <MapContainer
      center={startCoords || [0, 0]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {startCoords && <Marker position={startCoords} />}
      {endCoords && <Marker position={endCoords} />}
      {startCoords && endCoords && (
        <Polyline positions={[startCoords, endCoords]} color="blue" />
      )}
    </MapContainer>
  );
}

export default Map;
