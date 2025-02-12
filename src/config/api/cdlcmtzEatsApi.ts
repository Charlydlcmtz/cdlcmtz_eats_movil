import axios from 'axios';
import { API_URL as PROD_URL, API_URL_IOS, API_URL_ANDROID, STAGE } from '@env';
import { Platform } from 'react-native';
import { StoragerAdapter } from '../adapters/storage-adapter';

export const API_URL = 
    (STAGE === 'production')
        ? PROD_URL
        : Platform.OS === 'ios'
            ? API_URL_IOS
            : API_URL_ANDROID;

const cdlcmtzEatsApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

//TODO: Interceptors
cdlcmtzEatsApi.interceptors.request.use(
    async (config) => {

        const token = await StoragerAdapter.getItem('token');
        if ( token ) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    }
);

export {
    cdlcmtzEatsApi,
}