import React from 'react';

import returnHotKeys from '../MediaPlayer/defaultHotKeys';

import style from './Shortcuts.module.css';

class Shortcuts extends React.Component {
  render() {
    const hotKeys = returnHotKeys(this);
    const hotKeysCheatsheet = Object.keys(hotKeys).map((key, i) => {
    	const shortcut = hotKeys[key];

      return <li key={ i } className={ style.listItem }>
        <div className={ style.shortcut }>{key}</div>
        <div className={ style.shortcutLabel }>{shortcut.label}</div>
      </li>;
    });

    return (
      <div className={ style.shortcuts }>
        <div className={ style.header }>ℹ Keyboard Shortcuts Help</div>
        <ul className={ style.list }>{ hotKeysCheatsheet }</ul>
      </div>
    );
  }
}

export default Shortcuts;
