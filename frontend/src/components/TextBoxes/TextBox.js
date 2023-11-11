import React from "react";
import "./styles.css";


export default function TextBox(txtbox) {
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    
    txtbox.onChange(newContent);
  };

  if(txtbox.limit >= 500){
    return (
      <textarea onChange={handleContentChange} className={ txtbox.boxClassName } placeholder={`내용은 ${txtbox.limit}자까지 입력할 수 있습니다.`} defaultValue={txtbox.defaultValue} />
      );
  }
  else{
    return (
      <textarea onChange={handleContentChange} className={ txtbox.boxClassName } placeholder={`내용은 ${txtbox.limit}자까지 입력할 수 있습니다.`} defaultValue={txtbox.defaultValue} />
    );
  }
  
}