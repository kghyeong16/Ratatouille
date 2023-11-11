import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import TextBoxes from "./components/TextBoxes";
import HeadLine from "./components/HeadLine";
import Buttons from "./components/Buttons";
import ImgUploadBtn from "./assets/button/imageupload.png";
import RecipeInput from "./components/RecipeInput";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import "./classEdit.css";
import EditDateFilter from "./components/DateFilter/EditDateFilter";
import api from "./interceptors/axios";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateAuth } from "./actions/authActions";
import { persistor } from "./store/configureStore";
import OverlayLoading from "./components/Loading";
import moment from "moment";

export default function EditClass() {
  const { index } = useParams(); // URL 파라미터에서 index를 가져옵니다.
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [recipeCnt, setRecipeCnt] = useState(1);
  const [passTime, setPassTime] = useState(false)
  const dispatch = useDispatch()

  const handleImageChange = (event) => {
    const files = event.target.files;
    const images = [];

    for (let i = 0; i < files.length && i < 5; i++) {
      const file = files[i];
      // const objectUrl = URL.createObjectURL(file);
      images.push(file);
    }

    setSelectedImages((prevImages) => [...prevImages, ...images]);
  };

  const handleChangeImage = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = file; // 주어진 인덱스에 파일 객체를 설정합니다.
        return newImages;
      });
    }
  };

  const [imagePreviews, setImagePreviews] = useState([]); // 추가된 부분: 이미지 미리보기 데이터 URL 배열

  const generateImagePreviews = () => {
    const previews = [];
    selectedImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result); // 데이터 URL을 배열에 추가
        if (previews.length === selectedImages.length) {
          // 모든 이미지를 미리보기 배열에 추가했을 때만 상태 업데이트
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
    if (selectedImages.length === 0) {
      setImagePreviews([]);
    }
  };

  useEffect(() => {
    // 이미지 미리보기 업데이트
    generateImagePreviews();
  }, [selectedImages]); // selectedImages 상태가 변경될 때마다 호출되도록 설정
  
  const handleImageUpdate = (index) => {
    const fileInput = document.getElementById(`image-update-input-${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  
  const [selectedValue, setSelectedValue] = useState("");

  const handleCategoryChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const upRecipeCnt = () => {
    setRecipeCnt(recipeCnt + 1);
    setRecipeDataset([...recipeDataset, 0])
    setVideoDataset([...videoDataset, 0])
  }

  const downRecipeCnt = () => {
    setRecipeCnt(recipeCnt - 1);
    recipeDataset.pop()
    videoDataset.pop()
  };

  const [title, setTitle] = useState("");
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  }

  const [detail, setDetail] = useState("");
  const handleDetailChange = (newContent) => {
    setDetail(newContent);
  }

  const [ingredients, setIngredients] = useState("");
  const handleIngredientsChange = (newContent) => {
    setIngredients(newContent);
  }

  const [fee, setFee] = useState(null);

  // 시간 차이를 통해 비용처리하는 함수
  const handleTimeDiffChange = (diffInMinutes) => {
    setFee(diffInMinutes*200);
  };

  const [startTimestamp, setStartTimestamp] = useState(""); // 시작 시간의 타임스탬프 상태
  const [endTimestamp, setEndTimestamp] = useState(""); // 종료 시간의 타임스탬프 상태

  // 타임스탬프 변경을 처리하는 함수
  const handleTimestampChange = (start, end) => {
    setStartTimestamp(start);
    setEndTimestamp(end);
  };

  
  const [recipeDataset, setRecipeDataset] = useState([0]) 
  const [videoDataset, setVideoDataset] = useState([0])

  const [videoTitles, setVideoTitles] = useState([])
  const [videoContents, setVideoContents] = useState([])

  const loginData = {
    'userId': useSelector(state => state.loginUserId),
    'password': useSelector(state => state.loginPassword)
  } 

  useEffect(()=>{
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
    const setClassData = async () => {
      try{
        setIsLoading(true)
        const {data} = await api.get(`/api/lesson/${index}`)
        setTitle(data.title)
        setDetail(data.detail)
        setIngredients(data.ingredients)
        setFee(data.fee)
        setStartTimestamp(data.startTime + '+09:00')
        setEndTimestamp(data.endTime + '+09:00')
        setVideoTitles(data.videoTitles)
        setVideoContents(data.videoContents)
        setSelectedValue(data.categoryId)

        for (let i = 1; i < data.videoTitles.length; i++){
          upRecipeCnt()
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }
    refreshTokens();
    setClassData();
  }, [])

  const checkEditClass = () => {
    if (title) {
      if (imagePreviews.length > 0) {
        if (passTime) {
          if (selectedValue) {
            if (detail) {
              if (ingredients) {
                HandleEditClass()
                } else {
                  alert('준비물 내용을 확인해주세요!')
                }
              } else {
                alert('상세 내용을 확인해주세요!')
              }
            } else {
              alert('카테고리 설정을 확인해주세요!')
            }
        } else {
          alert('클래스 시간 설정을 확인해주세요!')
        }
      } else {
        alert('사진을 확인해주세요!')
      }
    } else {
      alert('제목을 확인해주세요!')
    }
  }


  const HandleEditClass = async () => {
    setIsLoading(true)
    // 이미지 및 비디오 파일들을 FormData에 추가
    const formData = new FormData()

    // JSON 형식으로 전송할 데이터 생성
    const request = {
      'title': title,
      'detail': detail,
      'ingredients': ingredients,
      'fee': fee,
      'startTime': startTimestamp,
      'endTime': endTimestamp,
      'categoryId': `${selectedValue}`,
    };
  // JSON 형식의 request 데이터를 formData에 추가
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));

  selectedImages.forEach((image) => {
    formData.append('imgFiles', image);
    });
    
    const videoVO = recipeDataset;
    formData.append('videoVOList', new Blob([JSON.stringify(videoVO)], { type: 'application/json' }));
    
    videoDataset.forEach((video) => {
      formData.append('videoFiles', video);
    });
      
    try {
      const refresh = await axios.post("/api/user/refresh", loginData)
      if (refresh.data.accessToken !== "NULL" && refresh.data.refreshToke !== "NULL" ) {
        dispatch(updateAuth(refresh.data.accessToken));
      } else {
        axios.post('/api/user/logout')
        localStorage.removeItem("refreshToken")
        persistor.purge()
        alert("token expired\n홈으로 돌아갑니다.");
        window.location.href = '/';
      }

      const response = await api.put(`/api/lesson/${index}`, formData);
      setIsLoading(false)
      window.location.href = `/detail/${index}`
    } catch (error) {
      setIsLoading(false)
      alert('레시피를 채우고 저장 버튼을 눌렀는지 확인해주세요!')
    }
  };

  const HandleDeleteClass = async () => {
    // event.preventDefault();

    try{
      setIsLoading(true)
      const {data} = await api.delete(`/api/lesson/${index}`);
      setIsLoading(false)
      window.location.href = "/";
    }catch (error) {
      setIsLoading(false)
    }
  };

  return (
    <div className="edit-container">
      <div className="class-edit">
        {isLoading ? <OverlayLoading /> : null}
        <div>
          <HeadLine type="top-title" content="클래스 수정" />
        </div>
        <div>
          <HeadLine type="mid-title" content="1. 클래스 제목" />
          <TextBoxes onChange={handleTitleChange} boxType="title" boxClassName="create-title-box" limit={50} defaultValue={title} />

        </div>
        <div>
          <HeadLine type="mid-title" content="2. 이미지 업로드" />
          <div className="edit-body">
            {/* 이미지 업로드용 input 요소 */}
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
              className="img-upload-btn"
              id="image-upload-input" // id 추가
              style={{ display: "none" }}
              multiple
            />
            <div className="image-preview-container">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    className="img-upload-preview"
                    src={preview} // 데이터 URL을 직접 사용합니다.
                    alt={`imguploadpreview-${index}`}
                  />
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(event) => handleChangeImage(index, event)}
                    id={`image-update-input-${index}`}
                    style={{ display: "none" }}
                  />
                  <div className="btn-container">
                    <button onClick={() => handleImageUpdate(index)}>
                      이미지 수정
                    </button>
                    <button onClick={() => handleDeleteImage(index)}>
                      이미지 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {selectedImages.length < 5 && ( // 이미지 개수가 5개 미만일 때에만 이미지 업로드 버튼 표시
              <label htmlFor="image-upload-input">
                {" "}
                {/* label 요소를 이용하여 input 요소와 연결 */}
                <img
                  className="img-upload-btn"
                  src={ImgUploadBtn}
                  alt="imguploadbtn"
                />
              </label>
            )}
          </div>
        </div>
        <div>
          <HeadLine type="mid-title" content="3. 클래스 상세" />
          <div className="stateSelector">
          <EditDateFilter
            onTimestampChange={handleTimestampChange}
            onTimeDiffChange={handleTimeDiffChange}
            setPassTime={setPassTime}
            classStartTime={startTimestamp}
            classEndTime={endTimestamp}
            />
            <Select
            value={selectedValue}
            onChange={handleCategoryChange}
            sx={{
              width: '5em',
              height: '2em'
            }}
            >
              <MenuItem value={1}>한식</MenuItem>
              <MenuItem value={2}>양식</MenuItem>
              <MenuItem value={3}>중식</MenuItem>
              <MenuItem value={4}>일식</MenuItem>
              <MenuItem value={5}>분식</MenuItem>
            </Select>
          </div>
          <TextBoxes onChange={handleDetailChange} boxClassName="big-text-box" limit={1000} defaultValue={detail} />
        </div>
        <div>
          <HeadLine type="mid-title" content="4. 준비물" />
          <TextBoxes onChange={handleIngredientsChange} boxClassName="small-text-box" limit={255} defaultValue={ingredients}/>
        </div>
        <div>
          <HeadLine type="mid-title" content="5. 레시피" />
        </div>
        <div className="recipe-container">
          <h2>레시피 업로드</h2>
          <RecipeInput
          number={recipeCnt}
          onDownRecipe={downRecipeCnt}
          recipeDataset={recipeDataset}
          videoDataset={videoDataset}
          recipeTitles={videoTitles}
          recipeContents={videoContents}
          />
          <div className="btn-div">
            <Buttons
              btnType="default"
              value="레시피 추가하기"
              link={upRecipeCnt}
            />
          </div>
        </div>
        <Buttons btnType="default" value="클래스 삭제하기" link={HandleDeleteClass} />
        <Buttons btnType="default" value="클래스 수정하기" link={checkEditClass} />
      </div>
    </div>
  );
}
