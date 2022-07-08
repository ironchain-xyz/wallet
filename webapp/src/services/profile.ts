
import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { User, State } from "../store";
import router from '../router';
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';

function validateUsername(username: string): boolean {
    return /^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$/.test(username);
}

export async function initProfile(
    store: Store<State>,
    profile: { username: string }
): Promise<void> {
    if (!validateUsername(profile.username)) {
        throw new Error("Invalid username");
    }
    const url = API_URL + "profile/init";
    try {
        const res = await axios.post(url, profile, { headers: authHeader(store) });
        store.commit('setProfile', profile);
    } catch (err: any) {
        console.log("failed to init profile with err " + err);
        throw new Error("Server Error");
    }
}

export async function updateUsername(store: Store<State>, username: string): Promise<boolean> {
    if (!validateUsername(username)) {
        message.error("please input a valid username");
    }

    const key = "setUsername";
    message.loading({ content: 'saving...', key, duration: 0 });
    const url = API_URL + "profile/setusername";
    try {
        const res = await axios.post(url, { username }, { headers: authHeader(store) });
        store.commit('updateProfile', { username });
        message.success({ content: 'saved', key });
        return true;
    } catch (err: any) {
        message.error({
            content: 'failed to save username, ' + parseErrorMsg(err),
            key,
        });
        return false;
    }
}

export async function getInvitationCode(
    store: Store<State>
): Promise<{ codes: [] }> {
    const url = API_URL + "invitationCode";
    const res = await axios.post(url, {}, { headers: authHeader(store) });
    return res.data;
}