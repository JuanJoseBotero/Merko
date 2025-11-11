import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

export default function CompBar( data:any ) {
    console.log(data.data);

    const keys = Object.keys(data.data[0])
    const indexBy = keys[0]
    keys.shift()

    
    
  return (
    <ResponsiveBar /* or Bar for fixed dimensions */
        data={data.data}
        keys={keys}
        indexBy={indexBy}
        labelSkipWidth={12}
        labelTextColor="#ffffff"
        labelSkipHeight={12}
        colors={({ index }) => data.colors[index % data.colors.length]}
        axisBottom={{ legend: "Hola", legendOffset: 35 }}
        axisLeft={{ legend: 'food', legendOffset: -40 }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    />
  )
}
