import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';
class ProgressBar extends React.Component {

    render() {
        return (
          <progress
            className={ styles.progressBar }
            max={ this.props.max }
            value= { this.props.value }
            onClick={ (e) => this.props.buttonClick(e) }
            />
        );
    }
}

ProgressBar.propTypes = {
    value: PropTypes.number,
    max: PropTypes.number,
    buttonClick: PropTypes.func
  };

export default ProgressBar;
