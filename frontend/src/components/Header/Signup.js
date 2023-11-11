import React, { useState } from "react";
import SelectRole from "./SelectRole";
import Button from '@mui/material/Button';
import "./styles.css";
import axios from 'axios';
import { Container, createTheme, CssBaseline, Grid, TextField, ThemeProvider, Typography } from "@mui/material";
import Box from '@mui/material/Box'

const defaultTheme = createTheme()
export default function Signup({setModalContent}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('')
  const [roleSelected, setRoleSelected] = useState(false)
  const [executed, setExecuted] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState(false)

  const checkNickname = async () => {
    try {
      if (nickname) {
        const {data} = await axios.get(`/api/user/nickname/${nickname}`)
        if (data.check) {
          setNicknameCheck(true)
          alert('사용 가능한 닉네임입니다!')
        } else {
          setNicknameCheck(false)
          alert('이미 사용 중인 닉네임입니다!')
        }
      } else {
        alert('닉네임을 입력해주세요!')
      }
    } catch (err) {
      setNicknameCheck(false)
      alert('이미 사용 중인 닉네임입니다!')
    }
  }

  const HandleSignup = async event =>{
    event.preventDefault();

    const userData = { email, password, nickname, phoneNumber, name, role
    };
    try{
      if (nicknameCheck) {
        Object.keys(userData).forEach(function(v){
          if(userData[v].replace(/(\s*)/g,'').split('') ==''){
            window.alert("입력을 다시 확인해주세요");
            throw new Error("stop");
          }
        })
        await axios.post("/api/user", userData);
        setExecuted(true);
      } else {
        alert('닉네임 중복 확인을 실행해주세요!')
      }
    }
    catch(e){
      alert('이미 사용 중인 이메일입니다!')
    }
  };

  if (executed) {
    return setModalContent('Login')
  }

  return (
    <div className="modal-container">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="500px">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 3,
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
            }}>
        <Typography id="signup-modal-title" component="h1" variant="h5">회원가입</Typography>
        <Typography id="signup-modal-description">아래의 정보를 입력하여 회원가입을 완료하세요!</Typography>
        <Box component="form" onSubmit={ HandleSignup } 
          sx={{ mt: 3 }}>
          <div className="set-data">
            {roleSelected ? (
              <Grid container className="signup-form" spacing={3} >
                <Grid item xs={12}>
                <TextField type="text" label="이름" fullWidth onChange={ e => setName(e.target.value) } />
                </Grid>
                <Grid item xs={12}>
                <TextField id="email" type="email" label="이메일" fullWidth onChange={ e => setEmail(e.target.value) } />
                </Grid>
                <Grid item xs={12}>
                <TextField id="password" type="password"  label="비밀번호" fullWidth onChange={ e => setPassword(e.target.value) } />
                </Grid>
                <Grid item container xs={12} sx={{justifyContent:"space-between"}}>
                  <Grid item xs={12} md={7}>
                    <TextField id="username" type="text"  label="닉네임" fullWidth onChange={ e => setNickname(e.target.value) } />
                  </Grid>
                  <Grid item>
                    <Button className="duplicate-check" onClick={checkNickname}
                    sx={{height:'100%', marginTop:0,marginBottom:0}}>중복 확인</Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField  type="tel" name="tlno" id="tlno" defaultValue="010-" label="전화번호" fullWidth title="전화번호를 입력하세요." placeholder="ex)010-1234-5678" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}" maxLength="13" onChange={ e => setPhoneNumber(e.target.value) } />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained">Signup</Button>
                </Grid>
              </Grid>
            ) : (
              <SelectRole setRole={setRole} setRoleSelected={setRoleSelected} />
            )}
          </div>
        </Box>
        </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
};