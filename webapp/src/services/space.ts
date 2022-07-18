import { Store } from 'vuex';
import axios from 'axios';
import { State } from "@/store";
import { API_URL } from '@/lib/constants';
import { authHeader } from '@/services/utils';

export interface SpaceBase {
    name: string;
    description: string;
}

export interface Space extends SpaceBase {
    id: number;
    createdAt: string;
    totalSubscribers: number;
    isSubscriber: boolean;
}

export interface SpaceQuery {
    startId?: number,
}

export async function fetchSpace(id: string) : Promise<Space> {
    const url = API_URL + "space/" + id;
    const res = await axios.get(url);
    return res.data.space;
}

export async function fetchSpaces(
    query: SpaceQuery
) : Promise<{spaces: Space[], limit: number}> {
    const url = API_URL + "space/all";
    const res = await axios.get(url, {params: query});
    return res.data;
}

export async function newSpace(
    store: Store<State>,
    space: SpaceBase
): Promise<{id: number}> {
    if (!space.name) {
        throw new Error("name cannot be empty");
    }
    if (!space.description) {
        throw new Error("description cannot be empty");
    }
    const url = API_URL + "space/new";
    const res = await axios.post(url, space, { headers: authHeader(store) });
    return res.data;
}

export async function subscribe(
    store: Store<State>,
    id: string,
) : Promise<boolean> {
    const url = API_URL + "space/subscribe";
    const res = await axios.post(url, {id}, { headers: authHeader(store) });
    return res.data.success;
}

export async function unsubscribe(
    store: Store<State>,
    id: string,
) : Promise<boolean> {
    const url = API_URL + "space/unsubscribe";
    const res = await axios.post(url, {id}, { headers: authHeader(store) });
    return res.data.success;
}
