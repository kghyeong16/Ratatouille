import React, {useState, useEffect} from 'react';
import moment from "moment";
import api from "./interceptors/axios";
import CardList from './components/Cards';
import Category from './components/Category';
import "./allClasses.css";

export default function AllClasses() {
  const [classList, setClassList] = useState([])
  const [validClassList, setValidClassList] = useState([])
  const [filteredClassList, setFilteredClassList] = useState([])
  const [selectedValue, setSelectedValue] = useState(0);
  

    // 최초 강의 리스트 가져오기
    useEffect(()=>{
      const fetchClassData = async () => {
        try{
          const {data} = await api.get(`/api/lesson/card`)
          setClassList(data)
        } catch (error) {
        }
      }
      fetchClassData()
    }, [])
  
    // 강의 리스트에서 아직 시작하지 않은 강의 리스트 추리기
    useEffect(()=>{
      function sortByStartTime(arr) {
        return arr.sort((a, b) => {
          const momentA = moment(a.startTime);
          const momentB = moment(b.startTime);
          return momentA - momentB;
        });
      }
      if (classList) {
        let validClass = []
        classList.forEach((data) => {
          if (moment().isBefore(`${data.endTime}+09:00`, 'second')) {
            validClass.push(data)
          }
        });
        const sortedList = sortByStartTime(validClass)
        setValidClassList(sortedList)
        setFilteredClassList(sortedList)
      }
    }, [classList])
  

  function filterClassList() {
    let filteredList = validClassList.slice();
    if (selectedValue) {
      filteredList = filteredList.filter((data) => {
        return data.categoryId === selectedValue;
      });
    }
    return setFilteredClassList(filteredList)
  } 

  const handleSelectedCategory = (categoryId) => {
    setSelectedValue(categoryId);
    filterClassList();
  };

  return (
    <div className='classes-container'>
      <div className='all-classes'>
        <Category onSelectedCategory={handleSelectedCategory}></Category>
        <div className='class-cards'>
          <CardList list={filteredClassList} type="all" />
        </div>
      </div>
    </div>
    
  )
}