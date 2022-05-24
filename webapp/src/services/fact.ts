import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';

export interface File {
    uid: string;
    status: "error" | "done" | "uploading" | "removed";
    hash?: string;
}

export interface Reference {
    header: "https://" | "http://" | "ipfs://" | "ipns://" | "web3://";
    url: string;
}

export interface FactBase {
    description: string;
    startTime?: string;
    endTime?: string;
    references: Reference[];
    evidences: File[];
    tags: string[];
}

export interface Fact extends FactBase {
    hash: string;
    owner: string;
}

export interface NewFactAlert {
    description?: string;
    time?: string;
    references: string[];
    evidences?: string;
}

export function validateFact(fact: FactBase, alert: NewFactAlert): { alert?: NewFactAlert, ok: boolean } {
    console.log(fact);

    let ok = true;
    if (!fact.description) {
        alert.description = "Description cannot be empty";
        ok = false;
    }

    if (fact.startTime && fact.endTime && fact.endTime < fact.startTime) {
        alert.time = "End time must after start time";
        ok = false;
    }

    for (const index in fact.references || []) {
        const reference = fact.references[index];
        if (!reference.url || !reference.header) {
            alert.references[index] = "Reference link cannot be empty"
            ok = false;
        }
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

export async function saveFact(store: Store<State>, fact: FactBase): Promise<Fact> {
    const url = API_URL + "/fact/new";
    const res = await axios.post(url, fact, { headers: authHeader(store) });
    return {
        ...fact,
        owner: '',
        hash: '',
    }
}

export async function fetchFacts(store: Store<State>, params: { owner: string, sortedBy: string }): Promise<Fact[]> {
    const url = API_URL + "facts";
    const res = await axios.post(url, params, { headers: authHeader(store) });
    return res.data;
}

export async function uploadEvidence(
    store: Store<State>,
    file: string | Blob
):  Promise<{uploaded: [{id?: number, hash?: string, message?: string}]}>{
    const data = new FormData();
    data.append('evidences', file);
    const headers = authHeader(store);
    const config= {
        "headers": {
            "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
            ...headers
        }
    }
    const res = await axios.post(API_URL + "upload/evidence", data, config);
    return res.data;
}