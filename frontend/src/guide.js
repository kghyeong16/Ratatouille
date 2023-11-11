import React, { useEffect, useState } from "react";
import api from "./interceptors/axios";
import "./guide.css";
import Button from '@mui/material/Button';

export default function Guide(props) {
  const [videosData, setVideosData] = useState([]);
  const [videoTitles, setVideoTitles] = useState([]);
  const [videoContents, setVideoContents] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    console.log(props.id);
    if(props.id){
    const fetchGuideData = async () => {
      try{
        const {data} = await api.get(`/api/lesson/${props.id}`)
        console.log(data)
        setVideosData(data.videoUrls)
        setVideoTitles(data.videoTitles)
        setVideoContents(data.videoContents);
        console.log(data.videoUrls); // 데이터 로그 출력

      } catch(error) {
        console.error("데이터못불러왔어요!");
      }
    }
    fetchGuideData()
    }
  }, [props.id]);
  useEffect(()=>{
    setCurrentVideoIndex(currentVideoIndex);
    props.onProgChange(currentVideoIndex)
  },[currentVideoIndex])
  
  const handleVideoEnd = () => {
    if (currentVideoIndex < videosData.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handleTitleClick = (index) => {
    setCurrentVideoIndex(index);
    console.log(currentVideoIndex);
  };

  return (
    <div>
      <div className="video-container">
        <div className="title-container">
          <div className="video-title-list">
            {videoTitles.map((title, index) => (
              <div
                key={index}
                className={`video-title ${currentVideoIndex === index ? "highlight" : ""}`}
                onClick={() => handleTitleClick(index)}
              >
                {index+1}. {title}
              </div>
            ))}
          </div>
        </div>
        <div className="video-player">
          {videosData.length > 0 && (
            <video
              width="800px"
              height="450px"
              controls
              autoPlay
              onEnded={handleVideoEnd}
              src={videosData[currentVideoIndex]}
            />
          )}
        </div>
        <div className="content-container">
          <div className="video-content">
            {currentVideoIndex+1}. {videoTitles[currentVideoIndex]}
            <hr></hr>
            {videoContents[currentVideoIndex]}
          </div>  
        </div>
      </div>
    </div>
  );
};