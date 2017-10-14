import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { Select } from './';

const CardLayout = styled.div`
  position: relative;
  width: 260px;
  height: 164px;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding: 25px 20px 20px 25px;
  border-radius: 4px;
  background-color: ${({ bgColor, active }) => active ? bgColor : 'rgba(255, 255, 255, 0.1)'};
`;

const CardLogo = styled.div`
  height: 28px;
  margin-bottom: 25px;
  background-image: url(${({ url }) => url});
  background-size: contain;
  background-repeat: no-repeat;
  filter: ${({ active }) => active ? 'none' : 'grayscale(100%) opacity(60%)'};
`;

const CardNumber = styled.div`
  margin-bottom: 20px;
  color: ${({ active, textColor }) => active ? textColor : 'rgba(255, 255, 255, 0.6)'};
  font-size: 15px;
  font-family: 'OCR A Std Regular';
`;

const CardType = styled.div`
  height: 26px;
  background-image: url(${({ url }) => url});
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: right;
  opacity: ${({ active }) => active ? '1' : '0.6'};
`;

const NewCardLayout = styled(CardLayout)`
  background-color: transparent;
  background-image: url('/assets/cards-add.svg');
  background-repeat: no-repeat;
  background-position: center;
  box-sizing: border-box;
  border: 2px dashed rgba(255, 255, 255, 0.2);
`;

const CardSelect = styled(Select)`
  width: 100%;
  margin-bottom: 15px;
`;

const Card = ({ data, isActive, type, onClick, preparedModeCard, onModeCardSelect }) => {
  if (type === 'new') {
    return (
      <NewCardLayout />
    );
  }
  
  if (type === 'select') {
    const { bgColor, bankLogoUrl, brandLogoUrl } = preparedModeCard.theme;
    
    return (
      <CardLayout active={true} bgColor={bgColor}>
        <CardLogo url={bankLogoUrl} active={true} />
        <CardSelect value={`${preparedModeCard.id}`} onChange={id => onModeCardSelect(Number(id))}>
          {
            data.map((preparedCard, index) => (
              <Select.Option key={index} value={`${preparedCard.id}`}>{preparedCard.number}</Select.Option>
            ))
          }
        </CardSelect>
        <CardType url={brandLogoUrl} active={true} />
      </CardLayout>
    );
  }
  
  const { number, theme } = data;
  const { bgColor, textColor, bankLogoUrl, brandLogoUrl } = theme;
  const themedBrandLogoUrl = isActive ? brandLogoUrl : brandLogoUrl.replace(/-colored.svg$/, '-white.svg');
  
  return (
    <CardLayout active={isActive} bgColor={bgColor} onClick={onClick}>
      <CardLogo url={bankLogoUrl} active={isActive} />
      <CardNumber textColor={textColor} active={isActive}>
        {number}
      </CardNumber>
      <CardType url={themedBrandLogoUrl} active={isActive} />
    </CardLayout>
  );
};

Card.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  preparedModeCard: PropTypes.object,
  onModeCardSelect: PropTypes.func,
};

export default Card;
