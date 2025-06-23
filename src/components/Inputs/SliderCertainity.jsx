import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


const marks = []
for (let i = 0; i <= 100; i += 10) {
  marks.push({
    value: i,
    label: `${i}`
  })
}

function valuetext(value) {
  return `${value}`;
}


export default function SliderCertainity({ certainity, setCertainity }) {
  return (
    <div className='p-5'>
      <Slider
        color='success'
        aria-label="Restricted values"
        defaultValue={certainity}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
        onChange={(e) => setCertainity(e.target.value)}
      />
    </div>
  );
}
