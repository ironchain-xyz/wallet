import { Store } from 'vuex';
import axios from 'axios';
import { State, User } from "@/store";
import { authHeader } from '@/services/utils';
import { API_URL } from '@/lib/constants';
import { File, RawFile } from '@/services/file';

export interface Material {
    id: number,
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
    startId?: number
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
    hash: string
) : Promise<Material> {
    const url = API_URL + "material/" + hash;
    const res = await axios.get(url);
    return res.data;
}

export interface FetchMaterailsResponse {
    materials: Material[],
    limit: number,
}

const fetchMaterials = (url: string) => 
    async (query: MaterialQuery) : Promise<FetchMaterailsResponse> => {
        const res = await axios.get(url, {params: query});
        return res.data;
    };

export function fetchUserMaterials(
    userId: string,
) : (query: MaterialQuery) => Promise<FetchMaterailsResponse> {
    const url = API_URL + "user/" + userId + "/materials";
    return fetchMaterials(url);
}

export function fetchSpaceMaterials(
    spaceId: string,
) : (query: MaterialQuery) => Promise<FetchMaterailsResponse> {
    const url = API_URL + "space/" + spaceId + "/materials";
    return fetchMaterials(url);
}