import { Store } from 'vuex';
import axios from 'axios';
import { State } from "@/store";
import { authHeader } from '@/services/utils';
import { API_URL } from '@/lib/constants';
import { File, RawFile } from '@/services/file';
import { validate } from '@babel/types';

export interface Material {
    hash: string;
    description: string;
    creator: {username: string};
    createdAt: string;
    tags: string[];
    spaceId: string;
    files: File[];
    index?: number;
}

export interface NewMaterial {
    spaceId: string;
    description: string;
    files: RawFile[];
}

export interface MaterialQuery {
    startAt?: string,
    offset: number,
    limit: number,
}

export function validateMaterial(material: NewMaterial) {
    if (!material.description) {
        throw new Error("description cannot be empty");
    }

    for (const index in material.files || []) {
        const e = material.files[index];
        if (e.status == "error") {
            throw new Error("Please remove invalid files");
        }
        if (e.status == "uploading") {
            throw new Error("Please remove invalid files");
        }
    }
}

export async function newMaterial(store: Store<State>, material: NewMaterial): Promise<{hash: string}> {
    validateMaterial(material);
    const url = API_URL + "material/new";
    const res = await axios.post(url, {
        description: material.description,
        files: material.files.map(e => e.response),
    }, { headers: authHeader(store) });
    return res.data;
}

export async function fetchMaterial(
    store: Store<State>,
    hash: string
) : Promise<Material> {
    const url = API_URL + "material/";
    const res = await axios.get(url, {headers: authHeader(store), params: {hash}});
    return res.data;
}

export async function fetchCreatedMaterials(
    store: Store<State>,
    params: MaterialQuery
) : Promise<Material[]> {
    const url = API_URL + "material/created";
    const res = await axios.get(url, {headers: authHeader(store), params});
    return res.data.materials.map(r => ({
        ...r,
        references: r.reference,
    }));
}
