import React from 'react'
import { ResponsiveRadar } from '@nivo/radar'

export default function CompRadar(data:any) {
  return (
    <ResponsiveRadar /* or Radar for fixed dimensions */
        data={data.data}
        keys={['chardonay', 'carmenere', 'syrah']}
        indexBy="taste"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={data.colors}
        blendMode="multiply"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                symbolShape: 'circle'
            }
        ]}
    />
  )
}
