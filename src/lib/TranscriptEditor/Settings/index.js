import React from 'react';
import PropTypes from 'prop-types';

import Toggle from './Toggle/';

import style from './index.module.css';

import TimecodeOffset from './TimecodeOffset';

class Settings extends React.Component {
  render() {
    return (
      <div className={ style.settings }>
        <h2 className={ style.header }>Settings Panel</h2>
        <div className={ style.closeButton } onClick={ this.props.handleSettingsToggle }>X</div>

        <div className={ style.controlsContainer }>
          <section className={ style.settingElement }>
            <Toggle
              defaultValue={ this.props.defaultValuePauseWhileTyping }
              label={ 'Pause while typing' }
              handleToggle={ this.props.handlePauseWhileTyping }
            />
            <label>Pause While Typing</label>
          </section>

          <section className={ style.settingElement }>
            <Toggle
              defaultValue={ this.props.defaultvalueScrollSync }
              label={ 'ScrollSync' }
              handleToggle={ this.props.handleIsScrollIntoViewChange }
            />
            <label>Scroll Sync</label>
          </section>

          <section className={ style.settingElement }>
            <input
              className={ style.rollbackValue }
              type="text"
              value={ this.props.defaultRollBackValueInSeconds }
              onChange={ this.props.handleRollBackValueInSeconds }
              name="lname"/>
            <label>RollBack Interval, seconds</label>
          </section>

          <section className={ style.settingElement }>
            <Toggle
              defaultValue={ this.props.showTimecodes }
              label={ 'Hide Timecodes' }
              handleToggle={ this.props.handleShowTimecodes }
            />
            <label>Show Timecodes</label>
          </section>

          <section className={ style.settingElement }>
            <Toggle
              defaultValue={ this.props.showSpeakers }
              label={ 'Hide Speaker Labels' }
              handleToggle={ this.props.handleShowSpeakers }
            />
            <label>Show Speaker Labels</label>
          </section>

          <TimecodeOffset
            timecodeOffset={ this.props.timecodeOffset }
            handleSetTimecodeOffset={ this.props.handleSetTimecodeOffset }
          />
        </div>
      </div>
    );
  }
}

Settings.propTypes = {};

export default Settings;
