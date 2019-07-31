import React from 'react';
import PropTypes from 'prop-types';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import returnHotKeys from './hot-keys';

import style from './index.module.css';

export const getHotKeys = returnHotKeys;

class KeyboardShortcuts extends React.Component {
  render() {
    const hotKeys = returnHotKeys(this);

    const hotKeysCheatsheet = Object.keys(hotKeys).map(key => {
      const shortcut = hotKeys[key];

      return (
        <li key={ key } className={ style.listItem }>
          <div className={ style.shortcut }>{shortcut.displayKeyCombination}</div>
          <div className={ style.shortcutLabel }>{shortcut.label}</div>
        </li>
      );
    });

    return (
      <div className={ style.shortcuts }>
        <h2 className={ style.header }>Shortcuts</h2>
        <div
          className={ style.closeButton }
          onClick={ this.props.handleShortcutsToggle }>
          <FontAwesomeIcon icon={ faWindowClose } />
        </div>
        <ul className={ style.list }>{hotKeysCheatsheet}</ul>
      </div>
    );
  }
}

KeyboardShortcuts.propTypes = {
  handleShortcutsToggle: PropTypes.func
};

export default KeyboardShortcuts;
