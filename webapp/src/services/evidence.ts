
import { Store } from 'vuex';
import axios from 'axios';
import { State } from "../store";
import { authHeader } from './utils';
import { API_URL } from '../lib/constants';

export interface Evidence {
    id: number;
    hash: string;
    mimeType: string;
    name: string;
    rawFile: {
        hash: string,
        size: number
    }
}

export interface RawFile {
    status: "uploading" | "done" | "error" | "removed";
    uid: string;
    size: number;
    response?: File;
}

export async function checkRawEvidence(
    store: Store<State>,
    contentHash: string
):  Promise<boolean>{
    const res = await axios.get(
        API_URL + "evidence/checkRaw",
        {
            params: {contentHash},
            headers: authHeader(store)
        }
    );
    return res.data.exists;
}

export async function uploadEvidence(
    store: Store<State>,
    file: string | Blob
):  Promise<File | {error: string}>{
    const data = new FormData();
    data.append('evidences', file);
    const headers = authHeader(store);
    const config= {
        "headers": {
            "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
            ...headers
        }
    }
    const res = await axios.post(API_URL + "evidence/upload", data, config);
    return res.data.uploaded[0];
}