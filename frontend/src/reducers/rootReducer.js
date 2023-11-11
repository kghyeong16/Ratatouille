import { combineReducers } from 'redux';
import { 
  UPDATE_AUTH, 
  UPDATE_LOGIN_USERID, 
  UPDATE_LOGIN_PASSWORD, 
  UPDATE_LOGIN_ROLE, 
  UPDATE_LOGIN_NICKNAME, 
  UPDATE_LOGIN_PROFILE_IMG, 
  UPDATE_LOGIN_USERPK,
  UPDATE_LOGGED_IN } from '../actions/types';

const authReducer = (state = "NULL", action) => {
  switch (action.type) {
    case UPDATE_AUTH:
      return action.payload;
    default:
      return state;
  }
};

const loginUserIdReducer = (state = "", action) => {
  switch (action.type) {
    case UPDATE_LOGIN_USERID:
      return action.payload;
    default:
      return state;
  }
}

const loginPasswordReducer = (state = "", action) => {
  switch (action.type) {
    case UPDATE_LOGIN_PASSWORD:
      return action.payload;
    default:
      return state;
  }
} 

const loginRoleReducer = (state = "", action) => {
  switch (action.type) {
    case UPDATE_LOGIN_ROLE:
      return action.payload;
    default:
      return state;
  }
}

const loginNicknameReducer = (state = "", action) => {
  switch (action.type) {
    case UPDATE_LOGIN_NICKNAME:
      return action.payload;
    default:
      return state;
  }
}

const loginProfileImgReducer = (state = "", action) => {
  switch (action.type) {
    case UPDATE_LOGIN_PROFILE_IMG:
      return action.payload;
    default:
      return state;
  }
}

const loginUserpkReducer = (state = null, action) => {
  switch (action.type) {
    case UPDATE_LOGIN_USERPK:
      return action.payload;
    default:
      return state;
  }
}

const loggedInReducer = (state = false, action) => {
  switch (action.type) {
    case UPDATE_LOGGED_IN:
      console.log("로그인")
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  auth: authReducer,
  loginUserId: loginUserIdReducer,
  loginPassword: loginPasswordReducer,
  loginRole: loginRoleReducer,
  loginNickname: loginNicknameReducer,
  loginProfileImg: loginProfileImgReducer,
  loginUserpk: loginUserpkReducer,
  isLoggedIn: loggedInReducer,
});
