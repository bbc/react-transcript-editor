import React from 'react';
import PropTypes from 'prop-types';

const ExportFormatSelect = props => {
  return <select className={ props.className } name={ props.name } value={ props.value } onChange={ props.handleChange }>
    <option value="draftjs">Draft Js</option>
    <option value="txt">Text file</option>
    <option value="txtspeakertimecodes">Text file - with Speakers and Timecodes</option>
    <option value="html" disabled>HTML</option>
    <option value="word" disabled>MS Word</option>
    <option value="digitalpaperedit">Digital Paper Edit</option>
  </select>;
};

ExportFormatSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func
};

export default ExportFormatSelect;
