<template>
  <v-app>
    <v-app-bar app color="white" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo MOVA"
          class="shrink mr-2 logo-mova"
          contain
          src="https://mova.vc/img/footer_mova.svg"
          transition="scale-transition"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn dark color="#6D2080" @click="$router.push('/')" outlined>
        <v-icon>mdi-arrow-left</v-icon>
        <span class="mr-2">Voltar</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <transition name="pagina">
        <Nuxt />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
export default {};
</script>

<style>
.logo-mova {
  height: 50px !important;
}

.pagina-enter,
.pagina-leave-active {
  opacity: 0;
}

.pagina-enter-active,
.pagina-leave-active {
  transition: opacity 0.3s;
}
</style>
