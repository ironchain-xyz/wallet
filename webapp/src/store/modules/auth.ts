import axios from "axios";

const state = {
  user: null,
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  StateUser: (state) => state.user,
};

const actions = {
  async LogIn({ commit }, email, passcode) {
    const user = await axios.post("login", passcode);
    await commit("setUser", user);
  },

  async LogOut({ commit }) {
    commit("logout");
  },
};

const mutations = {
  loginSuccess(state, user) {
    state.user = user;
  },

  loginFailure(state, user) {
    state.user = null;
  },

  logout(state) {
    state.user = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
