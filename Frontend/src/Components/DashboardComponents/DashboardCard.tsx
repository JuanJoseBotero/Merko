import React from 'react'
import "react-resizable/css/styles.css";
import { useState } from 'react';
import CompLine from './CompLine';
import CompBump from './CompBump';
import CompPie from './CompPie';
import CompRadar from './CompRadar';
import CompBar from './CompBar';
import "../../css/Dashboard.css"

interface ChartProps {
    diagram_name : string;
    type_of_chart : string;
    chart_data : any;
    resume: string;
}

export default function DashboardCard( {id, item, title, colors} : {id: number, item: ChartProps, title: string, colors: any} ) {

    const [isActive, setIsActive] = useState<'Chart' | 'Resume'>('Chart');

    const size = (item : ChartProps) => {
        if (item.type_of_chart === "Line" || item.type_of_chart === "Bump" || item.type_of_chart === "Bar") {
            return 'large';
        } 
        else {
            return 'small';
        }
    }

    const components = (item : ChartProps) => {
        switch(item.type_of_chart) {
            case "Line":
                return <CompLine key={id} data={item.chart_data} colors={colors} className="w-1/2"/>;
            case "Bump":
                return <CompBump key={id} data={item.chart_data} colors={colors} className="w-1/2"/>;
            case "Pie":
                return <CompPie key={id} data={item.chart_data} colors={colors} className="w-50"/>;
            case "Radar":
                return <CompRadar key={id} data={item.chart_data} colors={colors} className="w-1/2"/>;
            case "Bar":
                return <CompBar key={id} data={item.chart_data} colors={colors} className="w-1/2"/>;
        }
    }

  return (
    <>
        <div key={id} className={`bg-white relative ${size(item) === 'large' ? 'item-large' : 'item-small'}`}>
            <div className='absolute -top-10 left-10 flex gap-5 '>
                <button className={`button-chart ${isActive=='Chart'? 'active' : ''} `} onClick={() => setIsActive('Chart')}>Chart</button>
                <button className={`button-chart ${isActive=='Chart'? '' : 'active'} `} onClick={() => setIsActive('Resume')} >Resume</button>
            </div>
            <div className={`absolute inset-0 w-full backdrop-blur-sm z-10 transition-all duration-300 ${isActive === 'Chart' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                <div className='w-4/5 mx-auto text-center space-y-5 flex flex-col justify-start overflow-y-auto max-h-[90%] py-10'>
                    <h2 className='heading-3'>{item.diagram_name} — Summary</h2>
                    <p>{item.resume ? item.resume : "No summary available for this chart."}</p>
                </div>
            </div>
            <h3 className='text-center pt-3 font-bold'>{title}</h3>
            <div className='h-80'>
                {components(item)}
            </div>
        </div>
    </>
  )
}
