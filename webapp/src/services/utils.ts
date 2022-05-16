import { Store } from 'vuex';
import { message } from 'ant-design-vue';
import { State } from "../store";

export function messageError(key: string, err: {response: {message: string}}) {
    if (err.response) {
        message.error({content: err.response.message, key, duration: 5});
    } else {
        message.error({
            content: "failed to verify passcode, unknown error",
            key,
            duration: 5
        });
    }
}

export function authHeader(store: Store<State>): Record<string, string> {
    return {"x-access-token": store.state.user!.jwt!.accessToken};
}