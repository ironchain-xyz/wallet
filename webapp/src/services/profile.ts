
import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { User, State } from "../store";
import router from '../router';
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';

export async function updateProfile(
    store: Store<State>,
    update: {username: string}
): Promise<boolean> {
    const url = API_URL + "profile/update";
    const res = await axios.post(url, update, { headers: authHeader(store) });
    store.commit('updateProfile', update);
    return true;

}

export async function getInvitationCode(
    store: Store<State>
): Promise<{ codes: [] }> {
    const url = API_URL + "invitationCode";
    const res = await axios.post(url, {}, { headers: authHeader(store) });
    return res.data;
}