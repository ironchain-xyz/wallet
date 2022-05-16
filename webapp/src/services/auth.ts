import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { JWT, State } from "../store";
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
    const hide = message.loading({ content: 'sending passcode...', key });
    const url = store.state.API_URL + "auth/passcode";
    axios.post(url, {email})
    .then((res: AxiosResponse<{sentAt: number}>) => {
        store.commit("setUser", {email, otpSentAt: res.data.sentAt});
        hide();
        router.push('/verify');
    }).catch(err => messageError(key, err))
}

export function verifyOTP(store: Store<State>, passcode: string) {
    if (!validatePasscode(passcode)) {
        return message.error("please input a valid passcode");
    }

    const key = "verifyOTP";
    const hide = message.loading({ content: 'logging in...', key });
    const url = store.state.API_URL + "auth/verify";
    axios.post(
        url, {email: store.state.user!.email, passcode}
    ).then((res: AxiosResponse<{email: string, jwt: JWT, username: string}>) => {
        store.commit('setUser', {email: res.data.email, jwt: res.data.jwt});
        store.commit('setProfile', {username: res.data.username});
        hide();
        router.push('/');
    }).catch(err => messageError(key, err))
}

export function logout(store: Store<State>) {
    const key = "logout";
    const hide = message.loading({ content: 'logging out...', key });
    const url = store.state.API_URL + "logout";
    axios.post(
        url, {headers: authHeader(store)}
    ).then((res: AxiosResponse<{ok: true}>) => {
        hide();
    }).catch(err => messageError(key, err))
    .finally(() => {
        store.commit('setUser', undefined);
        router.push("/login");
    });
}

export function authenticate(store: Store<State>) {
    if (!store.state.user?.email || !store.state.user?.jwt) { 
        store.commit("clear");
        router.push('/login');
        return false;
    }
    return true;
}