import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";
import auth from "./modules/auth";


// Create store
const store = createStore({
  modules: {
    auth
  },
  plugins: [createPersistedState()]
});
export default store;