import React, { useState } from 'react';
import Creatable from 'react-select/creatable';

function SpeakersSelect() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  

  return (
    <>
        <Creatable 
    options={options} 
    onCreateOption={(e)=>{console.log('created',e)}}
    isClearable
    onChange={(e)=>{console.log('onChange',e)}}
    onInputChange={(e)=>{ console.log('onInputChange',e)}}
    />
    </>
  );
}

export default SpeakersSelect;