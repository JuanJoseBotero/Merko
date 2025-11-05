import { useEffect, useState } from "react";
import axios from "axios";
import HorizontalBarChart from "../Components/CurrentComponents/HorizontalBarChart";
import PieChart from "../Components/CurrentComponents/PieChart";
import HSCodeSearchForm from "../Components/CurrentComponents/HSCodeSearchForm";

export default function CurrentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCode) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://34.31.138.222:8000/api/analysis/current-dashboard-view/?cmd_code=${selectedCode}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCode]);

  if (!selectedCode) {
    return (
      <div style={{ padding: "2rem" }}>
        <HSCodeSearchForm onSelect={(code) => setSelectedCode(code.split(" - ")[0])} />
      </div>
    );
  }
  if (loading) return <div><b>Loading Dashboard...</b></div>;
  if (error) return <div style={{ color: "red" }}><b>Error:</b> {error}</div>;
  if (!data) return <div><b>No data available</b></div>;

  const imports = data.imports;
  const exports = data.exports;
  const product = data.imports?.top10?.[0]?.cmdDesc || "Unknown Product";

  return (
    <div style={{ padding: "2rem" }}>
      {/* Tarjeta superior con descripción del producto */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontWeight: "bold", fontSize: "1.6rem", margin: 0 }}>{product}</h2>
        <p style={{ color: "#555", marginTop: "0.75rem", fontSize: "1.1rem" }}>
          Product Code: <b>{data.product_code}</b>
        </p>
      </div>

      {/* Graficas de top 10 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <HorizontalBarChart title="Top 10 Importing Countries" data={imports.top10} />
        <HorizontalBarChart title="Top 10 Exporting Countries" data={exports.top10} />
      </div>

      {/* Contexto económico */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        <CountryIndicators
          title={`Economic Indicators (${imports.top_country})`}
          data={imports.economic_context.data}
        />
        <CountryIndicators
          title={`Economic Indicators (${exports.top_country})`}
          data={exports.economic_context.data}
        />
      </div>

      {/* Partners */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        <PieChart title="Trade Partners - Imports" data={imports.partners.partners} />
        <PieChart title="Trade Partners - Exports" data={exports.partners.partners} />
      </div>
    </div>
  );
}

/* 🔹 Tarjeta para indicadores */
function CountryIndicators({ title, data }: { title: string; data: any }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ fontWeight: "bold", marginBottom: "1rem", fontSize: "1.3rem" }}>{title}</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "0.75rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{key}</p>
            <p style={{ color: "#333", margin: 0 }}>{Number(value).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
