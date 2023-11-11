import api from './interceptors/axios';
export default async function  createSession  (sessionId){
    const response = await api.post('/api/sessions', {customSessionId:sessionId} );
    return response.data; // The sessionId
};