import React, { useState } from "react";
import "./styles.css"
import BigCard from "./BigCard";
import Card from "./Card";
import Buttons from "../Buttons";

export default function CardList({ list, type }) {
  // 총 데이터 수
  const totalSlides = list.length;
  // 캐러젤 용 현재 인덱스, useState 사용하기 위해 밖에 존재
  const [currentIndex, setCurrentIndex] = useState(0);
  // 로딩 횟수 세기 용 변수
  const [loadCount, setLoadCount] = useState(1)

  // 카드 타입에 따라 리스트에 기반해 카드 만들기
  function cardSlides(){
    if (type === "big" ) {
      let cardInfo = list.map(function(element) {
        return <BigCard card={element} />;
      });
      return cardInfo;
    }else if(type === "all") {
      let cardInfo = list.map(function(element) {
        return <Card card={element} />;
      });
      return cardInfo;
    }else {
      let cardInfo = list.map(function(element) {
        return <Card card={element} />;
      });
      return cardInfo;
    };
  };

  // 카드 타입에 따라 구성 변경
  if (type === "big") {
    // 캐러젤 길이
    const slidesToShow = 1
    // 데이터 수가 캐러젤에 보일 카드 수보다 많으면 케러젤 
    if (totalSlides > slidesToShow) {
      const prevShow = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - slidesToShow : prevIndex - 1));
      };

      const nextShow = () => {
        setCurrentIndex((prevIndex) => (prevIndex === totalSlides - slidesToShow ? 0 : prevIndex + 1));
      };

      return (
        <div className="carousel-wrap">
          <button className="prev" onClick={prevShow}>
            prev
          </button>
          <div className="big-carousel-show">
            <div
              className="carousel-list"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
            >
              {cardSlides()}
            </div>
          </div>
          <button className="next" onClick={nextShow}>
              next
          </button>
        </div>
      );
    // 적으면 리스트
    } else {
      return (
        <div className="cards-flex">
          {cardSlides()}
        </div>
      )
    }
  } else if (type === 'small') {
    const slidesToShow = 3
    // 마찬가지로 데이터 수가 캐러젤에 보일 카드 수보다 많으면 캐러젤 
    if (totalSlides > slidesToShow) {
      const prevShow = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - slidesToShow : prevIndex - 1));
      };

      const nextShow = () => {
        setCurrentIndex((prevIndex) => (prevIndex === totalSlides - slidesToShow ? 0 : prevIndex + 1));
      };

      return (
        <div className="carousel-wrap">
          <button className="prev" onClick={prevShow}>
            prev
          </button>
          <div className="carousel-show">
            <div
              className="carousel-list"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
            >
              {cardSlides()}
            </div>
          </div>
          <button className="next" onClick={nextShow}>
            next
          </button>
        </div>
      );
    // 적으면 리스트
    } else {
      return (
        <div className="cards-flex">
          {cardSlides()}
        </div>
      )
    }
  } else if (type === 'all') {

    const loadMoreCards = () => {
      setLoadCount(loadCount + 1)
    }

    function addCards() {
      let arr = [
        <div className="initial-cards" key="key 1">
          {cardSlides().slice(0, 20)}
        </div>
      ]
    
      for (let i = 2; i <= loadCount; i++) {
        arr.push(
          <div className="additional-cards" key={`key${i}`}>
            {cardSlides().slice(20 * (loadCount - 1), 20 * loadCount)}
          </div>
        )
      };  

      return arr
    };

    return (
      <div className="all-cards">
        {addCards()}
        <div className="loadButton">
          { totalSlides > loadCount * 20
            ? <Buttons bntType="default" link={loadMoreCards} />
            : null
          }
        </div>
      </div>
    )
  } else {
    return null
  }
}