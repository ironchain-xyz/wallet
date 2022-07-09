import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import VuexPersistence from 'vuex-persist'

export type JWT = {
  refreshToken: string;
  accessToken: string;
};

export interface Profile {
  username: string;
}

export interface User {
  id: string,
  email: string;
  jwt?: JWT;
  profile: Profile;
}

export interface State {
  user?: User;
}

export const key: InjectionKey<Store<State>> = Symbol()

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
});

export const store = createStore<State>({
  state() {
    return {}
  },
  mutations: {
    clear(state: State) {
      state.user = undefined;
    },
    setUser(state: State, user: User) {
      state.user = user;
    },
    setProfile(state: State, profile: Profile) {
      state.user!.profile = profile;
    },
    updateProfile(state: State, profileUpdate: Profile) {
      Object.assign(state.user!.profile!, profileUpdate);
    }
  },
  plugins: [vuexLocal.plugin]
});

export function useStore() {
  return baseUseStore(key)
}