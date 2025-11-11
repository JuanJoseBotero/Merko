import { ResponsiveRadar } from '@nivo/radar'

export default function CompRadar(data:any) {

  const keys = Object.keys(data.data[0]);

  const indexBy = keys[0];
  
  keys.shift();


  
  return (
    <ResponsiveRadar /* or Radar for fixed dimensions */
        data={data.data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        gridLabelOffset={36}
        dotSize={10}
        colors={data.colors}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
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
