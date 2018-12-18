import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

import style from './index.module.css';

class Settings extends React.Component {
  render() {
    return (
      <div>
        <span>Settings Panel</span>
        <div className={ style.controlsContainer }>
          <label className={ style.settingElement }>Pause While Typing</label>
          <label className={ style.settingElement }>Scroll Sync</label>
          <label className={ style.settingElement }>RollBack Interval, seconds</label>
          <label className={ style.settingElement }>Timecode Offset</label>
        </div>
        
      </div>
    );
  }
}

Settings.propTypes = {};

export default Settings;
