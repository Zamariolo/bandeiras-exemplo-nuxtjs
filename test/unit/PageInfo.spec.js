//Fundamentals
import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify";
//Axios
//import axios from "axios";
//import flushPromises from "flush-promises";
//Componentes
import InfoPage from "@/pages/info/_pid/index.vue";
//Resposta fake para popularComponente
import { searchCountriesResponse } from "./mockResponse";

describe("Inicialização completa", () => {
  // Inserindo vuetify
  const vuetify = new Vuetify();

  test.only("Recebendo o código do país correto", () => {
    const codigoPais = "BRA";

    const wrapper = mount(InfoPage, {
      mocks: {
        $route: { params: { pid: codigoPais } }
      },
      vuetify
    });

    expect(wrapper.vm.paisApresentado).toMatch(codigoPais);
  });
});
