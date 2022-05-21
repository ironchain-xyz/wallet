import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { useStore } from '../store';

export interface Evidence {
    description: string;
    imgs: string[];
}

export interface Reference {
    description: string;
    value: string;
}

export interface Fact {
    id: string;
    statement: string;
    startTime?: string;
    endTime?: string;
    evidences: Evidence[];
    references: Reference[];
}

export interface Event {
    id: string;
    name: string;
    description: string;
    img?: string;
    facts: Fact[];
}

export async function fetchEvents(params: {sortedBy: string}): Promise<Event[]> {
    const store = useStore();
    const url = store.state.API_URL + "events";
    const res = await axios.post(url, params, {headers: authHeader(store)});
    return res.data;
}