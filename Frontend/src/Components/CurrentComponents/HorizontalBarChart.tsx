import { ResponsiveBar } from "@nivo/bar";

interface HorizontalBarChartProps {
  title: string;
  data: any[];
  nameField?: string;
  valueField?: string;
}

export default function HorizontalBarChart({
  title,
  data,
  nameField = "Country",
  valueField = "Trade Value (US$)",
}: HorizontalBarChartProps) {
  // Normalizamos los datos
  const formattedData = (data || []).map((item) => ({
    name: item[nameField] || "Unknown",
    value: Number(item[valueField]) || 0,
  }));

  return (
    <div
      style={{
        height: "auto",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "24px",
      }}
    >
      {/* Título y subtítulo */}
      <h3
        style={{
          textAlign: "left",
          marginBottom: "0.25rem",
          fontWeight: "bold",
          fontSize: "1.3rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#666",
          fontSize: "1rem",
          textAlign: "left",
          marginBottom: "1rem",
        }}
      >
        January - September 2025
      </p>

      {/* Gráfica */}
      <div style={{ height: 370 }}>
        <ResponsiveBar
          data={formattedData}
          keys={["value"]}
          indexBy="name"
          layout="horizontal"
          margin={{ top: 40, right: 60, bottom: 60, left: 160 }}
          padding={0.3}
          colors={({ index }) =>
            [
              "#FEE08C",
              "#012A4A",
              "#01497C",
              "#2A6F97",
              "#2C7DA0",
              "#468FAF",
              "#61A5C2",
              "#61A5C2",
              "#89C2D9",
              "#A9D6E5",
            ][index % 10]
          }
          axisTop={null}
          axisRight={null}
          valueFormat={(v) => {
            if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
            if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
            if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
            return v.toFixed(0);
          }}
          axisBottom={{
            legend: "Trade Value (US$)",
            legendPosition: "middle",
            legendOffset: 40,
            tickValues: 5, // 🔹 menos ticks para mejor legibilidad
          }}
          axisLeft={{
            legend: "Country",
            legendPosition: "middle",
            legendOffset: -140,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          theme={{
            axis: {
              legend: { text: { fontWeight: "bold", fontSize: 15 } },
              ticks: { text: { fontWeight: "bold", fontSize: 14 } },
            },
            labels: { text: { fontWeight: "bold", fontSize: 13 } },
          }}
          animate={true}
        />
      </div>
    </div>
  );
}
