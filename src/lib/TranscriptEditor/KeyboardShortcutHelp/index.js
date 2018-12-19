import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
// import Toggle from './Toggle/index.js';
import style from './index.module.css';
// import TimecodeOffset from './TimecodeOffset/index.js';

import returnHotKeys from '../MediaPlayer/defaultHotKeys';

class KeyboardShortcutHelp extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    const hotKeys = returnHotKeys(this);
    const hotKeysCheatsheet = Object.keys(hotKeys).map((key,index ) => { 
    	const value = hotKeys[key];

      return <li key={ index } className={ style.settingElement }><mark><code>{key}</code></mark> {value.helperText}</li>;
    });
    
    return (
      <div>
        <span>ℹ Keyboard Shortcuts Help</span>
        <br/>
        <ul style={ { listStyle: 'none' } }>
          {hotKeysCheatsheet}
        </ul>
      </div>
    );
  }
}

KeyboardShortcutHelp.propTypes = {};

export default KeyboardShortcutHelp;
