<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-toolbar-title>⚔️ Warhammer Reports</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout" v-if="isAuthenticated">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token");
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.v-application {
  font-family: "Merriweather", serif;
}
</style>
