import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';
import { PENDING, FORBIDDEN, ERROR } from '../constants/card';
import { Island, Title } from './';

const WithdrawLayout = styled(Island)`
  width: 440px;
  background: #108051;
  position: relative;
  color: #fff;
`;

const WithdrawLayoutPending = styled(WithdrawLayout)`
  display: table;
  min-height: 300px;
`;

const WithdrawFailedPaymentLayout = styled(WithdrawLayout)`
  background: #DC143C;
  display: table;
  min-height: 300px;
`;

const WithdrawTitle = styled(Title)`
  text-align: center;
  color: #fff;
`;

const Section = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const SectionLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const SectionValue = styled.div`
  font-size: 15px;
`;

const Instruction = styled.div`
  margin-bottom: 40px;
  font-size: 15px;
  text-align: center;
`;

const RepeatPayment = styled.button`
  font-size: 13px;
  background-color: rgba(0, 0, 0, 0.08);
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  cursor: pointer;
  text-transform: uppercase;
`;

const Warning = styled.div`
  font-size: 25px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`;

const Underline = styled.div`
  height: 1px;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.16);
`;

const WithdrawResult = ({ user, withdrawStatus, withdrawTransactions, reset }) => {
  const { email } = user;
  const [senderTransaction, receiverTransaction] = withdrawTransactions;
  
  switch (withdrawStatus) {
    case PENDING:
      return (
        <WithdrawLayoutPending>
          <Warning>Обработка запроса...</Warning>
        </WithdrawLayoutPending>
      );
    
    case FORBIDDEN:
      return (
        <WithdrawFailedPaymentLayout>
          <Warning>Ошибка: Недостаточно средств</Warning>
        </WithdrawFailedPaymentLayout>
      );
    
    case ERROR:
      return (
        <WithdrawFailedPaymentLayout>
          <Warning>Ошибка на сервере...</Warning>
        </WithdrawFailedPaymentLayout>
      );
    
    default:
      return (
        <WithdrawLayout>
          <WithdrawTitle>Операция выполнена</WithdrawTitle>
          <Section>
            <SectionLabel>Данные транзакции отправителя:</SectionLabel>
            <SectionValue>{`Ид: ${senderTransaction.id}, Карта: ${senderTransaction.data}, Сумма: ${senderTransaction.sum}`}</SectionValue>
          </Section>
          <Section>
            <SectionLabel>Данные транзакции получателя:</SectionLabel>
            <SectionValue>{`Ид: ${receiverTransaction.id}, Карта: ${receiverTransaction.data}, Сумма: ${receiverTransaction.sum}`}</SectionValue>
          </Section>
          <Underline />
          {email
            ? (
              <Instruction>
                Данные транзакций отправлены на {email}. Вы можете изменить email в «Настройках».
              </Instruction>
            )
            : (
              <Instruction>
                Для получения данных транзакций укажите email в «Настройках».
              </Instruction>
            )
          }
          <RepeatPayment onClick={() => reset()}>Вернуться к оплате</RepeatPayment>
        </WithdrawLayout>
      );
  }
};

WithdrawResult.propTypes = {
  user: PropTypes.object.isRequired,
  withdrawStatus: PropTypes.string.isRequired,
  withdrawTransactions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
};

export default WithdrawResult;
