import React from 'react';
import PropTypes from 'prop-types';

import Toggle from './Toggle/';

import style from './index.module.css';

import TimecodeOffset from './TimecodeOffset';

class Settings extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className={ style.settings }>
        <span>Settings Panel</span>
        <span onClick={ this.props.handleSettingsToggle }>X</span>
        <div className={ style.controlsContainer }>
          <section className={ style.settingElement }>
            <label>Pause While Typing</label>
            <Toggle
              defaultValue={ this.props.defaultValuePauseWhileTyping }
              label={ 'Pause while typing' }
              handleToggle={ this.props.handlePauseWhileTyping }
            />
          </section>
          <section className={ style.settingElement }>
            <label> Scroll Sync</label>
            <Toggle
              defaultValue={ this.props.defaultvalueScrollSync }
              label={ 'ScrollSync' }
              handleToggle={ this.props.handleIsScrollIntoViewChange }
            />
          </section>
          <section className={ style.settingElement }>
            <label>RollBack Interval, seconds</label>
            <input
              type="text"
              value={ this.props.defaultRollBackValueInSeconds }
              onChange={ this.props.handleRollBackValueInSeconds }
              name="lname"/>
            {/* <input type="range" value="15" min="1" max="60" step="1"/> */}
          </section>
          <section className={ style.settingElement }>
            <label>Hide Timecodes</label>
            <Toggle
              defaultValue={ this.props.showTimecodes }
              label={ 'Hide Timecodes' }
              handleToggle={ this.props.handleShowTimecodes }
            />
          </section>
          <section className={ style.settingElement }>
            <label>Hide Speaker Labels</label>
            <Toggle
              defaultValue={ this.props.showSpeakers }
              label={ 'Hide Speaker Labels' }
              handleToggle={ this.props.handleShowSpeakers }
            />
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
