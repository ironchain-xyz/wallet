
import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { User, State } from "../store";
import router from '../router';
import { authHeader, messageError } from './utils';

function validateUsername(username: string) : boolean {
    return /^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{5,20}$/.test(username);
}

export function initProfile(store: Store<State>, profile: {username: string}) {
    if (!validateUsername(profile.username)) {
        return message.error("please input a valid username");
    }

    const key = "initProfile";
    const hide = message.loading({ content: 'saving...', key });
    const url = store.state.API_URL + "profile/init";
    axios.post(
        url, profile, {headers: authHeader(store)}
    ).then((res: AxiosResponse<{ok: true}>) => {
        store.commit('setProfile', profile);
        hide();
        message.success({content: 'saved', key});
        router.push('/');
    }).catch(err => messageError(key, err))
}