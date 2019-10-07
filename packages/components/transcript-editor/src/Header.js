import React from 'react';
import {
  faCog,
  faKeyboard,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from '../index.module.css';

class Header extends React.Component {

  // to avoid unnecessary re-renders
  shouldComponentUpdate(nextProps) {
    if (nextProps !== this.props) return true;

    return false;
  }
  render() {
    const props = this.props;

    return (<>
      <header className={ style.header }>
        {props.showSettings ? props.settings : null}
        {props.showShortcuts ? props.shortcuts : null}
        {props.showExportOptions ? props.exportOptions : null}
        {props.tooltip}
      </header>
      <nav className={ style.nav }>
        {props.mediaUrl === null ? null : props.mediaControls}
      </nav>

      <div className={ style.settingsContainer }>
        <button
          className={ style.settingsButton }
          title="Settings"
          onClick={ props.handleSettingsToggle }
        >
          <FontAwesomeIcon icon={ faCog } />
        </button>
        <button
          className={ `${ style.settingsButton } ${ style.keyboardShortcutsButon }` }
          title="view shortcuts"
          onClick={ props.handleShortcutsToggle }
        >
          <FontAwesomeIcon icon={ faKeyboard } />
        </button>
        <button
          className={ `${ style.settingsButton }` }
          title="Export"
          onClick={ props.handleExportToggle }
        >
          <FontAwesomeIcon icon={ faShare } />
        </button>
      </div>
    </>);
  };
}

export default Header;
