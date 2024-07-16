// components/check_token.js

import axios from 'axios';

export const checkToken = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            const response = await axios.post('http://localhost:8000/api/refresh');
            const newToken = response.data.access_token;
            localStorage.setItem('token', newToken); 
            return newToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            localStorage.removeItem('token'); 
            throw error; 
        }
    } else {
        throw new Error('No token found'); 
    }
};
