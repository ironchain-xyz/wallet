import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { JWT, State } from "../store";
import router from '../router';
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';

function validateEmail(email: string): boolean {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePasscode(passcode: string): boolean {
    return /^[0-9A-Za-z]{6}$/.test(passcode);
}

function epoch(): number {
    return Math.floor(new Date().getTime() / 1000);
}

export function warnExistingOTP(sentAt: number): string {
    const waiting = epoch() - sentAt;
    return `The passcode was sent ${waiting} seconds ago, you can retry in ${60 - waiting} senconds`
}

export async function register(
    store: Store<State>,
    email: string,
    invitationCode: string
): Promise<string> {
    if (!validateEmail(email)) {
        return "please input a valid email address";
    }

    const key = "register";
    const hide1 = message.loading({ content: 'registering...', key });
    const url = API_URL + "auth/register";
    let msg = "";
    try {
        await axios.post(url, { email, invitationCode });
        store.commit("setUser", { email });
        hide1();
        const hide2 = message.success({
            content: 'saved, redirecting to login page...',
            key,
            duration: 1
        });
        setTimeout(() => {
            hide2();
            router.push('/login');
        }, 1000);
    } catch (err: any) {
        hide1();
        msg = parseErrorMsg(err);
    }
    return msg;
}

export async function sendOTP(store: Store<State>, email: string): Promise<string> {
    if (!validateEmail(email)) {
        return "please input a valid email address";
    }

    const key = "sendOTP";
    const hide = message.loading({ content: 'sending passcode...', key });
    const url = API_URL + "auth/passcode";
    let msg = "";
    try {
        const res = await axios.post(url, { email });
        if (res.data.existingOTP) {
            msg = warnExistingOTP(res.data.sentAt);
        }
        store.commit("setUser", {
            email,
            otp: {
                sentAt: res.data.sentAt,
                existing: res.data.existingOTP
            }
        });
    } catch (err: any) {
        msg = parseErrorMsg(err);
    }
    hide();
    return msg;
}

export async function verifyOTP(store: Store<State>, passcode: string): Promise<string> {
    if (!validatePasscode(passcode)) {
        return "please input a valid passcode";
    }

    const key = "verifyOTP";
    const hide = message.loading({ content: 'logging in...', key });
    const url = API_URL + "auth/verify";
    let msg = "";
    try {
        const res = await axios.post(url, { email: store.state.user!.email, passcode });
        store.commit('setUser', { id: res.data.id, email: res.data.email, jwt: res.data.jwt });
        store.commit('setProfile', { username: res.data.username });
    } catch (err: any) {
        msg = parseErrorMsg(err);
    }
    hide();
    return msg;
}

export async function logout(store: Store<State>) {
    const key = "logout";
    const url = API_URL + "logout";
    try {
        const res = await axios.post(url, {}, { headers: authHeader(store) });
    } catch (err: any) {
        console.log("logout error: ");
        console.log(err);
    }
    store.commit('setUser', {});
    router.push("/login");
}

export function authenticate(store: Store<State>) {
    if (!store.state.user?.jwt) {
        store.commit("clear");
        return false;
    }
    return true;
}