import { UPDATE_AUTH } from './types';

export const updateAuth = (newAuth) => ({
  type: UPDATE_AUTH,
  payload: newAuth,
});