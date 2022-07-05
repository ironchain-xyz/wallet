import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';
import { Evidence, RawFile } from './evidence';

export interface RecordPreview {
    hash: string;
    description: string;
    creator: {username: string};
    createdAt: string;
    evidencesHashes: string[];
    tags: string[];
}

export interface Record extends RecordPreview {
    collectedAt: string;
    collectors: {userId: string}[];
    evidences: Evidence[];
    index?: number;
}

export interface NewRecord {
    description: string;
    evidences: RawFile[];
}

export interface NewRecordAlert {
    description?: string;
    evidences?: string;
    save?: string;
}

export interface RecordQuery {
    startAt?: string,
    offset: number,
    limit: number,
}

export function validateRecord(record: NewRecord, alert: NewRecordAlert): { alert?: NewRecordAlert, ok: boolean } {
    let ok = true;
    if (!record.description) {
        alert.description = "Description cannot be empty";
        ok = false;
    }

    for (const index in record.evidences || []) {
        const e = record.evidences[index];
        if (e.status == "error") {
            alert.evidences = "Please remove invalid files"
            ok = false;
        }
        if (e.status == "uploading") {
            alert.evidences = "Please wait util all files uploaded"
            ok = false;
        }
    }
    return { ok, alert };
}

export async function newRecord(store: Store<State>, record: NewRecord): Promise<{hash: string}> {
    const url = API_URL + "record/new";
    const res = await axios.post(url, {
        description: record.description,
        evidences: record.evidences.map(e => e.response),
    }, { headers: authHeader(store) });
    return res.data;
}

export async function fetchRecord(
    store: Store<State>,
    hash: string
) : Promise<Record> {
    const url = API_URL + "record/";
    const res = await axios.get(url, {headers: authHeader(store), params: {hash}});
    res.data.references = res.data.reference;
    return res.data;
}

export async function fetchLatestRecords(
    store: Store<State>,
    params: RecordQuery
) : Promise<Record[]> {
    const url = API_URL + "record/latest";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.records.map(r => ({
        ...r,
        references: r.reference,
    }));
}

export async function fetchCreatedRecords(
    store: Store<State>,
    params: RecordQuery
) : Promise<Record[]> {
    const url = API_URL + "record/created";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.records.map(r => ({
        ...r,
        references: r.reference,
    }));
}

export async function fetchCollectedRecords(
    store: Store<State>,
    params: RecordQuery
) : Promise<Record[]> {
    const url = API_URL + "record/collections";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.records.map(r => ({
        ...r.record,
        references: r.record.reference,
        collectedAt: r.updatedAt,
    }));
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
