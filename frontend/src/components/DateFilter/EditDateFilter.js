import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

function EditDateFilter({ 
  onTimeDiffChange,
  onTimestampChange, 
  setPassTime,
  classStartTime,
  classEndTime,
}){
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [passValidTime, setPassValidTime] = useState(true)
  const dateNow = moment()

  const checkStartDate = (date) => {
    if (dateNow.isSameOrBefore(date, 'day')) {
      setStartDate(date)
    } else {
      alert('강의 시작 날짜는 오늘 이후로 설정해주세요!')
    }
  } 

  useEffect(() => {
    if (classStartTime && classEndTime) {
      setStartDate(new Date(moment(classStartTime)))
      setStartTime(new Date(moment(classStartTime)))
      setEndTime(new Date(moment(classEndTime)))
    }
  }, [classStartTime, classEndTime])

  const checkStartTime = (date) => {
    if (dateNow.isBefore(startDate, 'day') || dateNow.isSameOrBefore(date, 'second')) {
      setStartTime(date)
      setEndTime(new Date(moment(date).add(1, 'hour')))
    } else {
      alert('강의 시작 시간은 지금 이후로 설정해주세요!')
    }
  } 

  const checkEndTime = (date) => {
    if (startTime) {
      const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endTimeInMinutes = date.getHours() * 60 + date.getMinutes();
      const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes;
      const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes);
      if (timeDifferenceInHours >= 60) {
        setEndTime(date)
        setPassValidTime(true)
      } else if (timeDifferenceInHours <= 0) {
        alert('강의 종료 시간은 강의 시작 시간 이후로 설정해주세요!')
      } else {
        alert('강의 시간은 최소 한 시간으로 설정해주세요!')
      }
    } else {
      alert('강의 시작 시간을 먼저 설정해주세요!')
    }
  } 
  
  useEffect(() => {
    // 시작 시간과 종료 시간이 모두 선택되면 차이 계산하여 전달
    if (startTime && endTime && passValidTime) {
      const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endTimeInMinutes = endTime.getHours() * 60 + endTime.getMinutes();
      const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes;
      const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes);
      onTimeDiffChange(timeDifferenceInHours);

      // 시작 시간과 종료 시간을 타임스탬프 형식으로 변환하여 상태에 저장합니다.
      const formattedStartDate = startDate.toISOString().slice(0, 10);
      const formattedStartTime = startTime.toTimeString().slice(0, 8);
      const formattedEndDate = startDate.toISOString().slice(0, 10);
      const formattedEndTime = endTime.toTimeString().slice(0, 8);

      const startTimestamp = `${formattedStartDate}T${formattedStartTime}`;
      const endTimestamp = `${formattedEndDate}T${formattedEndTime}`;
      onTimestampChange(startTimestamp, endTimestamp);
      setPassTime(true)
    }
  }, [startDate, startTime, endTime, passValidTime]);

  return (
    <div className="section-label">
      <DatePicker className="date-section"
        selected={startDate}
        onChange={(date) => checkStartDate(date)}
      />
      <DatePicker className="time-section"
        selected={startTime}
        onChange={(date) => checkStartTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
      <DatePicker className="time-section"
        selected={endTime}
        onChange={(date) => checkEndTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
    </div>
  );
};

export default EditDateFilter;
