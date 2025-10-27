import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
// import {Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import data from "../dashboardjson.json";
import CompLine from '../Components/DashboardComponents/CompLine';
import CompBump from '../Components/DashboardComponents/CompBump';
import CompPie from '../Components/DashboardComponents/CompPie';
import CompRadar from '../Components/DashboardComponents/CompRadar';
import "../css/dashboard.css"

interface ChartProps {
  type_of_chart: string;
  chart_data: any;
}

// Variable para establecer el esquema de colores
const colors = { scheme: 'tableau10' }

export default function Dashboard() {

  const [location, setLocation] = React.useState(useLocation());  

  const dataa = location.state as {responseData: ChartProps[]};

  console.log(dataa.responseData);

  // Funcion para seleccionar que grafico usar
  const chart = (item:ChartProps, id:number) => {
    switch(item.type_of_chart) {
      case "Line":
        return <div key={id} className='h-80 bg-white item-large'><CompLine data={item.chart_data} colors={colors} className="w-1/2"/></div>
      case "Bump":
        return <div key={id} className='h-80 bg-white item-large'><CompBump key={id} data={item.chart_data} colors={colors} className="w-1/2"/></div>
      case "pie":
        return <div key={id} className='h-80 bg-white item-small'><CompPie key={id} data={item.chart_data} colors={colors} className="w-50"/></div>
      case "Radar":
        return <div key={id} className='h-80 bg-white item-small'><CompRadar key={id} data={item.chart_data} colors={colors} className="w-1/2"/></div>
    }
  }


  return (
    <div>
      <div className='text-3xl font-bold m-10'>
        Dashboard
      </div>
      <div className='flex flex-col md:flex-row md:justify-between md:flex-wrap  gap-4 m-10'>
        {data.map((item, id) => (
          chart(item, id)
        ))}
      </div>
    </div>
  )
}
