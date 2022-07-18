import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import VuexPersistence from 'vuex-persist'

export type JWT = {
  refreshToken: string;
  accessToken: string;
};

export interface InvitationCode {
  code: string;
  used: boolean;
}

export interface User {
  id: string,
  email: string;
  jwt?: JWT;
  username: string;
  invitationCodes: InvitationCode[];
}

export interface Login {
  loggingIn: boolean;
  destination: string;
}

export interface Space {
  name: string,
  id: number,
}

export interface State {
  user?: User;
  subscription: {string?: Space};
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
    initInvitationCodes(state: State, invitationCodes: InvitationCode[]) {
      state.user!.invitationCodes = invitationCodes;
    },
    updateUser(state: State, update: {username: string}) {
      Object.assign(state.user!, update);
    },
    setSubscription(state: State, subscription: Space[]) {
      state.subscription = {};
      subscription.forEach(sub => state.subscription[sub.id] = sub);
    },
    subscribe(state: State, space: Space) {
      state.subscription[space.id] = space;
    },
    unsubscribe(state: State, space: Space) {
      delete state.subscription[space.id]
    },
  },
  plugins: [vuexLocal.plugin]
});

export function useStore() {
  return baseUseStore(key)
}