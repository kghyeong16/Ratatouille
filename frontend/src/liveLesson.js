import { OpenVidu } from 'openvidu-browser';
import api from './interceptors/axios';
import React, { useState, useEffect, useCallback } from 'react';
import './liveLesson.css';
import UserVideoComponent from './components/UserVideo/UserVideoComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from "@mui/material/Modal";
import Button from '@mui/material/Button';
import Guide from './guide';
import createSession from './createSession';
import OverlayLoading from './components/Loading';

export default function LiveLesson() {
  const [mySessionId, setMySessionId] = useState('');
  const [myUserName, setMyUserName] = useState('');
  const [title, setTitle] = useState('');
  const [session, setSession] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [progress,setProgress] = useState(new Map());
  const [liveOn, setLiveOn] = useState(false);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [recordStatus, setRecordStatus] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [text, setText]= useState('');
  const [questionList, setQuestionList] = useState([]);
  const [mode, setMode] = useState(0) // 0 일반 모드, 1 질문 답변 모드, 2 수강생 확인 모드(강의자인 경우)
  const loginNickname =useSelector(store => store.loginNickname)
  const loginRole =useSelector(store => store.loginRole)
  const loginId = useSelector(store => store.loginUserpk)
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();


  useEffect(() => {
    try{
      setMySessionId(location.state.id)
      setMyUserName(loginNickname);
      setTitle(location.state.title);
      
    }
    catch(Error){
    }

    

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
    
  }, []);
  useEffect(() =>{
    if(mySessionId){
      try{
        startLive();
      }
      catch(Error){
      }    
    }
  },[mySessionId])
  
  useEffect(()=>{
  }, [progress])

  useEffect(() =>{
  },[mode])


  const onBeforeUnload = (event) => {
    leaveSession();
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((subscriber) => subscriber !== streamManager)
    );
  };

  const endLesson = () =>{
    const signalData = { 
      type:'endLesson'
    }
    session.signal(signalData
    ).then((res)=>{

    })
    .catch(error =>{
    })
  }

  const sendQuestion = async()=>{
    const signalData = { 
      type:'question',
      data: JSON.stringify({sender: myUserName, 
                            to:'1'}),

    }
    session.signal(signalData
    ).then((res)=>{

    })
    .catch(error =>{
    })
  }
  const joinSession = async () => {
    const ov = new OpenVidu();
    const mySession = ov.initSession();

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      const data =JSON.parse(subscriber.stream.connection.data);
      const tmp = new Map(progress);
      tmp.set(data["userName"], 0)
      setProgress(tmp)
      
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on('exception', (exception) => {
    });

    mySession.on('signal:question', (event)=>{
      const questionData = JSON.parse(event.data);
      const tutee = questionData.sender;
      if(tutee == myUserName && questionList.length != 0){
        window.alert("현재 질문 답변 중입니다")
      }
      else{
        if(questionData.to == loginRole){
          window.alert(tutee + "수강자가 질문을 보냈습니다.");
        }
        // 질문 리스트에 추가
        const tmplst = questionList
        tmplst.push(tutee)
        setQuestionList(tmplst)
        if(tutee == myUserName || loginRole == 1){
          startQuestionMode();
        }
      }
    })
    mySession.on('signal:endquestion', (event)=>{
      const newList = questionList.shift(); 
      setQuestionList(newList);
      setMode(0);
    })
    mySession.on('signal:endLesson', ()=>{
      leaveSession();
    })

    mySession.on('signal:progress', (event)=>{
      const progressData = JSON.parse(event.data);
      if(loginRole == '1'){
        const newMap = new Map(progress)
        newMap.set(progressData["sender"], progressData["nowProg"])
        setProgress(newMap)
      }
    })
    try {
      const token = await getToken();
      if(token ==undefined){
        throw new Error;
      }
      mySession.connect(token, { userId: loginId, userName : myUserName, userRole: loginRole});

      const publisher = await ov.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '320x320',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });

      mySession.publish(publisher);

      const devices = await ov.getDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

      setSession(mySession);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);
    } catch (error) {
    }
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setSubscribers([]);
    setMyUserName('');
    setMainStreamManager(null);
    setPublisher(null);
    setLiveOn(false);
    setPublisher(null);
    setProgress(new Map());
    setLiveOn(false);
    setCurrentVideoDevice(null);
    setRecordStatus(false);
    setRecordId('');
    setQuestionList([]);
    setMode(0) // 0 일반 모드
    window.location.replace(`/detail/${mySessionId}`)
  };
  function startLive(){
    setLiveOn(true);
    joinSession();
  }
  const startRecord = async () =>{
    setRecordStatus(true);
    const response = await api.post('/api/sessions/record/start', {lessonId: mySessionId} );

    setRecordId(response.data);
  }

  const stopRecord = async () =>{
    setIsLoading(true)
    const response = await api.post('/api/sessions/record/stop', {recordingId: mySessionId} );
    setRecordStatus(false);
    setIsLoading(false)
  }

  const startQuestionMode= () =>{
    setMode(1);
  }

  const stopQuestionMode = ()=>{

    const signalData = { 
      type:'endquestion',
    }
    session.signal(signalData
    ).then((res)=>{
    })
    .catch(error =>{
    })
    setMode(0);
  }
  const getToken = async () => {
    try{
      const sessionId = await createSession(mySessionId);
      return await createToken(sessionId);
    }
    catch(error){
      if(error.response.status == '401'){
        window.alert("강의실이 생성되지 않았습니다")
        window.location.replace(`/detail/${mySessionId}`)
      }
    }
  };
  
  const createToken = async (sessionId) => {
    const response = await api.post(
      '/api/sessions/' + sessionId + '/generate-token',
      {} 
    );
    return response.data; // The token
  };
  const handleProgChange = useCallback((prog)=>{
    if(session){
      //진도 전달
      const signalData = { 
        type:'progress',
        data: JSON.stringify({sender: myUserName, 
                              nowProg:prog}),
      }
      session.signal(signalData
      ).then(()=>{

      })
      .catch(error =>{
      })
    }
  })
  return (
    <div>
      {     
        session !== null ? (
          <div className="container">
            
            
            {mode == 0 ?
              <div>
                <div>
                {loginRole == "1"?
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight:`5px`}}>
                    <span style={{ lineHeight: '50px', fontSize:`30px`, fontWeight:`800`}}>{title}</span>
                    <div style={{ display: 'flex', justifyContent: 'flex-end',}}>
                   <Button id='livebutton' onClick={()=>setMode(2)}>수강생 화면 확인</Button>
                    <Button id='livebutton'onClick={endLesson}>강의 종료</Button>
                  
                    {recordStatus == false ?
                      <Button id='livebutton' onClick={startRecord} >녹화 시작</Button>
                    :
                      <Button id='livebutton' onClick={stopRecord}>녹화 종료</Button>
                    }
                    <Button onClick={()=>setIsModalOpen(true)}  id='livebutton'> 카메라 확인</Button>
                    </div>
                  </div>
                  :
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight:`5px`}}>
                    <span style={{ lineHeight: '50px', fontSize:`30px`, fontWeight:`800`}}>{title}</span>
                    <div style={{ display: 'flex', justifyContent: 'flex-end',}}>
                      <Button id='livebutton' onClick={sendQuestion}>질문하기</Button>
                      <Button id='livebutton' onClick={()=>setMode(1)}>질문방 확인</Button>
                      <Button id='livebutton' onClick={leaveSession}>강의실 나가기</Button>
                      <Button onClick={()=>setIsModalOpen(true)}  id='livebutton'> 카메라 확인</Button>
                    </div>
                  </div>
                }
                </div>
                  <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      id="modal-content"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80%', // 원하시는 대로 너비 조절
                        borderRadius: '8px',
                      }}
                    >
                      <div id="videowrapper" style={{ width: '100%' }}>
                        <div>Camera Check</div>
                        <UserVideoComponent streamManager={publisher} style={{ position: 'absolute', width: '100%', height: '100%', padding:10, borderRadius: '8px',}} />
                      </div>
                    </div>
                  </Modal>
                
                <Guide id = {mySessionId} onProgChange={handleProgChange} ></Guide>
              </div>
              :
              mode == 1?
                <div id="session">
                  <div id="session-header">
                    <h1 id="session-title">{title}</h1>
                    {questionList[0] == myUserName || loginRole == 1?
                      <Button  id='livebutton' onClick={stopQuestionMode}>질문 모드 종료</Button>
                      :
                      <Button  id='livebutton' onClick={()=> setMode(0)}>질문방 나가기</Button>
                    }
                  </div>
                  <div class="container">
                    <div class="video-grid">
                    {loginRole == 1?
                      <div>
                        {publisher !== null ? (
                          <div id="videowrapper">
                            <div style={{justifyContent:`space-between` ,display:`flex`}}>
                              <div>
                                <span  style={{ fontSize:`24px`, textAlign:`left`, }}>
                                  <strong>{myUserName}</strong>&nbsp;님
                                </span>
                              </div>
                            </div>
                              <UserVideoComponent streamManager={publisher} />
                            </div>
                          
                        ) : null}
                      </div>
                      :null
                    }
                      {myUserName == questionList[0]?
                        publisher !== null ? (
                          <div id="videowrapper">
                            <div style={{justifyContent:`space-between` ,display:`flex`}}>
                              <div>
                                <span  style={{ fontSize:`24px`, textAlign:`left`, }}>
                                  <strong>{myUserName}</strong>&nbsp;님
                                </span>
                              </div>
                            </div>
                            <UserVideoComponent streamManager={publisher} />
                          </div>
                        ) : null
                      :null}
                      <div>
                        {
                        subscribers.map((sub, i) => (
                          JSON.parse(sub.stream.connection.data)["userRole"] == 1 || JSON.parse(sub.stream.connection.data)["userName"] == questionList[0] ? 
                          <div key={sub.id} id="videowrapper" class="user-video-wrapper">
                            <div style={{justifyContent:`space-between` ,display:`flex`}}>
                              <div>
                                <span  style={{ fontSize:`24px`, textAlign:`left`, }}>
                                  <strong>{JSON.parse(sub.stream.connection.data)["userName"]}</strong>&nbsp;님
                                </span>
                              </div>
                            </div>
                            <UserVideoComponent streamManager={sub} />
                         </div>: null
                        ))
                        }
                      </div>
                  </div>
                  </div>
                </div>:
                //mode == 2
                <div id="session">
                  <div id="session-header">
                    <h1 id="session-title">{title}</h1>
                    <Button id='livebutton' onClick={() => setMode(0)}>뒤로 가기</Button>
                  </div>
                    <div class="container">
                      <div class="video-grid">
                        {/* {loginRole == 2?
                        (publisher !== null ? (
                          <div id="videowrapper">
                            <UserVideoComponent streamManager={publisher} />
                            <span>{loginNickname}님</span>
                          </div>
                          ) : null)
                          :null
                        } */}
                        
                        {subscribers.map((sub, i) => (
                          
                         <div key={sub.id} id="videowrapper" class="user-video-wrapper">
                          <div style={{justifyContent:`space-between` ,display:`flex`}}>
                            <div>
                              <span  style={{ fontSize:`24px`, textAlign:`left`, }}>
                                <strong>{JSON.parse(sub.stream.connection.data)["userName"]}</strong>&nbsp;님
                              </span>
                            </div>
                            <div>
                              {progress.get(JSON.parse(sub.stream.connection.data)["userName"]) ?
                              <span>현재 진행 단계 : {progress.get(JSON.parse(sub.stream.connection.data)["userName"])+ 1}</span>:
                              <span>현재 진행 단계 : 1</span>
                              }
                            </div>
                          </div>
                          <UserVideoComponent streamManager={sub} />
                         </div> 
                          ))}
                      </div>
                    </div>
                  </div>
            }
          </div>
        ) : null}
        {isLoading ? <OverlayLoading /> : null}
        </div>
  );
}
