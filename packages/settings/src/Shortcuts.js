import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import returnHotKeys from '../MediaPlayer/defaultHotKeys';

import style from './Shortcuts.module.css';

class Shortcuts extends React.Component {
  render() {
    const hotKeys = returnHotKeys(this);
    const hotKeysCheatsheet = Object.keys(hotKeys).map((key) => {
    	const shortcut = hotKeys[key];

      return <li key={ key } className={ style.listItem }>
        <div className={ style.shortcut }>{shortcut.displayKeyCombination}</div>
        <div className={ style.shortcutLabel }>{shortcut.label}</div>
      </li>;
    });

    return (
      <div className={ style.shortcuts }>
        <h2 className={ style.header }>Shortcuts</h2>
        <div className={ style.closeButton } onClick={ this.props.handleShortcutsToggle }>
          <FontAwesomeIcon icon={ faWindowClose } />
        </div>
        <ul className={ style.list }>{ hotKeysCheatsheet }</ul>
      </div>
    );
  }
}

Shortcuts.propTypes = {
  handleShortcutsToggle: PropTypes.func
};

export default Shortcuts;
