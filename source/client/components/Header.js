import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { Title, UserInfo } from './';

const HeaderLayout = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 74px;
  background: #fff;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Balance = styled(Title)`
  margin: 0;
`;

const BalanceSum = styled.span`
  font-weight: bold;
`;

const Header = ({ preparedActiveCard, user }) => (
  <HeaderLayout>
    <Balance>
      {`${preparedActiveCard.bankName}: `}
      <BalanceSum>{`${preparedActiveCard.balance} ₽`}</BalanceSum>
    </Balance>
    <UserInfo user={user} />
  </HeaderLayout>
);

Header.propTypes = {
  user: PropTypes.object,
  preparedActiveCard: PropTypes.object.isRequired,
};

export default Header;
