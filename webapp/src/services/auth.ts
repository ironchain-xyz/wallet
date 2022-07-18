import { Store } from 'vuex';
import axios from 'axios';
import { State, store } from "../store";
import { authHeader } from './utils';
import { API_URL } from '../lib/constants';

function validateEmail(email: string): boolean {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
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
    const url = API_URL + "auth/isRegistered";
    const res = await axios.get(url, {params: {email}});
    return res.data.result;
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
    if (invitationCode.length == 0) {
        throw new Error("Invalid invitation code");
    }
    const url = API_URL + "auth/register";
    return await axios.post(url, { email, username, invitationCode });
}

export async function sendOTP(
    store: Store<State>,
    email: string
): Promise<{data: {existingOTP: string, sentAt: number}}> {
    const url = API_URL + "auth/passcode";
    return await axios.post(url, { email });
}

export async function verifyOTP(store: Store<State>, email: string, passcode: string): Promise<void> {
    const url = API_URL + "auth/verify";
    const res = await axios.post(url, { email, passcode });
    store.commit('setUser', {
        id: res.data.id,
        email: res.data.email,
        jwt: res.data.jwt,
        username: res.data.username,
    });
}

export async function logout(store: Store<State>) {
    const url = API_URL + "logout";
    try {
        await axios.post(url, {}, { headers: authHeader(store) });
    } catch (err: any) {
        console.log("logout error: " + err);
    } finally {   
        store.commit('setUser', {});
        store.commit('setSubscription', {});
    }
}

export function authenticated(store: Store<State>) {
    if (store.state.user) {
        return true;
    }
    store.commit("unsetUser");
    return false;
}