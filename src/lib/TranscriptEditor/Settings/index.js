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
            <div className={ style.label }>Pause While Typing</div>
            <Toggle
              defaultValue={ this.props.defaultValuePauseWhileTyping }
              label={ 'Pause while typing' }
              handleToggle={ this.props.handlePauseWhileTyping }
            />
          </section>

          <section className={ style.settingElement }>
            <div className={ style.label }>Scroll Sync</div>
            <Toggle
              defaultValue={ this.props.defaultvalueScrollSync }
              label={ 'ScrollSync' }
              handleToggle={ this.props.handleIsScrollIntoViewChange }
            />
          </section>

          <section className={ style.settingElement }>
            <div className={ style.label }>Rollback Interval (sec)</div>
            <input
              className={ style.rollbackValue }
              type="text"
              value={ this.props.defaultRollBackValueInSeconds }
              onChange={ this.props.handleRollBackValueInSeconds }
              name="lname"/>
          </section>

          <section className={ style.settingElement }>
            <div className={ style.label }>Show Timecodes</div>
            <Toggle
              defaultValue={ this.props.showTimecodes }
              label={ 'Hide Timecodes' }
              handleToggle={ this.props.handleShowTimecodes }
            />
          </section>

          <section className={ style.settingElement }>
            <div className={ style.label }>Show Speaker Labels</div>
            <Toggle
              defaultValue={ this.props.showSpeakers }
              label={ 'Hide Speaker Labels' }
              handleToggle={ this.props.handleShowSpeakers }
            />
          </section>

          <section className={ style.settingElement }>
            <div className={ style.timecodeLabel }>Timecode Offset ℹ</div>
            <TimecodeOffset
              timecodeOffset={ this.props.timecodeOffset }
              handleSetTimecodeOffset={ this.props.handleSetTimecodeOffset }
            />
          </section>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {};

export default Settings;
