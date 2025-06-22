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
import { login } from '@/services/authService';

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      this.error = null;
      try {
        const { data } = await login({
          user: this.email,
          pass: this.password,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.response?.data?.message || 'Correo o contraseña incorrectos';
      }
    },
  },
};
</script>

<style scoped></style>
