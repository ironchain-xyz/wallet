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

export interface Login {
  loggingIn: boolean;
  destination: string;
}

export interface State {
  user?: User;
  subscription: {string?: boolean};
  login: Login
}

export const key: InjectionKey<Store<State>> = Symbol()

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
});

export const store = createStore<State>({
  state() {
    return {
      subscription: {},
      login: {
        loggingIn: false,
        destination: "/",
      }
    }
  },
  mutations: {
    startLogin(state: State, destination: string) {
      state.login = {
        loggingIn: true,
        destination
      };
    },
    endLogin(state: State) {
      state.login.loggingIn = false;
    },
    unsetUser(state: State) {
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
    },
    subscribe(state: State, spaceId: string) {
      state.subscription[spaceId] = true;
    },
    unsubscribe(state: State, spaceId: string) {
      state.subscription[spaceId] = false;
    },
  },
  plugins: [vuexLocal.plugin]
});

export function useStore() {
  return baseUseStore(key)
}