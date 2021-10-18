<template>
  <div class="corpo">
    <div class="painel-pais-selecionado">
      <v-layout v-if="$vuetify.breakpoint.smAndUp">
        <v-flex>
          <v-layout justify-center>
            <img
              class="img-bandeira-info"
              v-bind:src="dadosPaisSelecionado.flag"
            />
          </v-layout>
        </v-flex>
        <v-flex class="painel-dados-texto-pais">
          <p>Nome: {{ dadosPaisSelecionado.translations.pt }}</p>
          <p>Capital: {{ dadosPaisSelecionado.capital }}</p>
          <p>Região: {{ dadosPaisSelecionado.region }}</p>
          <p>Subregião: {{ dadosPaisSelecionado.subregion }}</p>
          <p>População: {{ dadosPaisSelecionado.populacao_separador }}</p>
          <p>Idioma(s): {{ dadosPaisSelecionado.idioma }}</p>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-else>
        <v-flex xs12 col="12">
          <v-layout justify-center>
            <img
              class="img-bandeira-info-mobile"
              v-bind:src="dadosPaisSelecionado.flag"
            />
          </v-layout>
        </v-flex>
        <v-flex class="painel-dados-texto-pais">
          <v-layout justify-center mb-2
            >Nome: {{ dadosPaisSelecionado.translations.pt }}</v-layout
          >
          <v-layout justify-center mb-2
            >Capital: {{ dadosPaisSelecionado.capital }}</v-layout
          >
          <v-layout justify-center mb-2
            >Região: {{ dadosPaisSelecionado.region }}</v-layout
          >
          <v-layout justify-center mb-2
            >Subregião: {{ dadosPaisSelecionado.subregion }}</v-layout
          >
          <v-layout justify-center mb-2
            >População: {{ dadosPaisSelecionado.populacao_separador }}</v-layout
          >
          <v-layout justify-center mb-2
            >Idioma(s): {{ dadosPaisSelecionado.idioma }}</v-layout
          >
        </v-flex>
      </v-layout>
    </div>

    <v-layout
      justify-center
      mb-5
      class="titulo-paises-vizinhos"
      v-if="showTituloPaisesVizinhos"
      >Países vizinhos:</v-layout
    >

    <v-layout justify-center mb-5 class="titulo-paises-vizinhos" v-else
      >Não possui países vizinhos</v-layout
    >

    <div class="painel-paises-vizinhos">
      <ListaBandeiras
        v-bind:paises="paisesVizinhosPagination"
        @paisSelecionado="abreInfoPais"
      ></ListaBandeiras>
    </div>

    <div class="painel-pagination" v-show="showPagination">
      <v-pagination
        v-model="page"
        :length="pagesQuantity"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import ListaBandeiras from "@/components/ListaBandeiras/ListaBandeiras.vue";
import axios from "axios";

export default {
  components: {
    ListaBandeiras
  },

  data() {
    return {
      // Dados de exibicao
      paisApresentado: "",
      dadosPaisSelecionado: {
        translations: { pt: "" },
        capital: "",
        region: "",
        subregion: ""
      },
      dadosPaisesVizinhos: [],

      // Configuracao do pagination de paises vizinhos
      page: 1,
      perPage: 3
    };
  },

  created() {
    // Recebe o codigo do pais selecionado pela url
    this.paisApresentado = this.$route.params.pid;
    // Carrega as informacoes do pais selecionado
    let filtros =
      "?fields=flag,name,capital,region,subregion,population,languages,borders,translations";
    let url =
      "https://restcountries.com/v2/alpha/" + this.paisApresentado + filtros;
    axios.get(url).then(resposta => {
      this.dadosPaisSelecionado = resposta.data;

      // Carregando as informacoes dos paises vizinhos para exibicao
      filtros = "?fields=flag,alpha3Code,name";
      let paisesVizinhos = [];

      for (var codigoPais of this.dadosPaisSelecionado.borders) {
        let url = "https://restcountries.com/v2/alpha/" + codigoPais + filtros;
        axios.get(url).then(resposta => {
          paisesVizinhos.push(resposta.data);
          this.dadosPaisesVizinhos = paisesVizinhos;
        });
      }

      // Gerando os idiomas em formato de texto
      let list_idiomas = this.dadosPaisSelecionado.languages.map(
        a => a.nativeName
      );
      let string_idiomas = list_idiomas.join(", ");
      this.dadosPaisSelecionado["idioma"] = string_idiomas;

      // Gerando a informacao de populacao com separador de milhares
      this.dadosPaisSelecionado["populacao_separador"] = parseFloat(
        this.dadosPaisSelecionado.population
      ).toLocaleString("en");
    });
  },

  methods: {
    abreInfoPais(codigoPais) {
      // Abre a tela e carrega informacoes
      this.$router.push({ path: `/info/${codigoPais}` });
    }
  },

  computed: {
    itemQuantity() {
      // Retorna a quantidade de items para serem mostrados
      return this.dadosPaisesVizinhos.length;
    },

    pagesQuantity() {
      // Retorna a quantidade de paginas necessarias para a pagination
      return Math.ceil(this.itemQuantity / this.perPage);
    },

    paisesVizinhosPagination() {
      return this.dadosPaisesVizinhos.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },

    showPagination() {
      // Se tiver mais de uma pagina, entao mostra o elemento de pagination
      return this.pagesQuantity > 1 ? true : false;
    },

    showTituloPaisesVizinhos() {
      // Se nao houver paises vizinhos, indicar no texto de titulo
      return this.itemQuantity > 0 ? true : false;
    }
  }
};
</script>

<style>
.corpo {
  margin: 0 auto;
  margin-top: 60px;
  padding-bottom: 80px;
}

.painel-dados-texto-pais {
  font-size: 20px;
  color: #333333;
}

.img-bandeira-info {
  width: 416px !important;
  object-fit: cover;
  border: solid 0.2px #333333;
}

.img-bandeira-info-mobile {
  width: 90%;
  margin: 0 auto;
  border: solid 0.2px #333333;
}

.titulo-paises-vizinhos {
  margin-top: 50px;
  font-size: 20px;
  color: #333333;
}
</style>
