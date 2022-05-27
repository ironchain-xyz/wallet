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

export async function saveFact(store: Store<State>, fact: NewFact): Promise<Fact | {error: string}> {
    const url = API_URL + "fact/new";
    const res = await axios.post(url, {
        description: fact.description,
        evidences: fact.evidences.map(e => e.response),
        references: fact.references.map(f => ({hash: f.hash}))
    }, { headers: authHeader(store) });
    return res.data;
}

export async function fetchCreatedFacts(
    store: Store<State>,
    creator: string
) : Promise<{facts: Fact[], evidences: File[], references: Fact[]}> {
    const url = API_URL + "fact/created";
    const res = await axios.get(url, {
        headers: authHeader(store),
        params: {createdBy: creator}
    });
    return res.data;
}

export async function fetchFacts(store: Store<State>, hashes: string[]) : Promise<Fact[]> {
    const url = API_URL + "fact";
    const res = await axios.get(url, {
        headers: authHeader(store),
        params: {hashes: hashes.join(',')}
    });
    return res.data.result;
}

function random() { // min and max included 
    return Math.floor(Math.random() * 2)
}

export async function getLibrary(offset: number, max: number) : Promise<FactPreview[]> {
    return [];
}

const content = [
    "fact some",
    "I believe the problem is somewhere else in your code as passing an object as a prop is as simple as you imagine I believe the problem is somewhere else in your code as passing an object as a prop is as simple as you imagine",
];

function genPreview(offset, max) : FactPreview[] {
    const res : FactPreview[] = [];
    for (let i = offset; i < max + offset; i++) {
        res.push({
            hash: i.toString(),
            description: content[random()], 
            createdAt: new Date(),
            createdBy: "shudong"
        });
    }
    return res;
}

export async function getLibraryMock(offset: number, max: number) : Promise<FactPreview[]> {
    if (offset < 50) {
        return genPreview(offset, max);
    }
    return [];
}
