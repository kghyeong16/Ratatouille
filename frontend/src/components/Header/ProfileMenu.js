import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Modal from "@mui/material/Modal";
import Login from "./Login";
import Signup from "./Signup";
// import api from "../../interceptors/axios";
// import Buttons from "../Buttons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { persistor } from "../../store/configureStore";
import "./styles.css";
import axios from "axios";
import { Box } from "@mui/material";

const style = {
  position:'absolute',
  top: '35%',
  left:'50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 500,
}

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loginStatus = useSelector((state) => state.isLoggedIn)
  const userId = useSelector((state) => state.loginUserpk); // Redux 스토어에서 userId 추출
  const userRole = useSelector((state) => state.loginRole)
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 모달 구조 : 열린 모달 내에서 내용을 바꾸는 방식
  const handleOpenSignupModal = () => {
    setIsModalOpen(true);
    setModalContent('Signup');
    setAnchorEl(null);
  };

  const handleOpenLoginModal = () => {
    setIsModalOpen(true);
    setModalContent('Login');
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const handleModalContent = () => {

    if(modalContent === 'Signup') {
      return (
        <Signup setModalContent={setModalContent} />
      )
    } else if(modalContent === 'Login') {
      return (
        <Login handleCloseModal={handleCloseModal} />
      )
    } else {
      return null
    }
  }
  
  const confirmLogout = () => {
    setAnchorEl(null);
    if (window.confirm("로그아웃 하시겠습니까?")) {
      handleLogOut()
    }
  }

  const handleLogOut = () => {
    axios.post('/api/user/logout')
    localStorage.removeItem("refreshToken")
    persistor.purge()
    window.location.href = "/"
  };

  const moveToMyPage = () => {
    window.location.href = `/user/${userId}`
  }

  const moveToClassCreate = () => {
    window.location.href = "/class/create"
  }


  const moveToLiveTest = () =>{
    window.location.href = "/livetest"
  }

  return (
    <div>
      {/* <div
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="profile-menu-flex"
      >
        <MenuRoundedIcon />
        <AccountCircleRoundedIcon />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          ".MuiPaper-root": {
            minWidth: "200px",
            borderRadius: "1rem",
            boxShadow: "0 1px 2px rgb(0 0 0 / 8%), 0 4px 12px rgb(0 0 0 / 5%)",
          },
        }}
      > */}
      <div className="menu-container">
      <div className="if-logged-in">
        {/* 로그인 상태에 따른 메뉴 변화 */}
        { loginStatus
          ? <div className="is-logged-in">
              <MenuItem className="menu-items" onClick={moveToMyPage} >
                MyPage
              </MenuItem>
              <div className="if-tutor">
                { userRole == '1'
                ? <div className="is-tutor">
                <MenuItem className="menu-items" onClick={moveToClassCreate}>
                  클래스 생성하기
                </MenuItem>
                </div>
                : null  
                }
            </div>
            <MenuItem className="menu-items" onClick={confirmLogout}>
              로그아웃
            </MenuItem>
            
            </div>
        : <div className="not-logged-in">
            <MenuItem className="menu-items" onClick={handleOpenSignupModal}>
              Signup
            </MenuItem>
            <MenuItem onClick={handleOpenLoginModal} className="menu-items">
              Login
            </MenuItem>
          </div>
        }
      </div>
        {/* <div
          style={{
            height: "1px",
            backgroundColor: "var(--grey)",
            width: "100%",
          }}
        /> */}
        {/* <MenuItem onClick={handleClose} className="menu-items">
          FAQ
        </MenuItem> */}
      </div>
      
      
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{...style}}>
          {handleModalContent()}
        </Box>
      </Modal>
    </div>
  );
}
