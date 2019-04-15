import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import Toggle from './Toggle/';
import TimecodeOffset from './TimecodeOffset';

import style from './index.module.css';

class Settings extends React.Component {
  render() {
    return (
      <div className={ style.settings }>
        <h2 className={ style.header }>Settings Panel</h2>
        <div className={ style.closeButton } onClick={ this.props.handleSettingsToggle }>
          <FontAwesomeIcon icon={ faWindowClose } />
        </div>

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
              defaultValue={ this.props.defaultValueScrollSync }
              label={ 'ScrollSync' }
              handleToggle={ this.props.handleIsScrollIntoViewChange }
            />
          </section>

          <section className={ style.settingElement }>
            <div className={ style.label }>Rollback Interval (sec)</div>
            <input
              className={ style.rollbackValue }
              type="number"
              step="1"
              max="60"
              min="1"
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
            <div className={ style.label }>Display Preview</div>
            <Toggle
              defaultValue={ this.props.previewIsDisplayed }
              label={ 'Display Preview' }
              handleToggle={ this.props.handlePreviewIsDisplayed }
            />
          </section>
          {/*
          <section className={ style.settingElement }>
            <div className={ style.label }>Video Preview width</div>
            <input
              className={ style.rollbackValue }
              type="number"
              step="1"
              max="40"
              min="15"
              value={ this.props.previewViewWidth }
              onChange={ this.props.handleChangePreviewViewWidth }
              name="lname"/>
          </section> */}

          <section className={ style.settingElement }>
            <div className={ style.timecodeLabel }>Timecode Offset ℹ</div>
            <TimecodeOffset
              timecodeOffset={ this.props.timecodeOffset }
              handleSetTimecodeOffset={ this.props.handleSetTimecodeOffset }
              handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
            />
          </section>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  showTimecodes: PropTypes.bool,
  showSpeakers: PropTypes.bool,
  timecodeOffset: PropTypes.number,
  handleShowTimecodes: PropTypes.func,
  handleShowSpeakers: PropTypes.func,
  handleSetTimecodeOffset: PropTypes.func,
  handleSettingsToggle: PropTypes.func,
  handlePauseWhileTyping: PropTypes.func,
  handleIsScrollIntoViewChange: PropTypes.func,
  handleRollBackValueInSeconds: PropTypes.func,
  defaultValueScrollSync: PropTypes.bool,
  defaultValuePauseWhileTyping: PropTypes.bool,
  defaultRollBackValueInSeconds: PropTypes.number,
  previewIsDisplayed: PropTypes.bool,
  handlePreviewIsDisplayed: PropTypes.func,
  // previewViewWidth: PropTypes.string,
  handleChangePreviewViewWidth: PropTypes.func,
  handleAnalyticsEvents: PropTypes.func
};

export default Settings;
