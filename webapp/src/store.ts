import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import VuexPersistence from 'vuex-persist'

export type JWT = {
  refreshToken: string;
  accessToken: string;
};

export type OTP = {
  sentAt?: number;
  existing?: boolean;
}

export interface User {
  email: string;
  otp: OTP;
  username?: string;
  jwt?: JWT
}

export interface Profile {
  username?: string;
}

export interface State {
  API_URL: string;
  user?: User;
  profile?: Profile;
}

export const key: InjectionKey<Store<State>> = Symbol()

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
});

export const store = createStore<State>({
  state() {
    return {
      API_URL: process.env.NODE_ENV === 'development'
        ? "http://localhost:8080/api/" : "https://ironchain.xyz/api/",
    }
  },
  mutations: {
    clear(state: State) {
      state.user = undefined;
      state.profile = undefined;
    },
    setUser(state: State, user: User) {
      state.user = user;
    },
    setProfile(state: State, profile: Profile) {
      state.profile = profile;
    },
    updateProfile(state: State, profileUpdate: Profile) {
      Object.assign(state.profile!, profileUpdate);
    }
  },
  plugins: [vuexLocal.plugin]
});

export function useStore() {
  return baseUseStore(key)
}