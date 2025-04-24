import { Flat, Heat, Nested } from '@alptugidin/react-circular-progress-bar'

export default function CircularProgress({progress, total, label}) {

    return (
        <div className='w-30 mb-2'>
            <Flat
                progress={((progress/total)*100).toFixed(2)}
                range={{ from: 0, to: 100 }}
                sign={{ value: '%', position: 'end' }}
                showMiniCircle={true}
                showValue={true}
                sx={{
                    strokeColor: 'blue',
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
                    miniCircleColor: 'blue',
                    miniCircleSize: 5,
                    valueAnimation: true,
                    intersectionEnabled: true
                }}
            />
        </div>
    )
}