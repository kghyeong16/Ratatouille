import {
  UPDATE_LOGIN_USERID, 
  UPDATE_LOGIN_PASSWORD, 
  UPDATE_LOGIN_ROLE, 
  UPDATE_LOGIN_NICKNAME, 
  UPDATE_LOGIN_PROFILE_IMG,
  UPDATE_LOGIN_USERPK
 } from "./types";

export const updateLoginUserId = (newLoginUserId) => ({
  type: UPDATE_LOGIN_USERID,
  payload: newLoginUserId,
})

export const updateLoginPassword = (newLoginPassword) => ({
  type: UPDATE_LOGIN_PASSWORD,
  payload: newLoginPassword
})

export const updateLoginRole = (newLoginRole) => ({
  type: UPDATE_LOGIN_ROLE,
  payload: newLoginRole
})

export const updateLoginNickname = (newLoginNickname) => ({
  type: UPDATE_LOGIN_NICKNAME,
  payload: newLoginNickname
})

export const updateLoginProfileImg = (newLoginProfileImg) => ({
  type: UPDATE_LOGIN_PROFILE_IMG,
  payload: newLoginProfileImg
})

export const updateLoginUserpk = (newLoginUserpk) => ({
  type: UPDATE_LOGIN_USERPK,
  payload: newLoginUserpk
})