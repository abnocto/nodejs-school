import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';
import { PENDING, FORBIDDEN, ERROR } from '../constants/card';
import { Island, Title } from './';

const PrepaidLayout = styled(Island)`
  width: 350px;
  display: flex;
  flex-direction: column;
  background-color: #353536;
  position: relative;
  color: #fff;
`;

const PrepaidLayoutPending = styled(PrepaidLayout)`
  display: table;
  min-height: 300px;
`;

const PrepaidFailedPaymentLayout = styled(PrepaidLayout)`
  background: #DC143C;
  display: table;
  min-height: 300px;
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  background-image: url(/assets/round-check.svg);
  background-size: contain;
  position: absolute;
  bottom: 125px;
  right: 135px;
`;

const Header = styled(Title)`
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

const Underline = styled.div`
  height: 1px;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.16);
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

const PrepaidResult = ({ user, prepaidStatus, prepaidTransactions, reset }) => {
  const { email } = user;
  const [senderTransaction, receiverTransaction] = prepaidTransactions;
  
  switch (prepaidStatus) {
    case PENDING:
      return (
        <PrepaidLayoutPending>
          <Warning>Обработка запроса...</Warning>
        </PrepaidLayoutPending>
      );
    
    case FORBIDDEN:
      return (
        <PrepaidFailedPaymentLayout>
          <Warning>Ошибка: Недостаточно средств</Warning>
        </PrepaidFailedPaymentLayout>
      );
    
    case ERROR:
      return (
        <PrepaidFailedPaymentLayout>
          <Warning>Ошибка на сервере...</Warning>
        </PrepaidFailedPaymentLayout>
      );
    
    default:
      return (
        <PrepaidLayout>
          <CheckIcon />
          <Header>Операция выполнена</Header>
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
        </PrepaidLayout>
      );
  }
};

PrepaidResult.propTypes = {
  user: PropTypes.object.isRequired,
  prepaidStatus: PropTypes.string.isRequired,
  prepaidTransactions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
};

export default PrepaidResult;
