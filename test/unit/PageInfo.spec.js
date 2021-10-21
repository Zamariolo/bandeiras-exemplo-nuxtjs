//Fundamentals
import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify";
//Axios
import axios from "axios";
import flushPromises from "flush-promises";
jest.mock("axios");
// Mock responses
import {
  paisSelecionadoResponse,
  paisVizinhoResponse
} from "./mockResponses/info_mockResponse";

//Componentes
import InfoPage from "@/pages/info/_pid/index.vue";
//Resposta fake para popularComponente

describe("Inicialização completa", () => {
  // Dados pagina
  const codigoPais = "BRA";

  // Inserindo vuetify
  const vuetify = new Vuetify();

  // Configurando mock axios
  axios.get.mockImplementation(url => {
    switch (url) {
      //Pais selecionado BRA
      case "https://restcountries.com/v2/alpha/" +
        codigoPais +
        "?fields=flag,name,capital,region,subregion,population,languages,borders,translations":
        return Promise.resolve({ data: paisSelecionadoResponse });
        break;

      //Pais vizinho: Argentina
      case "https://restcountries.com/v2/alpha/ARG?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.ARG });
        break;
      //Pais vizinho: Bolivia
      case "https://restcountries.com/v2/alpha/BOL?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.BOL });
        break;
      case "https://restcountries.com/v2/alpha/COL?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.COL });
        break;
      case "https://restcountries.com/v2/alpha/FRA?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.FRA });
        break;
      case "https://restcountries.com/v2/alpha/GUF?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.GUF });
        break;
      case "https://restcountries.com/v2/alpha/GUY?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.GUY });
        break;
      case "https://restcountries.com/v2/alpha/PRY?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.PRY });
        break;
      case "https://restcountries.com/v2/alpha/PER?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.PER });
        break;
      case "https://restcountries.com/v2/alpha/SUR?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.SUR });
        break;
      case "https://restcountries.com/v2/alpha/URY?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.URY });
        break;
      case "https://restcountries.com/v2/alpha/VEN?fields=flag,alpha3Code,name":
        return Promise.resolve({ data: paisVizinhoResponse.VEN });
        break;
    }
  });

  test("Recebendo o código do país correto", () => {
    const wrapper = mount(InfoPage, {
      mocks: {
        $route: { params: { pid: codigoPais } }
      },
      vuetify
    });

    expect(wrapper.vm.paisApresentado).toMatch(codigoPais);
  }),
    test.only("Checando exibicao do pais selecionado", async () => {
      const wrapper = mount(InfoPage, {
        mocks: {
          $route: { params: { pid: codigoPais } }
        },
        vuetify
      });

      await flushPromises();
    });
});
