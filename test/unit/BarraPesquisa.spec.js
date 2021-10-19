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
    searchOptions: { filtrarPor: "", filtro: "" }
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
    test("Verifica se o primeiro autocomplete possui os dados para popular", async () => {
      //axios.get.mockResolvedValue({ data: createdMockResponse });

      const wrapper = shallowMount(BarraPesquisa, { store, localVue });
      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");

      expect(autocomplete_tipoFiltro.vm.items).toEqual(wrapper.vm.tipoFiltros);
    }),
    test("Popula os autocompletes com a ultima pesquisa, se ja houve pesquisas", async () => {
      // Configurando ultimas pesquisas
      let valorTipoFiltro = "Língua";
      let valorFiltro = "French";

      store.state.searchOptions.filtrarPor = valorTipoFiltro;
      store.state.searchOptions.filtro = valorFiltro;

      const wrapper = shallowMount(BarraPesquisa, { store, localVue });

      await flushPromises();

      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
      const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

      expect(autocomplete_tipoFiltro.vm.value).toMatch(valorTipoFiltro);
      expect(autocomplete_filtro.vm.value).toMatch(valorFiltro);
    }),
    test("Autocomplete 1 vazio e autocomplete 2 escondido se nao houve ultima pesquisa", async () => {
      const wrapper = shallowMount(BarraPesquisa, { store, localVue });

      await flushPromises();

      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
      const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

      expect(autocomplete_tipoFiltro.vm.value).toBeFalsy()
      expect(autocomplete_filtro.isVisible()).toBeFalsy()
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

  test("Carregando capitais corretamente", async () => {
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
  }),
    test("Carregando Língua corretamente", async () => {
      const tipoFiltro = "Língua";

      const wrapper = shallowMount(BarraPesquisa, {
        store,
        localVue,
        data() {
          return { tipoFiltroSelecionado: tipoFiltro };
        }
      });

      await flushPromises();
      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
      const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

      const valoresEsperados = wrapper.vm.todosIdiomas
        .map(idioma => idioma.name)
        .sort();
      const valoresExibidos = autocomplete_filtro.vm.items;

      expect(autocomplete_tipoFiltro.vm.value).toMatch(tipoFiltro);
      expect(autocomplete_filtro.isVisible()).toBe(true);
      expect(valoresExibidos).toEqual(valoresEsperados);
    }),
    test("Carregando Países corretamente", async () => {
      const tipoFiltro = "País";

      const wrapper = shallowMount(BarraPesquisa, {
        store,
        localVue,
        data() {
          return { tipoFiltroSelecionado: tipoFiltro };
        }
      });

      await flushPromises();
      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
      const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

      const valoresEsperados = wrapper.vm.todosPaises
        .map(pais => pais.name)
        .sort();
      const valoresExibidos = autocomplete_filtro.vm.items;

      expect(autocomplete_tipoFiltro.vm.value).toMatch(tipoFiltro);
      expect(autocomplete_filtro.isVisible()).toBe(true);
      expect(valoresExibidos).toEqual(valoresEsperados);
    }),
    test("Carregando Códigos de Ligação corretamente", async () => {
      const tipoFiltro = "Código de ligação";

      const wrapper = shallowMount(BarraPesquisa, {
        store,
        localVue,
        data() {
          return { tipoFiltroSelecionado: tipoFiltro };
        }
      });

      await flushPromises();
      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
      const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

      const valoresEsperados = wrapper.vm.todosCodigosLigacao;
      const valoresExibidos = autocomplete_filtro.vm.items;

      expect(autocomplete_tipoFiltro.vm.value).toMatch(tipoFiltro);
      expect(autocomplete_filtro.isVisible()).toBe(true);
      expect(valoresExibidos).toEqual(valoresEsperados);
    });
});
