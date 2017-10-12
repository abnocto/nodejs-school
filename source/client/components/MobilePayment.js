import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MobilePaymentContract from './MobilePaymentContract';
import MobilePaymentResult from './MobilePaymentResult';
import * as cardActions from '../actions/card';

/**
 * Класс компонента MobilePayment
 */
class MobilePayment extends Component {
  repeatPayment() {
    this.props.reset();
  }
  
  /**
   * Рендер компонента
   *
   * @override
   * @returns {JSX}
   */
  render() {
    const { activeCard, card, transaction } = this.props;
    
    if (card.payMode) {
      return (
        <MobilePaymentResult
          card={card}
          transaction={transaction}
          repeatPayment={() => this.repeatPayment()}
        />
      );
    }
    
    return (
      <MobilePaymentContract
        activeCard={activeCard}
        pay={this.props.pay}
      />
    );
  }
}

MobilePayment.propTypes = {
  activeCard: PropTypes.shape({
    id: PropTypes.number,
    theme: PropTypes.object,
  }).isRequired,
};

export default connect(
  state => ({
    card: state.card,
    transaction: state.transaction,
  }),
  dispatch => bindActionCreators(cardActions, dispatch),
)(MobilePayment);
