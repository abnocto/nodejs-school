import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { getValidSum } from '../service/contractService';
import { Card, Title, Button, Island, Input } from './';

const WithdrawTitle = styled(Title)`
  text-align: center;
`;

const WithdrawLayout = styled(Island)`
  width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputField = styled.div`
  margin: 20px 0;
  position: relative;
`;

const SumInput = styled(Input)`
  max-width: 200px;
  padding-right: 20px;
  background-color: rgba(0, 0, 0, 0.08);
  color: '#000';
`;

const Currency = styled.span`
  font-size: 12px;
  position: absolute;
  right: 10;
  top: 8px;
`;

class WithdrawContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sum: 0,
    };
  }
  
  /**
   * @param {Event} event
   */
  handleSumChange(event) {
    if (!event) return;
    this.setState({
      sum: getValidSum(event.target.value, this.props.preparedActiveCard.balance),
    });
  }
  
  /**
   * @param {Event} event
   */
  handleSubmit(event) {
    if (event) event.preventDefault();
    const { sum } = this.state;
    if (sum < 1) return;
    const { id } = this.props.preparedActiveCard;
    const data = {
      receiverCardId: this.props.preparedWithdrawCard.id,
      sum,
    };
    this.props.transfer(id, data);
  }
  
  /**
   * Функция отрисовки компонента
   * @returns {JSX}
   */
  render() {
    const { preparedInactiveCardsList, preparedWithdrawCard, onCardChange } = this.props;
    
    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <WithdrawLayout>
          <WithdrawTitle>Вывести деньги на карту</WithdrawTitle>
          <Card
            type='select'
            data={preparedInactiveCardsList}
            preparedWithdrawCard={preparedWithdrawCard}
            onWithdrawCardSelect={id => onCardChange(id)}
          />
          <InputField>
            <SumInput
              name='sum'
              value={this.state.sum}
              onChange={event => this.handleSumChange(event)}
            />
            <Currency>₽</Currency>
          </InputField>
          <Button type='submit'>Перевести</Button>
        </WithdrawLayout>
      </form>
    );
  }
}

WithdrawContract.propTypes = {
  preparedActiveCard: PropTypes.object.isRequired,
  preparedWithdrawCard: PropTypes.object.isRequired,
  preparedInactiveCardsList: PropTypes.array.isRequired,
  transfer: PropTypes.func.isRequired,
  onCardChange: PropTypes.func.isRequired,
};

export default WithdrawContract;
