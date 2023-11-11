import axios from "axios";
import { store, persistor } from "../store/configureStore";
import { updateAuth } from "../actions/authActions";

const api = axios.create({
  headers: {
    accept: "application/json"
  },
  withCredentials: true,
})

const refreshTokens = async (data) => {
  const response = await axios.post('/api/user/refresh', data);
  if (response.data.accessToken !== "NULL" && response.data.refreshToken !== "NULL" ) {
      store.dispatch(updateAuth(response.data.accessToken));
  } else {
    axios.post('/api/user/logout')
    localStorage.removeItem("refreshToken")
    persistor.purge()
    alert("token expired\n홈으로 돌아갑니다.");
    window.location.href = '/';
  };
};

api.interceptors.request.use(
  function (config) {
    const accessToken = store.getState().auth;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      config.headers["Authorization"] = `Bearer ${accessToken}`
      config.headers["refreshToken"] = `${refreshToken}`
    } catch(error) {
      throw error;
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
)

api.interceptors.response.use(
(response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 403 ) {
      try {
        const loginData = {
          'userId':store.getState().loginUserId,
          'password': store.getState().loginPassword
        }
        await refreshTokens(loginData);
        const accessToken = store.getState().auth;
        if (accessToken !== "NULL") { 
          const originalRequest = error.response?.config;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      } catch (error) {
        throw error;
      } 
    }
    return Promise.reject(error);
  }
);

export default api;