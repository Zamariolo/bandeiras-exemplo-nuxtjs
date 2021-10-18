<template>
  <div class="painel-barra-pesquisa">
    <v-row class="painel-titulos-autocomplete">
      <v-col>
        <p class="titulo-autocomplete">Filtrar por:</p>
      </v-col>
      <v-col>
        <p class="titulo-autocomplete" v-show="tipoFiltroSelecionado">
          {{ tipoFiltroSelecionado }}
        </p>
      </v-col>
      <v-col></v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-autocomplete
          clearable
          filled
          rounded
          v-bind:items="tipoFiltros"
          v-model="tipoFiltroSelecionado"
          id="autocomplete_tipoFiltro"
        ></v-autocomplete>
      </v-col>
      <v-col>
        <transition name="autocomplete_filtro">
          <v-autocomplete
            clearable
            filled
            rounded
            v-bind:items="filtro"
            v-show="tipoFiltroSelecionado"
            v-model="filtroSelecionado"
            id="autocomplete_filtro"
          ></v-autocomplete>
        </transition>
      </v-col>
      <v-col>
        <v-btn
          block
          color="#6D2080"
          class="btn-pesquisar"
          large
          rounded
          :disabled="!filtroSelecionado"
          @click="pesquisarPaises()"
          >Pesquisar</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tipoFiltros: ["Região", "Capital", "Língua", "País", "Código de ligação"],

      //  DADOS DAS ENTRADAS DE AUTOCOMPLETE - FILTRO
      // Dict contendo regioes para apresentacao e para uso de api (pt-br e ingles)
      todasRegioes: [
        { regiao_ptbr: "África", region_en: "Africa" },
        { regiao_ptbr: "Américas", region_en: "Americas" },
        { regiao_ptbr: "Ásia", region_en: "Asia" },
        { regiao_ptbr: "Europa", region_en: "Europe" },
        { regiao_ptbr: "Oceania", region_en: "Oceania" }
      ],

      todasCapitais: [],
      todosIdiomas: [],
      todosPaises: [],
      todosCodigosLigacao: [],

      // Valores selecionados nos autocompletes
      tipoFiltroSelecionado: "",
      filtroSelecionado: ""
    };
  },

  computed: {
    filtro() {
      // Preenche os dados do segundo autocomplete (filtro) de acordo com o selecionado no primeiro autocomplete
      if (this.tipoFiltroSelecionado == "Região") {
        return this.todasRegioes.map(a => a.regiao_ptbr);
      } else if (this.tipoFiltroSelecionado == "Capital") {
        return this.todasCapitais;
      } else if (this.tipoFiltroSelecionado == "Língua") {
        return this.todosIdiomas.map(idioma => idioma.name).sort();
      } else if (this.tipoFiltroSelecionado == "País") {
        return this.todosPaises.map(pais => pais.name).sort();
      } else if (this.tipoFiltroSelecionado == "Código de ligação") {
        return this.todosCodigosLigacao;
      } else {
        return [""];
      }
    }
  },

  methods: {
    async pesquisarPaises() {
      // Descr: Acoes executadas apos o clique do botao pesquisar

      // Se tudo estiver ok
      // Identifica o tipo de busca e monta a url da request
      let url = "";
      let arg = this.filtroSelecionado;
      let filtros = "?fields=flag,alpha3Code,name";
      switch (this.tipoFiltroSelecionado) {
        case "Região":
          // Obtem a regiao selecionada em ingles para uso da api
          let regiaoSelecionada_ingles = Object.values(
            this.todasRegioes.filter(obj => {
              return obj.regiao_ptbr == arg;
            })[0]
          )[1];
          url =
            "https://restcountries.com/v2/continent/" +
            regiaoSelecionada_ingles +
            filtros;
          break;

        case "Capital":
          url = "https://restcountries.com/v2/capital/" + arg + filtros;
          break;

        case "Língua":
          // Converter para idioma na iso369_1
          let idioma_iso3691 = Object.values(
            this.todosIdiomas.filter(obj => {
              return obj.name == arg;
            })[0]
          )[0];
          url = "https://restcountries.com/v2/lang/" + idioma_iso3691 + filtros;
          break;

        case "País":
          // Converte país em ptbr para codigo alpha3code
          let codigoPais = Object.values(
            this.todosPaises.filter(obj => {
              return obj.name == arg;
            })[0]
          )[1];
          url = "https://restcountries.com/v2/alpha/" + codigoPais + filtros;
          break;

        case "Código de ligação":
          url = "https://restcountries.com/v2/callingcode/" + arg + filtros;
          break;
      }

      this.paisesFiltrados = (await axios.get(url)).data;

      // No caso de busca por país, retorna apenas um object e nao um array => padronizar
      if (this.tipoFiltroSelecionado == "País") {
        this.paisesFiltrados = [this.paisesFiltrados];
      }

      // Salva configuracoes de pesquisa na store
      this.$store.dispatch("saveSearchOptions", {
        filtrarPor: this.tipoFiltroSelecionado,
        filtro: this.filtroSelecionado,
        loadedCountries: this.paisesFiltrados
      });

      // Retorna os dados para o parent
      this.$emit("retornandoPaisesFiltrados", this.paisesFiltrados);
    },
  },

  async created() {
    // A barra de pesquisa ao ser carregada, preenche o autocomplete com os dados

    let url =
      "https://restcountries.com/v2/all?fields=name,capital,languages,callingCodes,alpha3Code,translations";

    await axios.get(url).then(response => {
      let resposta = response.data;

      // Todas capitais
      this.todasCapitais = resposta
        .map(pais => pais.capital)
        .filter(item => item)
        .sort();

      // Todos codigos de ligacao
      let codigosLigacao = resposta
        .map(pais => pais.callingCodes)
        .flat()
        .filter(item => item)
        .sort();
      this.todosCodigosLigacao = [...new Set(codigosLigacao)];

      // Todos idiomas (array of objects -> contendo nome e codigo de busca)
      let obj_idiomas = resposta.map(pais => pais.languages).flat();
      // Removendo duplicatas
      this.todosIdiomas = [
        ...new Map(obj_idiomas.map(item => [item.iso639_1, item])).values()
      ];

      // Todos paises (array of objects  -> contendo nome ptbr e codigo de busca)
      let list_nomePaises = resposta.map(pais => pais.translations.pt).flat();
      let list_alpha3code = resposta.map(pais => pais.alpha3Code).flat();
      for (let i of Array(list_nomePaises.length).keys()) {
        this.todosPaises.push({
          name: list_nomePaises[i],
          code: list_alpha3code[i]
        });
      }
    });

    // Ao inicializar, busca se existem dados de pesquisa salvos na store, se sim, os carrega
    if (this.$store.state.searchOptions.filtrarPor) {
      this.tipoFiltroSelecionado = this.$store.state.searchOptions.filtrarPor;
      this.filtroSelecionado = this.$store.state.searchOptions.filtro;
      this.$emit(
        "retornandoPaisesFiltrados",
        this.$store.state.loadedCountries
      );
    }
  }
};
</script>

<style scoped>
.painel-barra-pesquisa {
  margin: 0 auto;
  width: 90%;
  margin-top: 40px;
}

.painel-titulos-autocomplete {
  margin: 0px;
  padding: 0px;
  height: 20px;
}

.titulo-autocomplete {
  color: #6d2080 !important;
  margin-bottom: 0px;
  padding-bottom: 0px;
  height: 100%;
  vertical-align: bottom;
}

.btn-pesquisar {
  color: white;
}

/* Transicao fade segundo autocomplete (filtro)*/
.autocomplete_filtro-enter,
.autocomplete_filtro-leave-active {
  opacity: 0;
}

.autocomplete_filtro-enter-active,
.autocomplete_filtro-leave-active {
  transition: opacity 0.4s;
}
</style>
