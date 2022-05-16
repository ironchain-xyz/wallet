import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export type JWT = {
  refreshToken: string;
  accessToken: string;
};

export interface User {
  email: string;
  otpSentAt?: number;
  username?: string;
  jwt?: JWT
}

export interface profile {
  username?: string;
}

export interface State {
  API_URL: string;
  user?: User;
  profile?: profile;
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state() {
    return {
      API_URL: process.env.NODE_ENV === 'development'
        ? "http://localhost:8080/api/" : "https://ironchain.xyz/api/",
    }
  },
  mutations: {
    setUser(state: State, user: User | undefined) {
      state.user = user;
    },
    setProfile(state: State, profile: {username: string}) {
      state.profile = profile;
    }
  }
});

export function useStore () {
  return baseUseStore(key)
}