import React from "react";
import "./styles.css";

function Card({ card }) {
  const moveToDetail = () => {
    window.location.href = `/detail/${card.id}`
  }

  return (
    <div className="card-box" key={card.id} onClick={moveToDetail}>
      <div>
        <img src={card.images} className="card-img" alt={`Card ${card.id}`} />
      </div>
        <p style={{ margin: 0, color: "#964b00" }}>{card.title}</p>
      <p style={{ margin: 0, color: "var(--font-grey)" }}>
        {card.startTime.slice(0,10)} {card.startTime.slice(11,16)} ~ {card.endTime.slice(11,16)}
      </p>
      <p style={{ margin: 0, fontSize: "1rem", color: "var(--black" }}>
        <span style={{ fontWeight: "600" }}>₩ {card.fee}</span>
      </p>
    </div>
  );
}

export default Card;
