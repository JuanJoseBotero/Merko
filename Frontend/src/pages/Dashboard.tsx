import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import CompLine from '../Components/DashboardComponents/CompLine';
import CompBump from '../Components/DashboardComponents/CompBump';
import CompPie from '../Components/DashboardComponents/CompPie';
import CompRadar from '../Components/DashboardComponents/CompRadar';
import "../css/dashboard.css"

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
const colors = { scheme: 'tableau10' }

export default function Dashboard() {

  const [location, setLocation] = React.useState(useLocation());  

  const data : any = location.state?.data || null;
  console.log("Dashboard data received:");
  console.log(data.dashboard_diagrams[0].diagram_name);

  // Funcion para seleccionar que grafico usar
  const chart = (item:ChartProps, id:number, title:string) => {
    switch(item.type_of_chart) {
      case "Line":
        return <div key={id} className='bg-white item-large'>
                  <h3 className='text-center pt-3'>{title}</h3>
                  <div className='h-80'>
                    <CompLine data={item.chart_data} title={title} colors={colors} className="w-1/2"/>
                  </div>
                </div>
      case "Bump":
        return <div key={id} className='h-90 bg-white item-large'>
                  <h3 className='text-center pt-3'>{title}</h3>
                  <div className='h-80'>
                    <CompBump key={id} title={title} data={item.chart_data} className="w-1/2"/>
                  </div>
                </div>
      case "Pie":
        return  <div key={id} className='h-90 bg-white item-small'>
                  <h3 className='text-center pt-3'>{title}</h3>
                  <div className='h-80'>
                    <CompPie key={id} title={title} data={item.chart_data} colors={colors} className="w-50"/>
                  </div>
                </div>
      case "Radar":
        return  <div key={id} className='h-90 bg-white item-small'>
                  <h3 className='text-center pt-3'>{title}</h3>
                  <div className='h-80'>
                    <CompRadar key={id} title={title} data={item.chart_data} colors={colors} className="w-1/2"/>
                  </div>
                </div>
    }
  }


  return (
    <div>
      <div className='text-3xl font-bold m-10'>
        Dashboard
      </div>
      <div className='flex flex-col md:flex-row md:justify-between md:flex-wrap  gap-4 m-10'>
        {data.dashboard_diagrams.map((item: ChartProps, id: number) => {
          const title = item?.diagram_name || "No title available";
          return chart(item, id, title);
        })}

      </div>
    </div>
  )
}
