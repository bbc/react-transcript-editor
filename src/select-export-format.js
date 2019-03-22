import React from 'react';
import PropTypes from 'prop-types';

const ExportFormatSelect = props => (<select name={ props.name } value={ props.value } onChange={ props.handleChange }>
  <option value="draftjs">Draft Js</option>
  <option value="txt">Text file</option>
  <option value="docx">MS Word</option>
  <option value="html" disabled>HTML</option>
</select>);

ExportFormatSelect.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func
};

export default ExportFormatSelect;
