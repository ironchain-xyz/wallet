import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';
import { Evidence, RawFile } from './evidence';

export interface MaterialPreview {
    hash: string;
    description: string;
    creator: {username: string};
    createdAt: string;
    evidencesHashes: string[];
    tags: string[];
    space: string;
}

export interface Material extends MaterialPreview {
    collectedAt: string;
    collectors: {userId: string}[];
    evidences: Evidence[];
    index?: number;
}

export interface NewMaterial {
    description: string;
    evidences: RawFile[];
}

export interface NewMaterialAlert {
    description?: string;
    evidences?: string;
    save?: string;
}

export interface MaterialQuery {
    startAt?: string,
    offset: number,
    limit: number,
}

export function validateMaterial(material: NewMaterial, alert: NewMaterialAlert): { alert?: NewMaterialAlert, ok: boolean } {
    let ok = true;
    if (!material.description) {
        alert.description = "Description cannot be empty";
        ok = false;
    }

    for (const index in material.evidences || []) {
        const e = material.evidences[index];
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

export async function newMaterial(store: Store<State>, material: NewMaterial): Promise<{hash: string}> {
    const url = API_URL + "record/new";
    const res = await axios.post(url, {
        description: material.description,
        evidences: material.evidences.map(e => e.response),
    }, { headers: authHeader(store) });
    return res.data;
}

export async function fetchMaterial(
    store: Store<State>,
    hash: string
) : Promise<Material> {
    const url = API_URL + "record/";
    const res = await axios.get(url, {headers: authHeader(store), params: {hash}});
    return res.data;
}

export async function fetchLatestMaterials(
    store: Store<State>,
    params: MaterialQuery
) : Promise<Material[]> {
    const url = API_URL + "record/latest";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.records.map(r => ({
        ...r,
        references: r.reference,
    }));
}

export async function fetchCreatedMaterials(
    store: Store<State>,
    params: MaterialQuery
) : Promise<Material[]> {
    const url = API_URL + "record/created";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.records.map(r => ({
        ...r,
        references: r.reference,
    }));
}

export async function fetchCollectedMaterials(
    store: Store<State>,
    params: MaterialQuery
) : Promise<Material[]> {
    const url = API_URL + "record/collections";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.records.map(r => ({
        ...r.record,
        references: r.record.reference,
        collectedAt: r.updatedAt,
    }));
}

export async function addToCollection(store: Store<State>, hash: string) : Promise<Material[]> {
    const url = API_URL + "record/addToCollection";
    const res = await axios.post(url, {hash}, {headers: authHeader(store)});
    return res.data;
}

export async function removeFromCollection(store: Store<State>, hash: string) : Promise<Material[]> {
    const url = API_URL + "record/removeFromCollection";
    const res = await axios.post(url, {hash}, {headers: authHeader(store)});
    return res.data;
}
