<template>
  <v-app>
    <!-- <v-app-bar color="primary" dark app>
      <v-toolbar-title>⚔️ Battle Reports ⚔️</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout" v-if="isAuthenticated">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar> -->

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return !!sessionStorage.getItem("token");
    },
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      this.$router.push("/"); // 👈 A la raíz
    },
  },
};
</script>

<style scoped>
.v-application {
  font-family: "Roboto", sans-serif;
}
</style>
