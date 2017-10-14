import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';
import { PENDING, FORBIDDEN, ERROR } from '../constants/card';
import { MOBILE_PAYMENT_COMISSION } from '../constants/util';
import { Island } from './';

const MobilePaymentLayout = styled(Island)`
  width: 440px;
  background: #108051;
  position: relative;
  color: #fff;
`;

const MobileFailedPaymentLayout = styled(MobilePaymentLayout)`
  background: #DC143C;
  display: table;
  min-height: 300px;
`;

const SuccessIcon = styled.div`
  width: 48px;
  height: 48px;
  background-image: url(/assets/round-check.svg);
  position: absolute;
  top: 27;
  right: 32;
`;

const Header = styled.div`
  font-size: 24px;
`;

const Sum = styled.div`
  font-size: 48px;
`;

const CommissionTips = styled.div`
  font-size: 13px;
  opacity: 0.6;
  margin-bottom: 20px;
`;

const Section = styled.div`
  position: relative;
  padding-left: 160px;
  margin-bottom: 20px;
`;

const SectionLabel = styled.div`
  font-size: 15px;
  position: absolute;
  left: 0px;
`;

const SectionValue = styled.div`
  font-size: 15px;
`;

const Instruction = styled.div`
  margin-bottom: 40px;
  font-size: 15px;
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

const MobilePaymentResult = ({ user, modeStatus, modeTransactions, reset }) => {
  const commission = Number(MOBILE_PAYMENT_COMISSION);
  const { email } = user;
  const [senderTransaction] = modeTransactions;
  
  switch (modeStatus) {
    case PENDING: return (
      <MobilePaymentLayout>
        <Warning>Обработка запроса...</Warning>
      </MobilePaymentLayout>
    );
    
    case FORBIDDEN: return (
      <MobileFailedPaymentLayout>
        <Warning>Ошибка: Недостаточно средств</Warning>
      </MobileFailedPaymentLayout>
    );
    
    case ERROR: return (
      <MobileFailedPaymentLayout>
        <Warning>Ошибка на сервере...</Warning>
      </MobileFailedPaymentLayout>
    );
    
    default: return (
      <MobilePaymentLayout>
        <SuccessIcon />
        <Header>МегаФон (Россия)</Header>
        <Sum>{Math.abs(senderTransaction.sum)} ₽</Sum>
        <CommissionTips>В том числе комиссия {commission} ₽</CommissionTips>
        <Section>
          <SectionLabel>Ид транзакции</SectionLabel>
          <SectionValue>{senderTransaction.id}</SectionValue>
        </Section>
        <Section>
          <SectionLabel>Номер телефона</SectionLabel>
          <SectionValue>{senderTransaction.data}</SectionValue>
        </Section>
        { email
          ? (
            <Instruction>
              Мы пришлем чек на {email}. Вы можете изменить email в «Настройках».
            </Instruction>
          )
          : (
            <Instruction>
            Для получения данных транзакции укажите email в «Настройках».
            </Instruction>
          )
        }
        <RepeatPayment onClick={() => reset()}>Отправить еще один перевод</RepeatPayment>
      </MobilePaymentLayout>
    );
  }
};

MobilePaymentResult.propTypes = {
  user: PropTypes.object.isRequired,
  modeStatus: PropTypes.string.isRequired,
  modeTransactions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
};

export default MobilePaymentResult;
