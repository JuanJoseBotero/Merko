// ✅ src/Components/CurrentComponents/Charts/PieChart.tsx
import { ResponsivePie } from "@nivo/pie";

interface PieChartProps {
  title: string;
  data: { name: string; value: number }[];
}

export default function PieChart({ title, data }: PieChartProps) {
  // Filtrar "World" y mapear datos
  const formatted = data
    .filter((d) => d.name !== "World")
    .map((d) => ({
      id: d.name,
      label: d.name,
      value: d.value,
    }));

  const palette = [
    "#012A4A",
              "#01497C",
              "#2A6F97",
              "#2C7DA0",
              "#468FAF",
              "#61A5C2",
              "#61A5C2",
              "#89C2D9",
              "#A9D6E5",
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: "1rem",
          fontSize: "1.3rem",
        }}
      >
        {title}
      </h3>

      <div style={{ height: 360 }}>
        <ResponsivePie
          data={formatted}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}

          padAngle={1.5}
          cornerRadius={3}
          colors={palette}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsTextColor="#333"
          arcLinkLabelsThickness={2}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          theme={{
            labels: { text: { fontWeight: "bold", fontSize: 13 } },
            legends: { text: { fontSize: 13, fontWeight: "bold" } },
          }}
          enableArcLabels={false}
        />
      </div>
    </div>
  );
}
