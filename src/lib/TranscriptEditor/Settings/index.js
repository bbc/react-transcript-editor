import React from 'react';
import PropTypes from 'prop-types';

import style from './index.module.css';

class Settings extends React.Component {
  render() {
    return (
      <div className={ style.settings }>
        <span>Settings Panel</span>
      </div>
    );
  }
}

Settings.propTypes = {};

export default Settings;
