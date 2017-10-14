import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { MOBILE_PAYMENT_COMISSION } from '../constants/util';
import { getValidSum } from '../service/contractService';
import { Island, Title, Button, Input } from './';

const MobilePaymentLayout = styled(Island)`
  width: 440px;
  background: #108051;
`;

const MobilePaymentTitle = styled(Title)`
  color: #fff;
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  position: relative;
  padding-left: 150px;
`;

const Label = styled.div`
  font-size: 15px;
  color: #fff;
  position: absolute;
  left: 0;
`;

const Currency = styled.span`
  font-size: 13px;
  color: #fff;
  margin-left: 12px;
`;

const Commission = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  text-align: right;
  margin: 35px 0 20px;
`;

const Underline = styled.div`
  height: 1px;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.16);
`;

const PaymentButton = styled(Button)`
  float: right;
`;

const InputPhoneNumber = styled(Input)`
  width: 225px;
`;

const InputSum = styled(Input)`
  width: 160px;
`;

const InputCommision = styled(Input)`
  cursor: no-drop;
  width: 160px;
  border: dotted 1.5px rgba(0, 0, 0, 0.2);
  background-color: initial;
`;

class MobilePaymentContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sum: 0,
      commission: Number(MOBILE_PAYMENT_COMISSION),
    };
  }
  
  /**
   * @returns {Number}
   */
  getSumWithCommission() {
    const { sum, commission } = this.state;
    return sum > 0 ? sum + commission : 0;
  }
  
  /**
   * @returns {Number}
   */
  getMaxAllowedSum() {
    const { commission } = this.state;
    const { balance } = this.props.preparedActiveCard;
    return balance - commission;
  }
  
  /**
   * @param {Event} event
   */
  handleSubmit(event) {
    if (event) event.preventDefault();
    const sum = this.getSumWithCommission();
    if (sum < 1) return;
    const { id } = this.props.preparedActiveCard;
    const { phoneNumber } = this.props.user;
    const transaction = {
      sum,
      data: phoneNumber,
    };
    this.props.pay(id, transaction);
  }
  
  /**
   * @param {Event} event
   */
  handleSumChange(event) {
    if (!event) return;
    const maxAllowedSum = this.getMaxAllowedSum();
    this.setState({
      sum: getValidSum(event.target.value, maxAllowedSum),
    });
  }
  
  render() {
    const { sum, commission } = this.state;
    const { phoneNumber } = this.props.user;
    
    if (!phoneNumber) {
      return (
        <MobilePaymentLayout>
          <MobilePaymentTitle>Укажите в «Настройках» номер телефона для возможности оплаты!</MobilePaymentTitle>
        </MobilePaymentLayout>
      );
    }
    
    return (
      <MobilePaymentLayout>
        <form onSubmit={event => this.handleSubmit(event)}>
          <MobilePaymentTitle>Пополнить телефон</MobilePaymentTitle>
          <InputField>
            <Label>Телефон</Label>
            <InputPhoneNumber
              name='phoneNumber'
              value={phoneNumber}
              readOnly='true'
            />
          </InputField>
          <InputField>
            <Label>Сумма</Label>
            <InputSum
              name='sum'
              value={sum}
              onChange={event => this.handleSumChange(event)}
            />
            <Currency>₽</Currency>
          </InputField>
          <InputField>
            <Label>Спишется</Label>
            <InputCommision value={this.getSumWithCommission()} />
            <Currency>₽</Currency>
          </InputField>
          <Commission>Размер коммиссии составляет {commission} ₽</Commission>
          <Underline />
          <PaymentButton
            bgColor='#fff'
            textColor='#108051'
          >
            Заплатить
          </PaymentButton>
        </form>
      </MobilePaymentLayout>
    );
  }
}

MobilePaymentContract.propTypes = {
  user: PropTypes.object.isRequired,
  preparedActiveCard: PropTypes.object.isRequired,
  pay: PropTypes.func.isRequired,
};

export default MobilePaymentContract;
