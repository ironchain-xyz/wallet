import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';
import { Evidence, RawFile } from './evidence';

export interface RecordPreview {
    hash: string;
    description: string;
    createdBy: string;
    createdAt: string;
    evidencesHashes: string[];
    referenceHashes: string[];
    tags: string[];
}

export interface Record extends RecordPreview {
    collectedAt: string;
    collectors: string[];
    evidences: Evidence[];
    references: RecordPreview[];
}

export interface RecordReference extends Record {
    status?: "available" | "selected" | "added";
}

export interface NewRecord {
    description: string;
    evidences: RawFile[];
    references: RecordPreview[];
}

export interface NewRecordAlert {
    description?: string;
    evidences?: string;
    save?: string;
}

export interface RecordQuery {
    startAt?: string,
    limit: number,
    offset: number
}

export function validateRecord(record: NewRecord, alert: NewRecordAlert): { alert?: NewRecordAlert, ok: boolean } {
    let ok = true;
    if (!record.description) {
        alert.description = "Description cannot be empty";
        ok = false;
    }

    for (const index in record.evidences || []) {
        const file = record.evidences[index];
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

export async function newRecord(store: Store<State>, record: NewRecord): Promise<Record | {error: string}> {
    const url = API_URL + "record/new";
    const res = await axios.post(url, {
        description: record.description,
        evidences: record.evidences.map(e => e.response),
        references: record.references.map(f => ({hash: f.hash}))
    }, { headers: authHeader(store) });
    return res.data;
}

export async function fetchRecord(
    store: Store<State>,
    hash: string
) : Promise<Record> {
    const url = API_URL + "record/";
    const res = await axios.get(url, {headers: authHeader(store), params: {hash}});
    return res.data.record;
}

export async function fetchCreatedRecords(
    store: Store<State>,
    params: RecordQuery
) : Promise<{records: Record[]}> {
    const url = API_URL + "record/created";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data;
}

export async function fetchCollectedRecords(
    store: Store<State>,
    params: RecordQuery
) : Promise<{records: Record[]}> {
    const url = API_URL + "record/collections";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data;
}

export async function addToCollection(store: Store<State>, hash: string) : Promise<Record[]> {
    const url = API_URL + "record/addToCollection";
    const res = await axios.post(url, {hash}, {headers: authHeader(store)});
    return res.data;
}

export async function removeFromCollection(store: Store<State>, hash: string) : Promise<Record[]> {
    const url = API_URL + "record/removeFromCollection";
    const res = await axios.post(url, {hash}, {headers: authHeader(store)});
    return res.data;
}
