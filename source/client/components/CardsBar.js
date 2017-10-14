import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { Card } from './';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #242424;
  padding: 20px;
`;

const Logo = styled.div`
  width: 147px;
  height: 28px;
  margin-bottom: 55px;
  background-image: url('/assets/yamoney-logo.svg');
`;

const Edit = styled.div`
  position: absolute;
  top: 25px;
  right: 20px;
  width: 18px;
  height: 18px;
  background-image: url('/assets/cards-edit.svg');
`;

const CardsList = styled.div`
  flex: 1;
`;

const Footer = styled.footer`
  color: rgba(255, 255, 255, 0.2);
  font-size: 15px;
`;

const CardsBar = ({ preparedActiveCard, preparedCardsList, onCardChange }) => (
  <Layout>
    <Logo />
    <Edit />
    <CardsList>
      {
        preparedCardsList.map(preparedCard => (
          <Card
            key={preparedCard.id}
            data={preparedCard}
            isActive={preparedCard.id === preparedActiveCard.id}
            onClick={() => onCardChange(preparedCard.id)}
          />
        ))
      }
      <Card type='new' />
    </CardsList>
    <Footer>Yamoney Node School</Footer>
  </Layout>
);

CardsBar.propTypes = {
  preparedActiveCard: PropTypes.object.isRequired,
  preparedCardsList: PropTypes.array.isRequired,
  onCardChange: PropTypes.func.isRequired,
};

export default CardsBar;
