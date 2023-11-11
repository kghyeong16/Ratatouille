import React from "react";
import "./styles.css";
import TextBox from "./TextBox";
import TitleBox from "./TitleBox";

export default function TextBoxes(txtbox) {

  if(txtbox.boxType === "title"){
    return (
      <div>
        <TitleBox onChange={txtbox.onChange} boxClassName={txtbox.boxClassName} limit={txtbox.limit} defaultValue={txtbox.defaultValue} />
      </div>
    )
  } else{
    return (
      <div>
        <TextBox onChange={txtbox.onChange} boxClassName={txtbox.boxClassName} limit={txtbox.limit} defaultValue={txtbox.defaultValue} />
      </div>
    )
  };
}