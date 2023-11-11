import React from "react";
import HomeDateFilter from "./HomdDateFilter";
import ClassDateFilter from "./ClassDateFilter";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

function DateFilter(filter){

    if (filter.type === "Home") {
      return (
        <HomeDateFilter />
      )
    } else if (filter.type === "Class") {
      return (
        <ClassDateFilter />
      )
    }
};

export default DateFilter;
