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
              label={ 'Pause while typing' } 
              handleToggle={ () => {console.log('pause whileTyping toggle');} }
            />
          </section>
          <section className={ style.settingElement }>
            <label> Scroll Sync</label>
            <Toggle 
              label={ 'Pause while typing' } 
              handleToggle={ () => {console.log('pause whileTyping toggle');} }
            />
          </section>
          <section className={ style.settingElement }>
            <label>RollBack Interval, seconds</label>
            <input type="text" value={ '15' } name="lname"/>
          </section>
          <section className={ style.settingElement }>
            <label>Timecode Offset ℹ </label>
            <input type="text" value="00:00:00:00" name="lname"/>
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
        </div>
      </div>
    );
  }
}

Settings.propTypes = {};

export default Settings;
