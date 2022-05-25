import { Store } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { State } from "../store";
import { authHeader, parseErrorMsg } from './utils';
import { API_URL } from '../lib/constants';

export interface RawFile {
    uid: string;
    status: "error" | "done" | "uploading" | "removed";
    hash?: string;
}

export interface Reference {
    hash: string;
    description: string;
    createdBy: string;
    createdAt: number;
}

export interface FactPreview {
    hash: string;
    description: string;
    createdBy: string;
    createdAt: number;
    selected?: boolean;
    status?: "available" | "selected" | "added";
}

export interface NewFact {
    description: string;
    tags: string[];
    references: FactPreview[];
    evidences: RawFile[];
}

export interface Fact {
    hash: string;
    description: string;
    tags: string[];
    createdBy: string;
    evidences: string[];
    references: string[];
}

export interface NewFactAlert {
    description?: string;
    time?: string;
    evidences?: string;
}

export function validateFact(fact: NewFact, alert: NewFactAlert): { alert?: NewFactAlert, ok: boolean } {
    console.log(fact);

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

export async function saveFact(store: Store<State>, fact: NewFact): Promise<{}> {
    const url = API_URL + "/fact/new";
    const res = await axios.post(url, fact, { headers: authHeader(store) });
    return {}
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


function random() { // min and max included 
    return Math.floor(Math.random() * 2)
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
              createdAt: 1653434738,
              createdBy: "shudong"
          });
      }
      return res;
}

export async function getLibrary(offset: number, max: number) : Promise<FactPreview[]> {
    if (offset < 50) {
        return genPreview(offset, max);
    }
    return [];
}