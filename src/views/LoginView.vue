<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-center">Iniciar Sesión</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                required
              />
              <v-btn type="submit" color="primary" block>Entrar</v-btn>
            </v-form>
            <v-alert v-if="error" type="error" class="mt-4">
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    handleLogin() {
      // Mock de backend
      const mockUser = {
        email: "admin@warhammer.com",
        password: "123456",
        token: "mock-token-123",
      };

      if (
        this.email === mockUser.email &&
        this.password === mockUser.password
      ) {
        // Guardamos token falso en localStorage
        localStorage.setItem("token", mockUser.token);
        localStorage.setItem("user", JSON.stringify({ email: this.email }));
        // Redirigimos al Dashboard
        this.$router.push("/dashboard");
      } else {
        this.error = "Correo o contraseña incorrectos";
      }
    },
  },
};
</script>
