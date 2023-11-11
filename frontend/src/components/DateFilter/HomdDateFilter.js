import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

function HomeDateFilter({ onTimestampChange }){
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  
  useEffect(() => {
    if (startTime) {
      const formattedStartDate = startDate.toISOString().slice(0, 10);
      const formattedStartTime = startTime.toTimeString().slice(0, 8);

      const startTimestamp = `${formattedStartDate}T${formattedStartTime}`;
      onTimestampChange(startTimestamp)
    }
  })

  return (
    <div className="section-label">
      <DatePicker className="date-section"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <DatePicker className="time-section"
        selected={startTime}
        onChange={(date) => setStartTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
    </div>
  );
};

export default HomeDateFilter;
