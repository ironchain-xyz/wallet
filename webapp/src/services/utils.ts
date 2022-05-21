import { Store } from 'vuex';
import { message } from 'ant-design-vue';
import { State } from "../store";

export function authHeader(store: Store<State>): Record<string, string> {
    return { "x-access-token": store.state.user!.jwt!.accessToken };
}

export function parseErrorMsg(err: any, message?: string) {
    return err.response?.data?.message || err.response?.message || message || "unknown server error";
}