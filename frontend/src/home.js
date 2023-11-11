import React, { useState, useEffect } from 'react';
import HeadLine from "./components/HeadLine";
import './index.css';
import './components/Cards/styles.css';
import { Button } from '@mui/material';
import moment from "moment";
import api from './interceptors/axios';
import { useSelector } from 'react-redux';
import CardList from './components/Cards';
import './home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import bLogo1 from "./assets/banner/bannerImage.png";
import bLogo2 from "./assets/banner/bannerImage2.png"
import OverlayLoading from './components/Loading';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function Home() {
  const [validClassList, setValidClassList] = useState([])
  const [tutorCardList, setTutorCardList] = useState([])
  const [tuteeCardList, setTuteeCardList] = useState([])
  const userRole = useSelector(store => store.loginRole)
  const userId = useSelector(store => store.loginUserpk)
  const [isLoading, setIsLoading] = useState(false)

  
  // 최초 강의 리스트 가져오기
  useEffect(()=>{
    setIsLoading(true)
    function sortByStartTime(arr) {
      return arr.sort((a, b) => {
        const momentA = moment(a.startTime);
        const momentB = moment(b.startTime);
        return momentA - momentB;
      });
    }
    const fetchClassData = async () => {
      try{
        const {data} = await api.get(`/api/lesson/card`)
        let validClass = []
        data.forEach((lesson) => {
          if (moment().isBefore(`${lesson.endTime}+09:00`, 'second')) {
            validClass.push(lesson)
          }
        });
        const sortedList = sortByStartTime(validClass)
        setValidClassList(sortedList)
        if (userRole == 1) {
          let tutorList = []
          sortedList.forEach((lesson) => {
            if (lesson.tutorId === userId) {
              tutorList.push(lesson)
            }
          });
          setTutorCardList(tutorList)
        } else if (userRole == 2) {
          const userLessons = await api.get(`/api/user/lessonId/${userId}`)
          const bookedLessons = userLessons.data.map(item => item.lessonId);
          let tuteeList = []
          sortedList.forEach((lesson) => {
            if (bookedLessons.includes(lesson.id)){
              tuteeList.push(lesson)
            }
          })
          setTuteeCardList(tuteeList)
        }
      } catch (error) {
        setIsLoading(false)
      }
    }
    fetchClassData()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleMyCardList = async() => {
      if (userRole == 1) {
        let tutorList = []
        validClassList.forEach((lesson) => {
          if (lesson.tutorId === userId) {
            tutorList.push(lesson)
          }
        });
        setTutorCardList(tutorList)
      } else if (userRole == 2) {
        const userLessons = await api.get(`/api/user/lessonId/${userId}`)
        const bookedLessons = userLessons.data.map(item => item.lessonId);
        let tuteeList = []
        validClassList.forEach((lesson) => {
          if (bookedLessons.includes(lesson.id)){
            tuteeList.push(lesson)
          }
        })
        setTuteeCardList(tuteeList)
      }
    }
    handleMyCardList()
  }, [userRole])

  function bigCardList(arr) {
    let bigCardArr = arr
    if (arr.length > 8){
      bigCardArr = arr.slice(0, 8)
    }
    return bigCardArr
  }

  function smallCardList(arr) {
    let smallCardArr = arr
    if (arr.lenght > 10) {
      smallCardArr = arr.slice(0, 8)
    }
    return smallCardArr
  }

  function goToAllClasses() {
    return window.location.href = "/class"
  }

  const loginStatus = useSelector((state) => state.isLoggedIn)


  return (
    <div className="Home">
      {isLoading ? <OverlayLoading /> : null}
      <div className="home-content">
        <div className='banner'>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            style={{ height: '460px', "--swiper-pagination-color": "#ff385c" 
                    , "--swiper-navigation-color": "#ff385c",display: 'flex',
                    justifyContent: 'center', width:'850px'}}
          >
            <SwiperSlide><img src={bLogo1} className='banner-img'></img></SwiperSlide>
            <SwiperSlide><img src={bLogo2} className='banner-img'></img></SwiperSlide>
          </Swiper>
        </div>
        <div>
          { loginStatus
          ? <div>
              <div className='main-card-headline'>
                <HeadLine type = "top-title" content = "나의 강의"></HeadLine>
                <div>
                  { userRole == 1 
                  ? <CardList list={bigCardList(tutorCardList)} type="big"/>
                  : <CardList list={bigCardList(tuteeCardList)} type="big"/>
                  }
                </div>
              </div>
            </div>
          : null
          }
        </div>
        
       
        <div className="btn">
          <Button variant="outlined" color="error" type='button' onClick={goToAllClasses} >전체 강의 보기</Button>
        </div>
       
        <div>
          <HeadLine type = "mid-title" content = "합리적인 가격으로 요리수업을 예약해 보세요 "></HeadLine>
          <div>
            <CardList list={smallCardList(validClassList)} type="small"/>
          </div>
        </div>
      </div>

    </div>
  );
}
