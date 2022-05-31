import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';
import { File, RawFile } from './evidence';

export interface Reference {
    hash: string;
    description: string;
    createdBy: string;
    createdAt: Date;
}

export interface FactPreview {
    hash: string;
    description: string;
    createdBy: string;
    createdAt: Date;
    status?: "available" | "selected" | "added";
}

export interface NewFact {
    description: string;
    evidences: RawFile[];
    references: FactPreview[];
}

export interface Fact {
    hash: string;
    description: string;
    createdBy: string;
    collectors: string[];
    evidences: File[] | string[];
    references: FactPreview[] | string[];
    tags: string[];
}

export interface NewFactAlert {
    description?: string;
    time?: string;
    evidences?: string;
    save?: string;
}

export function validateFact(fact: NewFact, alert: NewFactAlert): { alert?: NewFactAlert, ok: boolean } {
    let ok = true;
    if (!fact.description) {
        alert.description = "Description cannot be empty";
        ok = false;
    }

    for (const index in fact.evidences || []) {
        const file = fact.evidences[index];
        if (file.status == "error") {
            alert.evidences = "Please remove invalid files"
            ok = false;
        }
        if (file.status == "uploading") {
            alert.evidences = "Please wait util all files uploaded"
            ok = false;
        }
    }
    return { ok, alert };
}

export async function newFact(store: Store<State>, fact: NewFact): Promise<Fact | {error: string}> {
    const url = API_URL + "fact/new";
    const res = await axios.post(url, {
        description: fact.description,
        evidences: fact.evidences.map(e => e.response),
        references: fact.references.map(f => ({hash: f.hash}))
    }, { headers: authHeader(store) });
    return res.data;
}

export async function fetchFacts(
    store: Store<State>,
    hashes: string[]
) : Promise<Fact[]> {
    const url = API_URL + "fact";
    const res = await axios.get(url, {
        headers: authHeader(store),
        params: {hashes: hashes.join(',')}
    });
    return res.data.results;
}

export async function fetchCreatedFacts(
    store: Store<State>
) : Promise<{facts: Fact[], evidences: File[], references: Fact[]}> {
    const url = API_URL + "fact/created";
    const res = await axios.get(url, {headers: authHeader(store)});
    return res.data;
}

export async function fetchCollectedFacts(
    store: Store<State>
) : Promise<{facts: Fact[], evidences: File[], references: Fact[]}> {
    const url = API_URL + "fact/collections";
    const res = await axios.get(url, {headers: authHeader(store)});
    return res.data;
}

export async function addToCollection(store: Store<State>, hash: string) : Promise<Fact[]> {
    const url = API_URL + "fact/addToCollection";
    const res = await axios.post(url, {hash}, {headers: authHeader(store)});
    return res.data;
}

export async function removeFromCollection(store: Store<State>, hash: string) : Promise<Fact[]> {
    const url = API_URL + "fact/removeFromCollection";
    const res = await axios.post(url, {hash}, {headers: authHeader(store)});
    return res.data;
}
