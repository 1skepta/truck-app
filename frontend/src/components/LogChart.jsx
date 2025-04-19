import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
import API from "../api";

Chart.register(...registerables);

function LogChart({ tripId }) {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    if (tripId) {
      API.get(`logs/?trip=${tripId}`)
        .then((response) => setLogData(response.data))
        .catch((error) => console.error("Error fetching logs:", error));
    }
  }, [tripId]);

  const chartData = {
    labels: logData.map((log) => new Date(log.log_time).toLocaleTimeString()),
    datasets: [
      {
        label: "Driving Hours",
        data: logData.map((log) => (log.status === "Driving" ? 1 : 0)),
        backgroundColor: "blue",
      },
      {
        label: "Resting Hours",
        data: logData.map((log) => (log.status === "Resting" ? 1 : 0)),
        backgroundColor: "red",
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
}

export default LogChart;
