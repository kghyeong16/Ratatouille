import React, { useState } from "react";
import "./styles.css";

export default function Buttons(btn) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (!isDisabled) {
      setIsDisabled(true);
      btn.link(); // 버튼 클릭 시 호출할 함수 실행

      setTimeout(() => {
        setIsDisabled(false);
      }, 1000); // 일정 시간 후 버튼 활성화 (1000ms = 1초)
    }
  };

  return (
    <div className="btn-div">
      <input
        type="button"
        className={btn.btnType}
        value={btn.value}
        onClick={handleClick}
        disabled={isDisabled}
      />
    </div>
  );
};