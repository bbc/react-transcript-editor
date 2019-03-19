import React from "react";
import PropTypes from "prop-types";

const SttTypeSelect = props => (
  <select name={props.name} value={props.value} onChange={props.handleChange}>
    <option value="bbckaldi">BBC Kaldi</option>
    <option value="draftjs">Draft Js</option>
    <option value="gentle-transcript" disabled>
      Gentle Transcript
    </option>
    <option value="gentle-alignement" disabled>
      Gentle Alignement
    </option>
    <option value="iiif" disabled>
      IIIF
    </option>
    <option value="autoedit2">autoEdit 2</option>
    <option value="ibm" disabled>
      IBM Watson STT
    </option>
    <option value="speechmatics">Speechmatics</option>
    <option value="assemblyai" disabled>
      AssemblyAI
    </option>
    <option value="rev" disabled>
      Rev
    </option>
    <option value="srt" disabled>
      Srt
    </option>
    <option value="vtt" disabled>
      VTT
    </option>
    <option value="vtt-youtube" disabled>
      Youtube VTT
    </option>
    <option value="amazontranscribe">Amazon Transcribe</option>
  </select>
);

SttTypeSelect.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func
};

export default SttTypeSelect;
