import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  auth: null,
  loginUserId: "",
  loginPassword: "",
  loginRole: "",
  loginNickname: "",
  loginProfileImg: "",
  loginUserpk: null,
  isLoggedIn: false,
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'loginUserId',
    'loginPassword',
    'loginRole',
    'loginNickname',
    'loginProfileImg',
    'loginUserpk',
    'isLoggedIn',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: initialState,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export {store};