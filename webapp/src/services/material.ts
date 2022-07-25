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
    type: "image" | "video" | "link";
    links: string[];
}

export interface MaterialQuery {
    startId?: number
}

export async function newMaterial(store: Store<State>, material: NewMaterial): Promise<{hash: string}> {
    const url = API_URL + "material/new";
    const res = await axios.post(url, material, { headers: authHeader(store) });
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