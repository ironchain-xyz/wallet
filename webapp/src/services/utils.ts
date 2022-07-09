import { Store } from 'vuex';
import { State } from "../store";
import CryptoJS from 'crypto-js';

export function authHeader(store: Store<State>): Record<string, string> {
    return { "x-access-token": store.state.user!.jwt!.accessToken };
}

export function parseErrorMsg(err: any, defaultMsg?: string) {
    return err.response?.data?.message || err.response?.message || err.message || defaultMsg || "unknown server error";
}

export async function genHash(file) : Promise<string> {
    return new Promise((resolve, reject) => {
        const SHA256 = CryptoJS.algo.SHA256.create();
        const reader = new FileReader();
        reader.onload = function () {
            const data = reader.result;
            const wordArray = CryptoJS.lib.WordArray.create(data);
            SHA256.update(wordArray);
            resolve(SHA256.finalize().toString());
        };
        reader.readAsArrayBuffer(file);
    });
}

export function shortDescription(description: string) {
    if (description.length > 100) {
        return description.substring(0, 100) + "...";
    }
    return description;
}