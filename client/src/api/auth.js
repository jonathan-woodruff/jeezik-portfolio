/* This file sends requests to the server using axios for token-based requests */
import { SERVER_URL } from '../constants/index';
import axios from 'axios';
axios.defaults.withCredentials = true; //send the cookie back to the server with token

export async function onRegistration(registrationData) {
    return await axios.post(`${SERVER_URL}/auth/register`, registrationData);
};

export async function onLogin(loginData) {
    return await axios.post(`${SERVER_URL}/auth/login`, loginData);
};

export async function onLogout() {
    return await axios.get(`${SERVER_URL}/auth/logout`);
}