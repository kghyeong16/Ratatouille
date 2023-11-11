import React, { useState, useCallback } from "react";
import "./styles.css";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { updateAuth } from "../../actions/authActions";
import { updateLoginUserId, updateLoginPassword, updateLoginRole, updateLoginNickname,updateLoginProfileImg, updateLoginUserpk } from "../../actions/loginInfoActions";
import { updateLoggedIn } from "../../actions/loginAction";
import { useLocation } from "react-router-dom";
import { Box, Button, Container, CssBaseline, Grid, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
// import useDidMountEffect from "../../hooks/useDidMountEffect";
const defaultTheme = createTheme()
export default function Login({handleCloseModal}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState("NULL")
  const [role, setRole] = useState("")
  const [nickname, setNickname] = useState("")
  const [profileImg, setProfileImg] = useState("")
  const [userPk, setUserPk] = useState("")
  const [executed, setExecuted] = useState(false);
  const dispatch = useDispatch()

  const handleUpdateLogin = useCallback(() => {    
    dispatch(updateAuth(accessToken));
    dispatch(updateLoginUserId(userId));
    dispatch(updateLoginPassword(password));
    dispatch(updateLoginRole(role));
    dispatch(updateLoginUserpk(userPk))
    dispatch(updateLoginNickname(nickname));
    dispatch(updateLoginProfileImg(profileImg));
    dispatch(updateLoggedIn(true));

  }, [accessToken, userId, password, role, userPk, nickname, profileImg, dispatch, ]);


  const location = useLocation();

  const HandleLogin = async event =>{
    event.preventDefault();
    
    const userData = { userId, password, };

    try {
      const {data} = await axios.post("/api/user/login", userData, {withCredentials: true});
      localStorage.setItem('refreshToken', data.refreshToken)
      setAccessToken(data.accessToken)
      setRole(data.role)
      setNickname(data.nickname)
      setProfileImg(data.profileImg)
      setUserPk(data.id)
      setExecuted(true);

    } catch (error) {
      alert("로그인 정보가 맞지 않습니다!\n로그인 정보를 다시 입력해주세요.")
    }
  }

  if (executed) {
    handleUpdateLogin()
    handleCloseModal();
    setExecuted(false)
  }

  return (
    <div className="modal-container">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Box
            sx={{marginTop: 3,
            display:'flex',
            flexDirection:'column',
            alignItems:'center',}}>
              <Typography id="login-modal-title" component="h1" variant="h5">로그인</Typography>
              <Typography id="login-modal-description" component="h2" variant="h6">환영합니다!</Typography>
              <Box component="form" className="login-form" onSubmit={ HandleLogin } sx={{ mt: 3 }}>
                <Grid container spacing={4}>
                  
                  <Grid item xs={12}>
                    <TextField type="text" label="이메일" fullWidth onChange={ e => setUserId(e.target.value)} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField type="password"label="비밀번호" fullWidth onChange={ e => setPassword(e.target.value)} />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained">Login</Button>
                  </Grid>
                </Grid>
              </Box>
          </Box>
        </Container>
      </ThemeProvider>
  </div>
  )
};
