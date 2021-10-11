export const state = () => ({
  searchOptions: { filtrarPor: "", filtro: "" },
  loadedCountries: []
});

export const mutations = {
  saveSearchOptions(state, payload) {
    // Saving search options
    state.searchOptions.filtrarPor = payload.filtrarPor;
    state.searchOptions.filtro = payload.filtro;
    // Saving loaded countries
    state.loadedCountries = payload.loadedCountries;
  }
};

export const actions = {
  saveSearchOptions(context, payload) {
    context.commit("saveSearchOptions", payload);
  }
};
export const getters = {};
