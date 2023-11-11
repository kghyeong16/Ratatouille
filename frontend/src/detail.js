import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./detail.css";
import Card from '@mui/material/Card';
import PhotoCollage from './components/PhotoCollage';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import api from './interceptors/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Ratings from './components/Reviews';
import moment from 'moment';
import 'moment/locale/ko';
import CardList from './components/Cards';
import ShowReviews from './components/Reviews/showReviews';
import createSession from './createSession';
import { store } from './store/configureStore';
import { useLocation } from "react-router-dom";
import emptyProfileImage from './assets/profile/empty-profile.png';
import OverlayLoading from './components/Loading';
import { Box, Divider } from '@mui/material';
import all from "./assets/category/all.png";
import pasta from "./assets/category/pasta.png";
import korean from "./assets/category/korean.png";
import chinese from  "./assets/category/chinese.png"
import japanese from "./assets/category/japanese.png";
import bunsik from "./assets/category/bunsik.png";

const cardStyle = {
  position:'fixed',
  top:'25%',
  left:'75%',
  border:'none',
  borderRadius:'15px',
  backgroundColor:'#F1DCF6'
}
export default function Detail() {
  const { index } = useParams(); // URL 파라미터에서 index를 가져옵니다.
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [fee, setFee] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [images, setImages] = useState([])
  const [classTutorId, setClassTutorId] = useState(null)
  const [tutorNickname, setTutorNickname] = useState('')
  const [tutorProfileImg, setTutorProfileImg] = useState('')
  const [tutorIntro, setTutorIntro] = useState('')
  const [category, setCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = useSelector(state => state.loginRole)
  const userId = useSelector(state => state.loginUserpk)
  const [nowTime, setNowTime] = useState('')
  const [booked, setBooked] = useState('')
  const [cardDataList, setCardDataList] = useState([])
  const [tutorReview, setTutorReview] = useState([])
  const [reviewExist, setReviewExist] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [ratingAverage, setRatingAverage] = useState(null)

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const lessonDate = `${startTime.slice(0,10)} ${startTime.slice(11, 16)} ~ ${endTime.slice(11, 16)}`

  const navigate = useNavigate()
  const BookLesson = async () => {
    try{
      if(role===2){
        const {data} = await api.post(`/api/lesson/${index}/book`)
        await window.alert("신청되었습니다.");
        window.location.reload();
      }else{
        window.alert("로그인을 필요로 하는 서비스입니다!")
      }
    }
    catch(error){
    }
  }

  const CancelLesson = async () => {
    try{
      const {data} = await api.delete(`/api/lesson/${index}/book`)
      await window.alert("신청이 취소되었습니다.");
      window.location.reload();
      
    }
    catch(error){
    }
  }

  const MoveToLiveLesson = async () => {
    const data = {title:title, id: index}//live강의 component로 보내는 데이터
    navigate("/livelesson", { state: data });
  }
  useEffect(()=>{
    const time = moment().format('YYYY-MM-DDTHH:mm:ss').toString();
    setNowTime(time);
    
  },[nowTime])

  useEffect(()=>{
    setIsLoading(true)
    // 시작 시간에 따라 정렬
    function sortByStartTime(arr) {
      return arr.sort((a, b) => {
        const momentA = moment(a.startTime);
        const momentB = moment(b.startTime);
        return momentB - momentA;
      });
    }
    function fetchClassData() {
      const isLoggedIn = store.getState().isLoggedIn;
      if (isLoggedIn) {
        api.get(`/api/lesson/${index}`)
        .then (res => {
          const data = res.data
          setTitle(data.title)
          setDetail(data.detail)
          setIngredients(data.ingredients)
          setFee(data.fee)
          setClassTutorId(data.tutorId)
          setStartTime(data.startTime.toString())
          setEndTime(data.endTime)
          setImages(data.imageUrls)
          setBooked(data.booked)
          setVideoUrl(data.url)
          if (data.categoryId === 1) {
            setCategory('한식')
          } else if (data.categoryId === 2) {
            setCategory('양식')
          } else if (data.categoryId === 3) {
            setCategory('중식')
          } else if (data.categoryId === 4) {
            setCategory('일식')
          } else if (data.categoryId === 5) {
            setCategory('분식')
          }
          // 강의자 정보 가져오기
          api.get(`/api/user/detail/${data.tutorId}`)
          .then (res => {
            setTutorIntro(res.data.intro)
            setTutorNickname(res.data.nickname)
            setTutorProfileImg(res.data.profileImg)
          })
          .catch(err => {
          })
          // 리뷰 정보 가져오기
          api.get(`/api/review/${data.tutorId}`)
          .then (res => {
            const reviews = res.data
            let validRating = []
            reviews.forEach((review) => {
              if (review.rating !== null){
                validRating.push(review.rating)
              }
            })
            const ratingAv = validRating.reduce((total, num) => total + num, 0)/validRating.length;
            setRatingAverage(ratingAv)
            setTutorReview(res.data)
          })
          .catch (err => {
          })
          // 카드에 들어갈 강의 정보 가져오는 api
          api.get(`/api/lesson/card`)
          .then (res => {
            const classData = res.data;
            let validClass = [];
            classData.forEach((lesson) => {
              if (lesson.tutorId == data.tutorId) {
                validClass.push(lesson)
              };
            });

            // 가져온 강의 데이터 정렬
            const sortedData = sortByStartTime(validClass);

            //정렬한 강의 데이터에서 카드에 넣을 데이터 추려내기
            let cardData = []
            sortedData.forEach((lesson) => {
              if (lesson.id != index) {
                cardData.push(lesson)
              }
            })
            setCardDataList(cardData)
          })
          .catch (error => {
          })
          if (role == 2) {
            api.get(`/api/review/all/${index}`)
            .then (res => { 
              const classReviews = res.data
              classReviews.forEach((review) => {
                if (review.userId == userId && review.text !== null) {
                  setReviewExist(true)
                }
              })
            }).catch (err => {
            })
          }
        setIsLoading(false)
        })
        .catch (err => {
        });
      } else {
        api.get(`/api/lesson/${index}`)
        .then (res => {
          const data = res.data
          setTitle(data.title)
          setDetail(data.detail)
          setIngredients(data.ingredients)
          setFee(data.fee)
          setClassTutorId(data.tutorId)
          setStartTime(data.startTime.toString())
          setEndTime(data.endTime)
          setImages(data.imageUrls)
          setBooked(data.booked)
          if (data.categoryId === 1) {
            setCategory('한식')
          } else if (data.categoryId === 2) {
            setCategory('양식')
          } else if (data.categoryId === 3) {
            setCategory('중식')
          } else if (data.categoryId === 4) {
            setCategory('일식')
          } else if (data.categoryId === 5) {
            setCategory('분식')
          }
          // 강의자 정보 가져오기
          axios.get(`/api/user/detail/${data.tutorId}`)
          .then (res => {
            setTutorIntro(res.data.intro)
            setTutorNickname(res.data.nickname)
            setTutorProfileImg(res.data.profileImg)
          })
          .catch(err => {
          })
          // 리뷰 정보 가져오기
          axios.get(`/api/review/${data.tutorId}`)
          .then (res => {
            const reviews = res.data
            let validRating = []
            reviews.forEach((review) => {
              if (review.rating !== null){
                validRating.push(review.rating)
              }
            })
            const ratingAv = validRating.reduce((total, num) => total + num, 0)/validRating.length;
            setRatingAverage(ratingAv)
            setTutorReview(res.data)
          })
          .catch (err => {
          })
          // 카드에 들어갈 강의 정보 가져오는 api
          axios.get(`/api/lesson/card`)
          .then (res => {
            const classData = res.data;
            let validClass = [];
            classData.forEach((lesson) => {
              if (lesson.tutorId == data.tutorId) {
                validClass.push(lesson)
              };
            });

            // 가져온 강의 데이터 정렬
            const sortedData = sortByStartTime(validClass);

            //정렬한 강의 데이터에서 카드에 넣을 데이터 추려내기
            let cardData = []
            sortedData.forEach((lesson) => {
              if (lesson.id != index) {
                cardData.push(lesson)
              }
            })
            setCardDataList(cardData)
          })
          .catch (error => {

          })
          setIsLoading(false)
        })
        .catch (err => {
        });
      }
    }
    fetchClassData()
  }, [])

  const goToEditClass = () => {
    if (window.confirm(
      `게시글을 수정하시겠습니까? 이미지와 동영상을 새로 업로드해야 합니다.`
    )) {
      navigate(`/detail/${index}/edit`)
    }
  }

  // 리뷰 내용
  const [reviewContent, setReviewContent] = useState("");
  const handleReviewChange = (e) => {
    setReviewContent(e.target.value);
  }

  // 별점
  const [selectedStars, setSelectedStars] = useState(0);

  const handleRatingChange = (count) => {
    setSelectedStars(count);
  }

  // 리뷰 보내기
  const handleReviewSubmit = async () => {
    try {
      const requestData = {
        "text": reviewContent,
        "rating": selectedStars,
      }; 

      const response = await api.put(`/api/review/${index}`, requestData);

      // 필요하다면 서버로부터의 응답을 처리합니다
      setIsModalOpen(false);
      window.location.href = location.pathname
    } catch (error) {
      // 필요하다면 오류를 처리합니다
    }
  };

  const [categoryImage, setCategoryImage] = useState('');
  useEffect(()=>{if(category==='한식'){
    setCategoryImage(korean);
  }else if(category==='일식'){
    setCategoryImage(japanese);
  }else if(category==='중식'){
    setCategoryImage(chinese);
  }else if(category==='분식'){
    setCategoryImage(bunsik);
  }else{
    setCategoryImage(pasta);
  }})
  


  return (
    <Box className='detail-container' sx={{ display:'flex', justifyContent:'center', margin:'auto', width:1048}}>
      <Grid container className='detail-content'>
        {/* top 
        카테고리
        강의명
        수정 버튼*/}
        <Grid item className='top' sx={{paddingTop : 5, paddingBottom : 5}}>
          <div className='top-left'>
            <div className="category-container">
              <img src={categoryImage} className="img-category"></img>
              <span className='category'>{category}</span>
            </div>
            <Box sx={{ marginTop:3, display:'flex'}}>
              <Typography className='title' component='h1' variant='h3'>{title}</Typography>
              <div className='edit-button'>
              { role === 1 && classTutorId === userId
                ? <Button type="submit" onClick={goToEditClass}>강의 수정하기</Button>
                : null
              }
            </div>
            </Box>
          </div>
        </Grid>
        <Grid item container className='bottom-container'>
          <Grid item className='bottom-box'>
            <Box className='img-box'>
              <PhotoCollage imgList={images} />
            </Box>
          </Grid>
            <Grid item container spacing={2} maxWidth='1048px'>
              <Grid item xs={12}>
                <Box sx={{ paddingTop : 5 }}>
                  <h2 className='subtitle'>{tutorNickname}님의 요리 교실</h2>
                  <Typography className='time'>{lessonDate}</Typography>
                </Box>
              <Divider variant='middle' />
                <Box className='section-box'>
                  <h2>클래스 상세</h2>
                  <div>
                  {detail}
                  </div>
                </Box>
              <Divider variant='middle' />
                <div className='section-box'>
                  <h2> 준비물</h2>
                  <div>
                  {ingredients}
                  </div>
                </div>
                <Divider variant='middle' />
                <div className='intro-box'>
                  <Grid container>            
                    <Grid item xs={1}>
                      { tutorProfileImg
                      ? <img src={tutorProfileImg} width='80' height='80' alt='tutor'/>
                      : <img src={emptyProfileImage} width='80' height='80' alt='tutor'/>
                      }
                    </Grid>
                    <Grid item xs={11}>
                      <h2 className='intro'> 강의자 {tutorNickname}님 소개</h2>
                      <div>{tutorIntro}</div>
                      <div className='class-and-rating'>
                        <p className='intro'>클래스 {cardDataList.length + 1}개 생성 / </p>
                        <div>
                          { ratingAverage
                            ? <p className='intro'>평균 별점 {ratingAverage}</p>
                            : <p className='intro'>아직 작성된 리뷰가 없습니다.</p>
                          }
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>

          </Grid>
          </Grid>
            {/* 영상 노출 부분
              1. 강의에 수강신청한 사람
              2. 강의자
              3. 강의 종료 시점보다 현재가 나중인 경우
            */}
            <Divider variant='middle' />            
            <Grid item>
              {videoUrl && (booked || (classTutorId === userId))?
              <div className="video-container">
                  <video controls>
                    <source src={`/video/recordings/${index}/${index}.mp4`} type="video/mp4"  width='320' height='240'/>
                  </video>
              </div>
              :null
              }
            </Grid>
            <Grid item className='section-box'>
              <Typography component='h2' variant='h5'>
                수강 후기
              </Typography>
              { role == 2 && booked && moment(nowTime).isAfter(endTime, 'second') && !reviewExist
              ? <button className="review-regist-btn" onClick={handleOpenModal}>수강후기 작성하기</button>
              : null
              }

              <ShowReviews reviewList={tutorReview} />
            </Grid>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={handleCloseModal}>
                    &times;
                  </span>
                  <h2>수강 후기 작성</h2>
                  <Ratings onRatingChange={handleRatingChange}></Ratings>
                  <div className='review-content'>
                    <textarea onChange={handleReviewChange} rows="4" cols="50" placeholder="후기를 작성해주세요..."></textarea>
                  </div>
                  <div>
                    <button onClick={handleReviewSubmit}>작성 완료</button>
                  </div>
                </div>
              </div>
            )}
            <div>
            <Divider variant='middle' />
              <div>
                <h2>
                    {tutorNickname}님의 다른 클래스
                </h2>
              </div>
              <div className='detail-cards'>
                <CardList list={cardDataList} type="small" />
              </div>
            </div>
          </Grid> 
        </Grid>
        
        <Card sx={{ ...cardStyle, width: 260 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {lessonDate}
            </Typography>
            <Typography variant="h6" component="div">
            {title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            ￦{fee}
            </Typography>
            <Typography variant="body2">
              <br />
              {detail}
            </Typography>
          </CardContent>
          { 
            role == 1 ? //강의자인 경우
              (classTutorId == userId? //본인 강의인 경우 
                (nowTime.localeCompare(startTime) < 0 ?// 아직 강의시간이 안된 경우
                  <div>아직 강의시간이 아닙니다</div> 
                  :
                  <CardActions>
                    <Button size="small" onClick ={MoveToLiveLesson}>강의실 입장</Button>
                  </CardActions>
                )
              :
              (<Button size="small" >강의 권한이 없습니다</Button>) // 본인 강의가 아닌 경우
              )
            :
            // 수강생인 경우
            (
              
              booked ?
              (nowTime.localeCompare(startTime) < 0?// 아직 강의시간이 안된 경우
                  <CardActions>
                    <Button size="small">아직 강의시간이 아닙니다</Button>
                    <Button size="small" onClick={CancelLesson}>신청 취소</Button>
                  </CardActions>
                  :
                  nowTime.localeCompare(endTime) > 0?
                  <CardActions>
                      <Button size="small">종료된 강의 입니다</Button>
                  </CardActions>
                  :
                  <CardActions>
                    <Button size="small" onClick ={MoveToLiveLesson}>강의실 입장</Button>
                    <Button size="small" onClick={CancelLesson}>신청 취소</Button>
                  </CardActions>  
              ):
              <CardActions>
                  <Button size="small" onClick={BookLesson}>강의 신청</Button>
              </CardActions>
            )
            } 
        </Card>
      {isLoading ? <OverlayLoading /> : null}
    </Box>
  );
};


