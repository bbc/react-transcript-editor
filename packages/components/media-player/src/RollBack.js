import React from 'react';
import PropTypes from 'prop-types';
import styles from './RollBack.module.css';
class RollBack extends React.Component {

  render() {
    return (
      <div>
        <p className={ styles.helpText }>Rollback
          <output className={ styles.rollBackValue }>{ ` x${ this.props.rollBackValueInSeconds } ` }</output> Seconds
        </p>

        <input
          type="range"
          min="1"
          max="60"
          step="1"
          value={ this.props.rollBackValueInSeconds }
          onChange={ this.props.handleChangeReplayRollbackValue }
        />
        <br/>
        <button type="button" onClick={ this.props.rollBack }>↺</button>

      </div>
    );
  }
}

RollBack.propTypes = {
  rollBackValueInSeconds: PropTypes.number,
  handleChangeReplayRollbackValue: PropTypes.func,
  rollBack: PropTypes.func
};

export default RollBack;
