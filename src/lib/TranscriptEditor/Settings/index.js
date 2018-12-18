import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import Toggle from './Toggle/index.js';
import style from './index.module.css';

class Settings extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div>
        <span>Settings Panel</span>
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
              label={ 'Hide Timecodes' } 
              handleToggle={ () => {console.log('Hide Timecodes toggle');} }
            />
          </section>
          <section className={ style.settingElement }>
            <label>Hide Speaker Labels</label>
            <Toggle 
              label={ 'Hide Speaker Labels' } 
              handleToggle={ () => {console.log('Hide Speaker Labels toggle');} }
            />
          </section>
          <section className={ style.settingElement }>
            <label>Timecode Offset ℹ </label>
            <input type="text" value="00:00:00:00" name="lname"/>
            <small><u>reset</u></small>
          </section>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {};

export default Settings;
