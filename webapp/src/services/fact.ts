import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';

export interface RawFile {
    status: "error" | "done" | "uploading" | "removed";
}

export interface Evidence {
    description?: string;
    files: string[] | RawFile[];
}

export interface Reference {
    description?: string;
    link: string;
}

export interface FactBase {
    description: string;
    startTime?: string;
    endTime?: string;
    references: Reference[];
    evidences: Evidence[];
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
    evidences: string[];
}

function isRawFile(file: any): file is RawFile {
    return 'status' in file;
}

export function validateFact(fact: FactBase, alert: NewFactAlert): { alert?: NewFactAlert, ok: boolean } {
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
        if (!reference.link) {
            alert.references[index] = "Reference link cannot be empty"
            ok = false;
        }
    }

    for (const index in fact.evidences || []) {
        const evidence = fact.evidences[index];
        if (evidence.files.length == 0) {
            alert.evidences[index] = "Evidence must include at least one file"
            ok = false;
        } else {
            for (const file of evidence.files) {
                if (isRawFile(file)) {
                    if (file.status == "error") {
                        alert.evidences[index] = "Please remove invalid files"
                        ok = false;
                    }
                    if (file.status == "uploading") {
                        alert.evidences[index] = "Please wait util all files uploaded"
                        ok = false;
                    }
                }
            }
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

export async function uploadEvidence(store: Store<State>, file: string | Blob):  Promise<{}>{
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
    console.log(res.data);
    return res.data;
}