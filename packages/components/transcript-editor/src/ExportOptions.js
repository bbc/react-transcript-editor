import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import style from './index.module.css';

class ExportOptions extends React.Component {

  render() {
    const btns = this.props.exportOptionsList.map((opt, index) => {
      return (<><button 
        key={opt.label+index}
        title={ opt.label }
        className={ style.playerButton }
        key={ opt.value }
        onClick={ this.props.handleExportOptionsChange }
        value={ opt.value }>
        {opt.label}
      </button>
        <br/>
      </>);
    });

    return (
      <div className={ style.settings }>
        <h2 className={ style.header }>Export Options</h2>
        <div className={ style.closeButton }
          onClick={ this.props.handleExportToggle }
        >
          <FontAwesomeIcon icon={ faWindowClose } />
        </div>

        <div className={ style.controlsContainer }>
          {btns}
        </div>
      </div>
    );
  }
}

ExportOptions.propTypes = {
  handleExportToggle: PropTypes.func
//   showTimecodes: PropTypes.bool,
//   showSpeakers: PropTypes.bool,
//   timecodeOffset: PropTypes.number,
//   handleShowTimecodes: PropTypes.func,
//   handleShowSpeakers: PropTypes.func,
//   handleSetTimecodeOffset: PropTypes.func,
//   handleSettingsToggle: PropTypes.func,
//   handlePauseWhileTyping: PropTypes.func,
//   handleIsScrollIntoViewChange: PropTypes.func,
//   handleRollBackValueInSeconds: PropTypes.func,
//   defaultValueScrollSync: PropTypes.bool,
//   defaultValuePauseWhileTyping: PropTypes.bool,
//   defaultRollBackValueInSeconds: PropTypes.number,
//   previewIsDisplayed: PropTypes.bool,
//   handlePreviewIsDisplayed: PropTypes.func,
//   // previewViewWidth: PropTypes.string,
//   handleChangePreviewViewWidth: PropTypes.func,
//   handleAnalyticsEvents: PropTypes.func
};

export default ExportOptions;
