import axios from 'axios';
import { API_URL as PROD_URL, API_URL_IOS, API_URL_ANDROID, STAGE } from '@env';
import { Platform } from 'react-native';

export const API_URL = 
    (STAGE === 'production')
        ? PROD_URL
        : Platform.OS === 'ios'
            ? API_URL_IOS
            : API_URL_ANDROID;

const cdlcmtzEatsApi = axios.create({
    baseUrl: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

//TODO: Interceptors

export {
    cdlcmtzEatsApi,
}