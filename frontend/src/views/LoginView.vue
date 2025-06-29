<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4 login-card">
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
                block
                class="modern-btn full-btn"
              >
                Entrar
              </v-btn>
            </v-form>

            <v-alert v-if="error" type="error" class="mt-4">
              {{ error }}
            </v-alert>

            <!-- <div v-if="loading" class="text-center mt-4">
              <v-progress-circular indeterminate color="cyan lighten-2" />
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { login } from "@/services/authService";

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

        const token = data.token || data.Token;
        if (token) {
          localStorage.setItem("token", token);
        }

        const player = data.player || data.user || data;
        if (!player) throw new Error("Usuario no encontrado");

        sessionStorage.setItem("user", JSON.stringify(player));
        this.$router.push("/dashboard");
      } catch (err) {
        this.error =
          err.message ||
          err.response?.data?.message ||
          "Correo o contraseña incorrectos";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Bebas+Neue&display=swap");

.v-container {
  background-image: url("../../public/Login_Gif2.gif");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  font-family: "Roboto", sans-serif;
}

.v-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0) 40%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 20%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 20%);
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  z-index: 2;
  position: relative;
}

.v-text-field input {
  color: #fff !important;
}

.v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-input__control {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modern-btn {
  background: linear-gradient(135deg, #00f0ff, #7f00ff);
  color: white;
  font-weight: bold;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.modern-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 12px #7f00ff;
}
</style>
