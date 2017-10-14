import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

const User = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #000;
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = ({ user }) => (
  <User>
    <Avatar src='/assets/avatar.png' />
    {user.name}
  </User>
);

UserInfo.propTypes = {
  user: PropTypes.object,
};

export default UserInfo;
