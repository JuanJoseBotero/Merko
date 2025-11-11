import { useLocation, Link } from "react-router-dom";
import DashboardCard from "../Components/DashboardComponents/DashboardCard";
import { ResponsiveBar } from '@nivo/bar';
import CompRadar from "../Components/DashboardComponents/CompRadar";

export default function DashboardV1() {

  const data = {
    diagram_name: "Sample Bar Chart",
    type_of_chart: "Bar",
    chart_data : [
            { 
              id : 'Strong', 
              "Global": 80, 
              "Europe": 70
            },
            {
              id : 'Medium',
              "Global": 55,
              "Europe": 45
            },
            {
              id : 'Weak',
              "Global": 30,
              "Europe": 20
            }
  ]
  }

  const palette = [
    "#3288BD",
    "#D53E4F",
    "#F46D43",
    "#FDAE61",
    "#FEE08C",
    "#E6F598",
    "#ABDDA4",
    "#66C2A5",
    "#9E0142",
    "#5E4FA2",
  ];

  const keys = Object.keys(data.chart_data[0])
  console.log(keys);

  const indexBy = keys[0]

  keys


  const colors = { scheme: 'tableau10' }

  return (
    <div className="p-6 max-w-5xl mx-auto ">
      <h1 className="my-10"> Hola</h1>
      <div className="h-100">
        <CompRadar data={data.chart_data} colors={palette} />
      </div>
    </div>
  );
}
