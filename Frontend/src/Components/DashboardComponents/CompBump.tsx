import React from 'react'
import { ResponsiveBump } from '@nivo/bump'

export default function CompBump(data:any) {
  return (
    <ResponsiveBump /* or Bump for fixed dimensions */
        data={data.data}
        colors={data.colors}
        lineWidth={3}
        activeLineWidth={6}
        inactiveLineWidth={3}
        inactiveOpacity={0.15}
        pointSize={10}
        activePointSize={16}
        inactivePointSize={0}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={3}
        activePointBorderWidth={3}
        pointBorderColor={{ from: 'serie.color' }}
        axisLeft={{ legend: 'ranking', legendOffset: -40 }}
        margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
    />
  )
}
