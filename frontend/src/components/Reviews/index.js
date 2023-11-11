import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

const ARRAY = [0,1,2,3,4];

export default function Ratings({ onRatingChange }) {
  const [clicked, setClicked] = useState([false, false, false, false, false]);

  const handleStarClick = index => {
    let clickStates = [...clicked];
    for(let i = 0 ; i < 5 ; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
    onRatingChange(clickStates.filter(Boolean).length);
  }

  // const sendReview = () => {
  //   let score = clicked.filter(Boolean).length;
  // }

  // useEffect(() => {
  //   sendReview();
  // }, [clicked]);

  return (
    <Wrap>
      <RatingText>평가하기</RatingText>
      <Stars>
        {ARRAY.map((el,idx) => {
          return (
            <FaStar
              key={idx}
              size="45"
              onClick={() => handleStarClick(el)}
              className={clicked[el] && 'yellowStar'}
            />
          );
        })}
      </Stars>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
`;

const RatingText = styled.div`
  color: #787878;
  font-size: 12px;
  font-weight: 400;
`;

const Stars = styled.div`
  display: flex;
  padding-top: 5px;

  & svg {
    color: gray;
    cursor: pointer;
  }

  :hover svg {
    color: #fcc419;
  }

  & svg:hover ~ svg {
    color: gray;
  }

  .yellowStar {
    color: #fcc419;
  }
`;