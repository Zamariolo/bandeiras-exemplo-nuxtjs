//Fundamentals
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify";
//Axios
import axios from "axios";
import flushPromises from "flush-promises";
//Componentes
import BarraPesquisa from "@/components/BarraPesquisa/BarraPesquisa";

//Resposta fake para inicializacao do componente
import { initialResponse } from "./mockResponse";
let createdMockResponse = initialResponse;
jest.mock("axios");

const localVue = createLocalVue();
localVue.use(Vuex);

// Criando a vuex store
let actions;
let store;
let state;

beforeEach(() => {
  // Incorporando vuetify
  const vuetify = new Vuetify();

  // Montando a vuex store
  state = {
    searchOptions: () => {
      let retorno = { filtrarPor: "", filtro: "" };
      return retorno;
    }
  };

  actions = {
    saveSearchOptions: jest.fn()
  };
  store = new Vuex.Store({
    actions,
    state
  });

  // Axios mock initial response
  axios.get.mockResolvedValue({ data: createdMockResponse });
});

afterEach(() => {});

describe("Inicializando a barra de pesquisa", () => {
  test("Testa comportamento de mostra/esconde do autocomplete filtro", async () => {
    //axios.get.mockResolvedValue({ data: createdMockResponse });

    const wrapper = shallowMount(BarraPesquisa, { store, localVue });
    const filtro = wrapper.find("#autocomplete_filtro");

    // Filtro inicialmente escondido
    expect(filtro.isVisible()).toBe(false);

    // Mostra o autocomplete do filtro
    await wrapper.setData({ tipoFiltroSelecionado: "Região" });
    expect(filtro.isVisible()).toBe(true);

    //Esconde o autocomplete do filtro
    await wrapper.setData({ tipoFiltroSelecionado: "" });
    expect(filtro.isVisible()).toBe(false);
  }),
    test("Verifica se o primeiro autocomplete possua os dados para popular", async () => {
      //axios.get.mockResolvedValue({ data: createdMockResponse });

      const wrapper = shallowMount(BarraPesquisa, { store, localVue });
      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");

      expect(autocomplete_tipoFiltro.vm.items).toEqual(wrapper.vm.tipoFiltros);
    });
});

describe("Populando autocomplete filtro corretamente", () => {
  test("Carregando regioes corretamente", async () => {
    const tipoFiltro = "Região";

    //axios.get.mockImplementation(() => Promise.resolve({ data: createdMockResponse }));
    await flushPromises();

    const wrapper = shallowMount(BarraPesquisa, {
      store,
      localVue,
      data() {
        return { tipoFiltroSelecionado: tipoFiltro };
      }
    });

    //await wrapper.vm.pesquisarPaises();
    const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
    const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

    const valoresEsperados = wrapper.vm.todasRegioes.map(a => a.regiao_ptbr);
    const valoresExibidos = autocomplete_filtro.vm.items;

    expect(autocomplete_tipoFiltro.vm.value).toMatch(tipoFiltro); // Verifica v-model tipoFiltroSelecionado foi alterado
    expect(autocomplete_filtro.isVisible()).toBe(true); //Verifica que esta visivel
    expect(valoresExibidos).toEqual(valoresEsperados); // Verifica opcoes de regiao
  });

  test.only("Carregando capitais corretamente", async () => {
    const tipoFiltro = "Capital";

    const wrapper = shallowMount(BarraPesquisa, {
      store,
      localVue,
      data() {
        return { tipoFiltroSelecionado: tipoFiltro };
      }
    });

    await flushPromises();

    //expect(axios.get).toHaveBeenCalledWith(
    //"https://restcountries.com/v2/all?fields=name,capital,languages,callingCodes,alpha3Code,translations"
    // );

    const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
    const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

    const valoresEsperados = wrapper.vm.todasCapitais;
    const valoresExibidos = autocomplete_filtro.vm.items;

    expect(autocomplete_tipoFiltro.vm.value).toMatch(tipoFiltro); // Verifica v-model tipoFiltroSelecionado foi alterado
    expect(autocomplete_filtro.isVisible()).toBe(true); //Verifica que esta visivel
    expect(valoresExibidos).toEqual(valoresEsperados); // Verifica opcoes de regiao
  });
});
