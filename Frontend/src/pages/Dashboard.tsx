import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DashboardCard from '../Components/DashboardComponents/DashboardCard';

interface ResponseProps {
    dashboard_id : number;
    dashboard_name : string;
    used_prompts : string[];
    date : any;
    dashboard_diagrams : ChartProps[];
}

interface ChartProps {
    diagram_name : string;
    type_of_chart : string;
    chart_data : any;
}

// Variable para establecer el esquema de colores
const colors = [
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

export default function Dashboard() {

  const [location, setLocation] = React.useState(useLocation());  

  const data : any = location.state?.data || null;
  console.log("Dashboard data received:");
  console.log(data.dashboard_diagrams[0].diagram_name);


  return (
    <div>
      <div className='text-3xl font-bold m-10'>
        Dashboard
      </div>
      <div className='flex flex-col md:flex-row md:justify-between md:flex-wrap  gap-x-4 gap-y-13 m-10'>
        {data.dashboard_diagrams.map((item: ChartProps, id: number) => {
          const title = item?.diagram_name || "No title available";
          return <DashboardCard 
            id={id}
            item={item} 
            title={title} 
            colors={colors} />
        })}
      </div>
    </div>
  )
}
