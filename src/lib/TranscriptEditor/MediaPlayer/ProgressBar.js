import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';
class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }
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

export default ProgressBar;