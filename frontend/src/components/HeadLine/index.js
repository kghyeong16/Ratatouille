import React from "react";
import "./styles.css";

function HeadLine( {type, content}){
    return (
        <p className = {type}>
            {content}
        </p>
    )
}
export default HeadLine;
