import React from "react";
import "./styles.css";


export default function TitleBox(txtbox) {
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    
    txtbox.onChange(newTitle);
  };
  return (
      <input onChange={handleTitleChange} className={txtbox.boxClassName} placeholder={`제목은 ${txtbox.limit}자까지 입력할 수 있습니다.`} defaultValue={txtbox.defaultValue} />
  );
}