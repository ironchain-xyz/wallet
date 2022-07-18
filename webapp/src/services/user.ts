
import { Store } from 'vuex';
import axios from 'axios';
import { State } from "../store";
import { authHeader } from './utils';
import { API_URL } from '../lib/constants';

export async function updateProfile(
    store: Store<State>,
    update: {username: string}
): Promise<boolean> {
    const url = API_URL + "user/update";
    const res = await axios.post(url, update, { headers: authHeader(store) });
    store.commit('updateUser', update);
    return true;
}

export async function getInvitationCode(
    store: Store<State>
): Promise<{ codes: [] }> {
    const url = API_URL + "user/invitationCode";
    const res = await axios.post(url, {}, { headers: authHeader(store) });
    return res.data;
}

export async function getSubscribedSpaces(userId: string): Promise<{ codes: [] }> {
    const url = API_URL + "user/subscibedSpaces";
    const res = await axios.get(url, {params: {userId}});
    return res.data;
}