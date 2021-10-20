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
  import { initialResponse, searchCountriesResponse } from "./mockResponse";
let axiosMockResponse = initialResponse;
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
    saveSearchOptions: jest.fn(() => {
      console.log("Dentro do dispatch");
    })
  };
  store = new Vuex.Store({
    actions,
    state
  });

  // Axios mock initial response
  axios.get.mockResolvedValue({ data: axiosMockResponse });
});

describe("Inicializando a barra de pesquisa", () => {
  test("Testa comportamento de mostra/esconde do autocomplete filtro", async () => {

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

      expect(autocomplete_tipoFiltro.vm.value).toBeFalsy();
      expect(autocomplete_filtro.isVisible()).toBeFalsy();
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

describe("Funcionalidade pesquisar paises", () => {

  test("Pesquisa por região", async () => {
    const wrapper = shallowMount(BarraPesquisa, {
      store,
      localVue,
      data() {
        return {
          tipoFiltroSelecionado: "Região",
          filtroSelecionado: "Europa"
        };
      }
    });

    await flushPromises();

    const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
    const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

    //Confere se o carregamento dos dados iniciais funcionou
    expect(autocomplete_tipoFiltro.vm.value).toEqual(
      wrapper.vm.tipoFiltroSelecionado
    );
    expect(autocomplete_filtro.vm.value).toEqual(wrapper.vm.filtroSelecionado);

    // Altera a resposta do axios mockada
    axiosMockResponse = searchCountriesResponse;
    axios.get.mockResolvedValue({ data: axiosMockResponse });

    // Aciona o botao de pesquisar
    const btnPesquisarPaises = wrapper.find("#btnPesquisarPaises");
    await btnPesquisarPaises.trigger("click");
    await flushPromises();
    await wrapper.vm.$nextTick();


    // Verifica se a funcao que modifica a store foi chamada
    //expect(actions.saveSearchOptions).toHaveBeenCalled();
    //expect(actions.saveSearchOptions).toBeCalledWith({ a: "oi" });

    // Verifica se os dados corretos foram enviados para serem exibidos na pagina
    expect(wrapper.emitted().retornandoPaisesFiltrados.length).toBe(1) // Verifica que o evento foi chamado apenas uma vez
    expect(wrapper.emitted('retornandoPaisesFiltrados')[0][0]).toEqual(axiosMockResponse) //Verifica o payload do emitted
  }),
    test.skip("Pesquisa por Capital", async () => {
      const wrapper = shallowMount(BarraPesquisa, {
        store,
        localVue,
        data() {
          return {
            tipoFiltroSelecionado: "Capital"
          };
        }
      });

      await flushPromises();

      const autocomplete_tipoFiltro = wrapper.find("#autocomplete_tipoFiltro");
      const autocomplete_filtro = wrapper.find("#autocomplete_filtro");

      // Preenche autocomplete filtro com o item do meio da lista
      wrapper.vm.filtroSelecionado =
        autocomplete_filtro.vm.items[autocomplete_filtro.vm.items.length / 2];
      await wrapper.vm.$nextTick();

      //Confere se o carregamento dos dados iniciais funcionou
      expect(autocomplete_tipoFiltro.vm.value).toEqual(
        wrapper.vm.tipoFiltroSelecionado
      );
      expect(autocomplete_filtro.vm.value).toEqual(
        wrapper.vm.filtroSelecionado
      );

      // Aciona o botao de pesquisar
      const btnPesquisarPaises = wrapper.find("#btnPesquisarPaises");
      await btnPesquisarPaises.trigger("click");

      // Verifica se a funcao que modifica a store foi chamada
      //expect(actions.actionInput).toHaveBeenCalled()
      expect(actions.saveSearchOptions).toHaveBeenCalled();

      // Verifica se a Store foi modificada
      expect(store.state.searchOptions.filtrarPor).toEqual(
        wrapper.vm.tipoFiltroSelecionado
      );
      expect(store.state.searchOptions.filtro).toEqual(
        wrapper.vm.filtroSelecionado
      );
    })
});
