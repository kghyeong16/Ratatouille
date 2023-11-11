import { UPDATE_LOGGED_IN } from "./types";

export const updateLoggedIn = (loginState) => ({
  type: UPDATE_LOGGED_IN,
  payload: loginState,
})