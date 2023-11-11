import React from "react";
import axios from "axios";
import UserInfo from "./components/UserInfo";
import HeadLine from "./components/HeadLine";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import "./mypage.css";
import ModifyInfo from "./components/UserInfo/modifyInfo";
import api from "./interceptors/axios";

import DateFilter from "./components/DateFilter";
import "./components/Cards/styles.css";
import { Button } from "@mui/material";
import Buttons from "./components/Buttons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { updateAuth } from "./actions/authActions";
import { persistor } from "./store/configureStore";
import CardList from "./components/Cards";

export default function Mypage() {
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  // const { userId } = useParams();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const loginData = {
    'userId': useSelector(state => state.loginUserId),
    'password': useSelector(state => state.loginPassword)
  } 
  
  useEffect(() => {
    const refreshTokens = async () => {
      const refresh = await axios.post("/api/user/refresh", loginData)
      if (refresh.data.accessToken !== "NULL" && refresh.data.refreshToke !== "NULL" ) {
        dispatch(updateAuth(refresh.data.accessToken));
      } else {
        axios.post('/api/user/logout')
        localStorage.removeItem("refreshToken")
        persistor.purge()
        alert("token expired\n홈으로 돌아갑니다.");
        window.location.href = '/';
      };
    };
    const fetchUserData = async () => {
      try {
        const { data } = await api.get(`/api/user/${userId}`);
        setUserData(data);
        setLoading(true);
      } catch (error) {
      }
    };
    refreshTokens();
    fetchUserData();
  }, []);

  // ------------card start-------------
  const [validClassList, setValidClassList] = useState([]);
  const [tutorCardList, setTutorCardList] = useState([]);
  const [tutorEndList, setTutorEndList] = useState([]);
  const [tuteeCardList, setTuteeCardList] = useState([]);
  const [tuteeEndList, setTuteeEndList] = useState([]);
  const userRole = useSelector((store) => store.loginRole);
  const userId = useSelector((store) => store.loginUserpk);

  // 최초 강의 리스트 가져오기
  useEffect(() => {
    function sortByStartTime(arr) {
      return arr.sort((a, b) => {
        const momentA = moment(a.startTime);
        const momentB = moment(b.startTime);
        return momentA - momentB;
      });
    }
    const fetchClassData = async () => {
      try {
        const { data } = await api.get(`/api/lesson/card`);
        let validClass = [];
        let endClass = [];
        data.forEach((lesson) => {
          if (moment().isBefore(`${lesson.endTime}+09:00`, "second")) {
            validClass.push(lesson);
          } else {
            endClass.push(lesson);
          }
        });
        const sortedList = sortByStartTime(validClass);
        setValidClassList(sortedList);
        const sortedEndList = sortByStartTime(endClass);
        setValidClassList(sortedEndList);
        if (userRole == 1) {
          let tutorList = [];
          let tutorEndList = [];
          sortedList.forEach((lesson) => {
            if (lesson.tutorId === userId) {
              tutorList.push(lesson);
            }
          });
          sortedEndList.forEach((lesson) => {
            if (lesson.tutorId === userId) {
              tutorEndList.push(lesson);
            }
          });
          setTutorCardList(tutorList);
          setTutorEndList(tutorEndList);
        } else if (userRole == 2) {
          const userLessons = await api.get(`/api/user/lessonId/${userId}`);
          const bookedLessons = userLessons.data.map((item) => item.lessonId);
          let tuteeList = [];
          let tuteeEndList = [];
          sortedList.forEach((lesson) => {
            if (bookedLessons.includes(lesson.id)) {
              tuteeList.push(lesson);
            }
          });
          sortedEndList.forEach((lesson) => {
            if (bookedLessons.includes(lesson.id)) {
              tuteeEndList.push(lesson);
            }
          });
          setTuteeCardList(tuteeList);
          setTuteeEndList(tuteeEndList);
        }
      } catch (error) {
      }
    };
    fetchClassData();
  }, []);

  function bigCardList(arr) {
    let bigCardArr = arr;
    if (arr.length > 8) {
      bigCardArr = arr.slice(0, 8);
    }
    return bigCardArr;
  }

  function smallCardList(arr) {
    let smallCardArr = arr;
    if (arr.lenght > 10) {
      smallCardArr = arr.slice(0, 8);
    }
    return smallCardArr;
  }

  function goToAllClasses() {
    return (window.location.href = "/class");
  }


  const loginStatus = useSelector((state) => state.isLoggedIn);

  // ------------card end---------------

  return (
    <>
      {loading ? (
        <div className="mypage">
          <div>
            <div className="profile-flex">
              <UserInfo data={userData} />
              <div className="modify-btn">
                <button className="btn" onClick={openModal}>
                  프로필 수정
                </button>
              </div>
            </div>
            <div className="profile-flex">
              <div>
                <HeadLine type="mid-title" content="수강 예정 강의 "></HeadLine>
              </div>
              <div className="big-card-list">
                {userRole == 1 ? (
                  <CardList list={bigCardList(tutorCardList)} type="big" />
                ) : (
                  <CardList list={bigCardList(tuteeCardList)} type="big" />
                )}
              </div>
            </div>
            <div className="profile-flex">
              <div>
                <HeadLine type="mid-title" content="수강 완료 강의 "></HeadLine>
              </div>
              <div className="big-card-list">
                {userRole == 1 ? (
                  <CardList list={bigCardList(tutorEndList)} type="big" />
                ) : (
                  <CardList list={bigCardList(tuteeEndList)} type="big" />
                )}
              </div>
            </div>
            <ModifyInfo
              data={userData}
              isOpen={isModalOpen}
              onClose={closeModal}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
