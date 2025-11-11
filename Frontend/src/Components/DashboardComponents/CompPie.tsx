import React from 'react'
import { ResponsivePie } from '@nivo/pie'

export default function CompPie( data:any ) {
  
  return (
    <ResponsivePie /* or Pie for fixed dimensions */
        data={data.data}
        margin={{ top: 40, right: -50, bottom: 40, left:20 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        colors={data.colors}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        legends={[
            {
                anchor: 'left',
                direction: 'column',
                translateX: 0,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 18,
                symbolShape: 'circle'
            }
        ]}
    />
  )
}
