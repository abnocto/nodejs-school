import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { getValidSum } from '../service/contractService';
import { Island, Title, Button, Input } from './';

const PrepaidLayout = styled(Island)`
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #353536;
`;

const PrepaidTitle = styled(Title)`
  color: #fff;
`;

const PrepaidItems = styled.div`
  width: 285px;
  margin-bottom: 40px;
`;

const PrepaidItem = styled.div`
  height: 65px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  cursor: pointer;
  background-color: ${({ selected, bgColor }) => selected ? bgColor : 'rgba(0, 0, 0, 0.05)'};
`;

const PrepaidItemIcon = styled.div`
  width: 42px;
  height: 42px;
  margin: 18px;
  border-radius: 21px;
  background-image: url(${({ bankSmLogoUrl }) => bankSmLogoUrl});
  background-size: contain;
  background-repeat: no-repeat;
  filter: ${({ selected }) => selected ? 'none' : 'grayscale(100%)'};
`;

const PrepaidItemTitle = styled.div`
  font-size: 13px;
  color: ${({ selected, textColor }) => selected ? textColor : 'rgba(255, 255, 255, 0.6)'};
`;

const PrepaidItemDescription = styled.div`
  color: ${({ selected, textColor }) => selected ? textColor : 'rgba(255, 255, 255, 0.4)'};
`;

const InputField = styled.div`
  margin: 20px 0;
  position: relative;
`;

const SumInput = styled(Input)`
  max-width: 200px;
  padding-right: 20px;
  background-color: rgba(0, 0, 0, 0.08);
  color: #fff;
`;

const Currency = styled.span`
  font-size: 12px;
  position: absolute;
  right: 10;
  top: 8px;
  color: #fff;
`;

class PrepaidContract extends Component {
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
      sum: getValidSum(event.target.value, this.props.preparedModeCard.balance),
    });
  }
  
  /**
   * @param {Event} event
   */
  handleSubmit(event) {
    if (event) event.preventDefault();
    const { sum } = this.state;
    if (sum < 1) return;
    const { id } = this.props.preparedModeCard;
    const data = {
      receiverCardId: this.props.preparedActiveCard.id,
      sum,
    };
    this.props.transfer(id, data);
  }
  
  render() {
    const { preparedInactiveCardsList, preparedModeCard, onCardChange } = this.props;
    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <PrepaidLayout>
          <PrepaidTitle>Пополнить карту</PrepaidTitle>
          <PrepaidItems>
            {
              preparedInactiveCardsList.map(card => (
                <PrepaidItem
                  bgColor={card.theme.bgColor}
                  key={card.id}
                  onClick={() => onCardChange(card.id)}
                  selected={preparedModeCard.id === card.id}
                >
                  <PrepaidItemIcon
                    bankSmLogoUrl={card.theme.bankSmLogoUrl}
                    selected={preparedModeCard.id === card.id}
                  />
                  <PrepaidItemTitle
                    textColor={card.theme.textColor}
                    selected={preparedModeCard.id === card.id}
                  >
                    C банковской карты
                    <PrepaidItemDescription
                      textColor={card.theme.textColor}
                      selected={preparedModeCard.id === card.id}
                    >
                      {card.number}
                    </PrepaidItemDescription>
                  </PrepaidItemTitle>
                </PrepaidItem>
              ))
            }
          </PrepaidItems>
          <InputField>
            <SumInput
              name='sum'
              value={this.state.sum}
              onChange={event => this.handleSumChange(event)}
            />
            <Currency>₽</Currency>
          </InputField>
          <Button
            type='submit'
            bgColor={preparedModeCard.theme.bgColor}
            textColor={preparedModeCard.theme.textColor}
          >
            Пополнить
          </Button>
        </PrepaidLayout>
      </form>
    );
  }
}

PrepaidContract.propTypes = {
  preparedActiveCard: PropTypes.object.isRequired,
  preparedModeCard: PropTypes.object.isRequired,
  preparedInactiveCardsList: PropTypes.array.isRequired,
  transfer: PropTypes.func.isRequired,
  onCardChange: PropTypes.func.isRequired,
};

export default PrepaidContract;
