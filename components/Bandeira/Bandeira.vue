<template>
  <v-layout row wrap justify-center>
    <img
      class="bandeira"
      v-for="pais of paises"
      v-bind:key="pais.name"
      v-bind:src="pais.flag"
      v-bind:alt="pais.name"
      @click="retornaCodigoPais(pais.alpha3Code)"
    />
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  props: ["paises"],

  methods: {
    async requestAPI(url) {
      return (await axios.get(url)).data;
    },

    retornaCodigoPais(codigoPais) {
      // Envia o codigo iso639-1 do pais selecionado para o componente pai
      this.$emit("paisSelecionado", codigoPais);
    },
  },
};
</script>

<style scoped>
.bandeira {
  height: 181px !important;
  width: 316px !important;
  object-fit: cover;
  cursor: pointer;
  margin: 10px;
  transition: all 0.2s ease-in-out;
  text-align: center;
}

.bandeira:hover {
  transform: scale(1.1);
}
</style>
