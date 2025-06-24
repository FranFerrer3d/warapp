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

              <v-btn
                :loading="loading"
                :disabled="loading"
                type="submit"
                color="primary"
                block
              >
                Entrar
              </v-btn>
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
import { login } from "@/services/authService";
import { getPlayerByEmail } from "@/services/playerService";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.loading = true;
      try {
        const { data } = await login({
          user: this.email,
          pass: this.password,
        });
        localStorage.setItem("token", data.token);

        const { data: userData } = await getPlayerByEmail(this.email);
        sessionStorage.setItem("user", JSON.stringify(userData));

        this.$router.push("/dashboard");
      } catch (err) {
        this.error =
          err.response?.data?.message || "Correo o contraseña incorrectos";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  background-image: url("../../public/Login_Gif.gif");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Viñeteado: oscurece bordes para enfocar el centro */
.v-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Viñeteado + difuminado arriba y abajo */
  background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0) 20%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 20%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 20%);
  z-index: 1;
}

/* Tarjeta de login con efecto blur + transparencia */
.v-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  color: #ffffff;
  z-index: 2;
  position: relative;
}

/* Ajustes para campos de texto en fondo claro */
.v-text-field input {
  color: white !important;
}
.v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}
.v-input__control {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
