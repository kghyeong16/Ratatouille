import React, { useState,useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import dayjs from "dayjs";

function ClassDateFilter({ onTimeDiffChange, onTimestampChange, setPassTime}){
  const dateNow = moment()
  const [startDateValue, setStartDateValue] = useState(dateNow.format().slice(0,10));
  const [startTimeValue, setStartTimeValue] = useState("");
  const [endTimeValue, setEndTimeValue] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [passValidTime, setPassValidTime] = useState(false)


  const checkStartDate = (date) => {
    if (dateNow.isSameOrBefore(date.$d, 'day')) {
      setStartDate(date.$d)
      setStartDateValue(moment(date.$d).format().slice(0, 10))
    } else {
      alert('강의 시작 날짜는 오늘 이후로 설정해주세요!')
    }
  } 

  const checkStartTime = (date) => {
    if (dateNow.isBefore(startDate, 'day') || dateNow.isSameOrBefore(date.$d, 'second')) {
      setStartTime(date.$d)
      setStartTimeValue(moment(date.$d).format().slice(0, 19))
      setEndTime(new Date(moment(date.$d).add(1, 'hour')))
      setEndTimeValue(moment(endTime).format().slice(0, 19))
      setPassValidTime(true)
    } else {
      alert('강의 시작 시간은 지금 이후로 설정해주세요!')
    }
  } 

  const checkEndTime = (date) => {
    if (startTime) {
      const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endTimeInMinutes = date.$d.getHours() * 60 + date.$d.getMinutes();
      const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes;
      const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes);
      if (timeDifferenceInHours >= 60) {
        setEndTime(date.$d)
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
  }, [startTime, endTime, passValidTime]);

  return (
    <div className="section-label">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker','TimePicker']}>
      <DatePicker className="date-section"
        label="강의 날짜"
        value={dayjs(startDateValue)}
        onChange={(date) => checkStartDate(date)}
        format="YY/MM/DD"
      />
      <DigitalClock className="time-section"
        label="강의 시작 시간"
        // value={dayjs(startTimeValue)}
        onChange={(date) => checkStartTime(date)}
        // showTimeSelect
        // showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
      <DigitalClock className="time-section"
        label="강의 종료 시간"
        // value={dayjs(endTimeValue)}
        onChange={(date) => checkEndTime(date)}
        // showTimeSelect
        // showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
      </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default ClassDateFilter;
