import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { JWT, State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';
import router from '../router';

function validateEmail(email: string): boolean {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePasscode(passcode: string): boolean {
    return /^[0-9A-Za-z]{6}$/.test(passcode);
}

function epoch(): number {
    return Math.floor(new Date().getTime() / 1000);
}

function validateUsername(username: string): boolean {
    return /^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$/.test(username);
}

export function warnExistingOTP(sentAt: number): string {
    const waiting = epoch() - sentAt;
    return `The passcode was sent ${waiting} seconds ago, you can retry in ${60 - waiting} senconds`
}

export async function isRegistered(
    store: Store<State>,
    email: string
): Promise<boolean> {
    if (!validateEmail(email)) {
        throw new Error("Invalid Email");
    }
    return false;
}

export async function register(
    store: Store<State>,
    email: string,
    username: string,
    invitationCode: string
): Promise<void> {
    if (!validateUsername(username)) {
        throw new Error("Invalid username");
    }
    const url = API_URL + "auth/register";
    try {
        await axios.post(url, { email, username, invitationCode });
        store.commit("setUser", { email });
    } catch (err: any) {
        console.log("register error: " + err);
        throw new Error("Server Error");
    }
}

export async function sendOTP(
    store: Store<State>,
    email: string
): Promise<{data: {existingOTP: string, sentAt: number}}> {
    const url = API_URL + "auth/passcode";
    try {
        const res = await axios.post(url, { email });
        store.commit("setUser", {
            email,
            otp: {
                sentAt: res.data.sentAt,
                existing: res.data.existingOTP
            }
        });
        return res;
    } catch (err: any) {
        console.log("failed to send otp with error: " + err);
        throw new Error("Server Error");
    }
}

export async function verifyOTP(store: Store<State>, passcode: string): Promise<void> {
    const url = API_URL + "auth/verify";
    try {
        const res = await axios.post(url, { email: store.state.user!.email, passcode });
        store.commit('setUser', {
            id: res.data.id,
            email: res.data.email,
            jwt: res.data.jwt,
            profile: {username: res.data.username}
        });
    } catch (err: any) {
        console.log("failed to send otp with error: " + err);
        throw new Error("Server Error");
    }
}

export async function logout(store: Store<State>) {
    const url = API_URL + "logout";
    try {
        await axios.post(url, {}, { headers: authHeader(store) });
    } catch (err: any) {
        console.log("logout error: " + err);
    } finally {   
        store.commit('setUser', {});
    }
}

export function authenticate(store: Store<State>) {
    if (!store.state.user?.jwt) {
        store.commit("clear");
        return false;
    }
    return true;
}