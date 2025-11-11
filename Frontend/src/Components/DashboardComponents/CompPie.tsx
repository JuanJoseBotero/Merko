import React from 'react'
import { ResponsivePie } from '@nivo/pie'

export default function CompPie( data:any ) {
  
  return (
    <ResponsivePie
      data={data.data}
      margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
      innerRadius={0.5}
      padAngle={0.6}
      cornerRadius={2}
      colors={data.colors}
      activeOuterRadiusOffset={8}
      enableArcLinkLabels={false}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          translateX: 100,
          itemWidth: 100,
          itemHeight: 18,
          symbolShape: 'circle'
        }
      ]}
      theme={{
        labels: { text: { fill: '#fff' } },
        legends: { text: { fill: '#333' } }
      }}
    />
  )
}
