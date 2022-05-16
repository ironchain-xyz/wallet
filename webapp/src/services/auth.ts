import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { User, State } from "../store";
import router from '../router';
import { authHeader, messageError } from './utils';

function validateEmail(email: string) : boolean {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePasscode(passcode: string) : boolean {
    return /^[0-9A-Za-z]+6$/.test(passcode);
}

export function sendOTP(store: Store<State>, email: string) {
    if (!validateEmail(email)) {
        return message.error("please input a valid email address");
    }

    const key = "sendOTP";
    message.loading({ content: 'sending passcode...', key });
    const url = store.state.API_URL + "auth/passcode";
    axios.post(url, {email})
    .then((res: AxiosResponse<{sentAt: number}>) => {
        store.commit("setUser", {email, otpSentAt: res.data.sentAt});
        message.success({content: 'passcode is sent successfully', key, duration: 2});
        router.push('/verify');
    }).catch(err => {
        if (err.response && err.response.status == 400) {
            message.error(err.response.message);
        } else {
            message.error("failed to send code, unknown error");
        }
    });
}

export function verifyOTP(store: Store<State>, passcode: string) {
    if (!validatePasscode(passcode)) {
        return message.error("please input a valid passcode");
    }

    const key = "verifyOTP";
    message.loading({ content: 'verifying passcode...', key });
    const url = store.state.API_URL + "auth/verify";
    axios.post(
        url, {email: store.state.user!.email, passcode}
    ).then((res: AxiosResponse<User>) => {
        store.commit('setUser', res.data);
        router.push('/');
    }).catch(err => messageError(key, err))
}

export function logout(store: Store<State>) {
    const key = "logout";
    message.loading({ content: 'logging out...', key });
    const url = store.state.API_URL + "logout";
    axios.post(
        url, {headers: authHeader(store)}
    ).then((res: AxiosResponse<{ok: true}>) => {
        store.commit('setUser', undefined);
    }).catch(err => messageError(key, err))
}