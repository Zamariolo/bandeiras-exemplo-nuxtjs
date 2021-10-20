//Fundamentals
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify";
//Axios
//import axios from "axios";
//import flushPromises from "flush-promises";
//Componentes
import IndexPage from "@/pages/index.vue";
//Resposta fake para popularComponente
import { searchCountriesResponse } from "./mockResponse";

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
});

describe("Carregamento e gerenciamento da exibicao", () => {
  test("Recebe paises filtrados do componente barra de pesquisa", async () => {
    const wrapper = shallowMount(IndexPage, {
      data() {
        return {
          perPage: 5
        };
      }
    });

    // Verifica se nao ha paises sendo exibidos
    expect(wrapper.vm.paisesFiltrados).toHaveLength(0);

    // Inserindo dados
    await wrapper.vm.recebePaisesFiltrados(searchCountriesResponse);

    // Verifica se paises foram apresentados
    expect(wrapper.vm.paisesFiltrados).toHaveLength(
      searchCountriesResponse.length
    );
    expect(wrapper.vm.paisesFiltrados).toEqual(expect.any(Array));
  }),
    test("Testa funcionamento do pagination", async () => {
      let itensPorPagina = 4;

      const wrapper = shallowMount(IndexPage, {
        data() {
          return {
            perPage: itensPorPagina,
            paisesFiltrados: searchCountriesResponse
          };
        }
      });

      // --------- 3 paginas, com controle de pagination

      // Verifica pagination adequado (mais do que a qntd de items por pagina)
      expect(wrapper.vm.pagesQuantity).toBe(
        Math.ceil(searchCountriesResponse.length / itensPorPagina)
      );
      // Verifica que controladores do pagination estao visiveis
      expect(wrapper.vm.showPagination).toBe(true);
      expect(wrapper.find(".painel-pagination").isVisible()).toBe(true);

      // --------- 1 pagina, sem controle pagination

      // Verifica pagination (uma unica pagina)
      itensPorPagina = 12;
      wrapper.vm.perPage = itensPorPagina;
      expect(wrapper.vm.pagesQuantity).toBe(
        Math.ceil(searchCountriesResponse.length / itensPorPagina)
      );
      // Verifica que controladores do pagination NAO estao visiveis
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.showPagination).toBe(false);
      expect(wrapper.find(".painel-pagination").isVisible()).toBe(false);
    }),
    test("Limpa resultados - limpa todos os paises exibidos", async () => {
      const wrapper = shallowMount(IndexPage, {
        data() {
          return {
            paisesFiltrados: searchCountriesResponse
          };
        }
      });
      const btnLimpaResultados = wrapper.find(".btn_limpaBusca");

      //Verifica que possui dados apresentados
      expect(wrapper.vm.paisesFiltrados).toEqual(searchCountriesResponse);
      // Verifica que a funcionalidade limpar resultados funcionou
      await btnLimpaResultados.trigger("click");
      expect(wrapper.vm.paisesFiltrados).toHaveLength(0);
    });
});

describe("Mudança de paginas", () => {
  test("Envia a quantidade e o argumento correto ao abrir pagina", () => {
    const mockRouter = {
      push: jest.fn()
    };

    const wrapper = shallowMount(IndexPage, {
      mocks: {
        $router: mockRouter
      }
    });

    const codigosPaises = ["BRA", "PRT", "AGN", "ARG"];

    for (let cod of codigosPaises) {
      wrapper.vm.abreInfoPais(cod);
      expect(mockRouter.push).toBeCalledWith({ path: `/info/${cod}` });
    }

    expect(mockRouter.push).toHaveBeenCalledTimes(codigosPaises.length);
  });
});
