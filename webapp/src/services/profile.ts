
import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { User, State } from "../store";
import router from '../router';
import { authHeader, parseErrorMsg } from './utils';

function validateUsername(username: string) : boolean {
    return /^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$/.test(username);
}

export async function initProfile(store: Store<State>, profile: {username: string}): Promise<string> {
    if (!validateUsername(profile.username)) {
        return "please input a valid username";
    }

    const key = "initProfile";
    const hide = message.loading({ content: 'saving...', key });
    const url = store.state.API_URL + "profile/init";
    let msg = "";
    try {
        const res = await axios.post(url, profile, {headers: authHeader(store)});
        store.commit('setProfile', profile);
        message.success({content: 'saved', key, duration: 2});
        setTimeout(() => router.push('/'));
    } catch(err: any) {
        msg = parseErrorMsg(err);
    }
    hide();
    return msg;
}