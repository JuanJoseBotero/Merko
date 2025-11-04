import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardV2 = () => {
  type Dashboard = {
  id: number;
  name: string;
  date: string;
  // agrega otros campos si los necesitas
};

const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("No username found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/analysis/dashboards/?username=${username}`
        );
        setDashboards(response.data);
      } catch (err) {
        setError("Error fetching dashboards");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  if (loading) return <p>Loading dashboards...</p>;
  if (error) return <p>{error}</p>;
  if (dashboards.length === 0) return <p>No dashboards found</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {dashboards.map((dashboard) => (
        <div
          key={dashboard.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            width: "250px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{dashboard.name}</h3>
          <p>
            Created on: {new Date(dashboard.date).toLocaleDateString()}{" "}
            {new Date(dashboard.date).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardV2;
