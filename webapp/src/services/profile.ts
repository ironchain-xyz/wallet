
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
        hide();
        const hide2 = message.success({
            content: 'saved, redirecting to home...',
            key,
            duration: 1
        });
        setTimeout(() => {
            hide2();
            router.push('/');
        }, 1000);
    } catch(err: any) {
        hide();
        msg = parseErrorMsg(err);
    }
    return msg;
}

export async function getInvitationCode(store: Store<State>): Promise<{codes: {}} | {message: {}}> {
    const url = store.state.API_URL + "invitationCode";
    try {
        const res = await axios.post(url, {}, {headers: authHeader(store)});
        return res.data;
    } catch(err: any) {
        return {message: parseErrorMsg(err)};
    }
}