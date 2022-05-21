import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { useStore } from '../store';
import { API_URL } from '../lib/constants';

export interface Evidence {
    description?: string;
    files: string[];
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

export function validateFact(fact: FactBase): { alert?: {} ok: boolean } {
    console.log(fact);
    if (!fact.description) {
        return { ok: false, alert: { description: "Description cannot be empty" } };
    }

    if (fact.startTime && fact.endTime && fact.endTime < fact.startTime) {
        return { ok: false, alert: { time: "End time must after start time" } }
    }

    for (const reference of fact.references || []) {
        if (!reference.link) {
            return { ok: false, alert: { fact: "Reference link cannot be empty" } };
        }
    }

    for (const evidence of fact.evidences || []) {
        if (evidence.files.length == 0) {
            return { ok: false, alert: { reference: "Evidence must be supported by files" } };
        }
    }
    return { ok: true };
}

export async function saveFact(fact: FactBase): Promise<Fact> {
    const url = API_URL + "facts";
    const res = await axios.post(url, fact, { headers: authHeader() });
    return {
        ...fact,
        owner: '',
        hash: '',
    }
}

export async function fetchFacts(params: { owner: string, sortedBy: string }): Promise<Fact[]> {
    const url = API_URL + "facts";
    const res = await axios.post(url, params, { headers: authHeader() });
    return res.data;
}