import { createStore } from "vuex";
import { auth } from "./auth.module";
import { data } from "./data.module";

const store = createStore({
  modules: {
    auth,
    data
  }
});

export default store;
