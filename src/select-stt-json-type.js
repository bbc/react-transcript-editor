import React from 'react';
const SttTypeSelect = (props) => (<select name={ props.name } value={ props.value } onChange={ props.handleChange }>
    <option value="bbckaldi">BBC Kaldi</option>
    <option value="draftjs" disabled>Draft Js</option>
    <option value="gentle-transcript" disabled>Gentle Transcript</option>
    <option value="gentle-alignement" disabled>Gentle Alignement</option>
    <option value="iiif" disabled>IIIF</option>
    <option value="autoedit2">autoEdit 2</option>
    <option value="ibm" disabled>IBM Watson STT</option>
    <option value="speechmatics" disabled>Speechmatics</option>
    <option value="assemblyai" disabled>AssemblyAI</option>
    <option value="rev" disabled>Rev</option>
    <option value="srt" disabled>Srt</option>
    <option value="vtt" disabled>VTT</option>
    <option value="vtt-youtube" disabled>Youtube VTT</option>
</select>)

export default SttTypeSelect;