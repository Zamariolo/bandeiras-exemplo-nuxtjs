<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col
        ><h1 text-align='center'>
          Não temos informação para mostrar aqui =[
        </h1></v-col
      >
    </v-row>

    <v-row align="center" justify="center">
      <v-btn elevation="2" outlined rounded @click="$router.push('/')"
        >Encontrar países!</v-btn
      >
    </v-row>
  </v-container>
</template>

<style scoped>
h1 {
  margin-top: 40px;
  text-align: center;
}
</style>
