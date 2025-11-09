import React from 'react'
import "react-resizable/css/styles.css";
import { useState } from 'react';
import CompLine from './CompLine';
import CompBump from './CompBump';
import CompPie from './CompPie';
import CompRadar from './CompRadar';
import "../../css/dashboard.css"

interface ChartProps {
    diagram_name : string;
    type_of_chart : string;
    chart_data : any;
}

export default function DashboardCard( {id, item, title, colors} : {id: number, item: ChartProps, title: string, colors: any} ) {

    const [isActive, setIsActive] = useState<'Chart' | 'Resume'>('Chart');

    const size = (item : ChartProps) => {
        if (item.type_of_chart === "Line" || item.type_of_chart === "Bump") {
            return 'large';
        } 
        else {
            return 'small';
        }
    }

    const components = (item : ChartProps) => {
        switch(item.type_of_chart) {
            case "Line":
                return <CompLine data={item.chart_data} title={title} colors={colors} className="w-1/2"/>;
            case "Bump":
                return <CompBump key={id} title={title} data={item.chart_data} className="w-1/2"/>;
            case "Pie":
                return <CompPie key={id} title={title} data={item.chart_data} colors={colors} className="w-50"/>;
            case "Radar":
                return <CompRadar key={id} title={title} data={item.chart_data} colors={colors} className="w-1/2"/>;
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
                    <h2 className='heading-3'>IA resume</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mollis erat in eros scelerisque, id maximus justo porta. Quisque sit amet erat tempor, maximus sem sed, mattis felis. Vestibulum ex ex, pulvinar vitae nunc sit amet, porttitor maximus quam. Integer dapibus odio diam, at molestie sapien consequat eget. Fusce lobortis euismod mauris eget pharetra. Sed aliquam velit quis tellus efficitur, ut congue velit luctus. Quisque rutrum sodales neque, at imperdiet dolor.</p>
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
