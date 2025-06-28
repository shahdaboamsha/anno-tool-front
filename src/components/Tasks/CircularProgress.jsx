import { Flat, Heat, Nested } from '@alptugidin/react-circular-progress-bar'
import { useMemo } from 'react'

export default function CircularProgress({progress, total, label}) {

    return (
        <div className='w-30 mb-2'>
            <Flat
                progress={Math.ceil(progress/(total*0.1)*100)}
                range={{ from: 0, to: 100 }}
                sign={{ value: '%', position: 'end' }}
                showMiniCircle={true}
                showValue={true}
                sx={{
                    strokeColor: 'green',
                    barWidth: 3,
                    bgStrokeColor: '#ffffff',
                    bgColor: { value: '#000000', transparency: '20' },
                    shape: 'full',
                    strokeLinecap: 'round',
                    valueSize: 20,
                    valueWeight: 'bold',
                    valueColor: '#000000',
                    valueFamily: 'Trebuchet MS',
                    textSize: 14,
                    textWeight: 'bold',
                    textColor: '#000000',
                    textFamily: 'Trebuchet MS',
                    loadingTime: 1000,
                    miniCircleColor: 'green',
                    miniCircleSize: 5,
                    valueAnimation: true,
                    intersectionEnabled: true
                }}
            />
        </div>
    )
}