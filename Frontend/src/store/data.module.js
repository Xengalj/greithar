import DataService from "@/services/data.service";

export const data = {
  namespaced: true,
  state: {
    rules: {},
    races: {},
    classes: {},
    feats: {},
    equipment: {}
  },
  mutations: {
    init (state, payload) {
      state[payload.name] = payload.data;
    }
  },
  actions: {
    init ({ commit }) {
      DataService.getRules().then( response => {
        commit('init', { "name": "rules", "data": response });
      } );
      DataService.getRaces().then( response => {
        commit('init', { "name": "races", "data": response });
      } );
      DataService.getClasses().then( response => {
        commit('init', { "name": "classes", "data": response });
      } );
      DataService.getFeats().then( response => {
        commit('init', { "name": "feats", "data": response });
      } );
      DataService.getEquipment().then( response => {
        commit('init', { "name": "equipment", "data": response });
      } );
      DataService.getActionsAndConditions().then( response => {
        commit('init', { "name": "actions", "data": response.actions });
        commit('init', { "name": "conditions", "data": response.conditions });
      } );

    }
  }
};
