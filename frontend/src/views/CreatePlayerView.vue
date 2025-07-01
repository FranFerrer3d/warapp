<template>
  <v-container>
    <!-- Return button -->
    <v-row class="my-4" justify="center">
      <v-btn color="primary" class="modern-btn full-btn" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </v-btn>
    </v-row>
    <hr />

    <v-row>
      <!-- Create Player Form -->
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>Crear Nuevo Jugador</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createPlayerSubmit">
              <v-text-field v-model="newPlayer.nombre" label="Nombre" required />
              <v-text-field v-model="newPlayer.apellidos" label="Apellidos" required />
              <v-text-field v-model="newPlayer.alias" label="Alias" required />
              <v-text-field v-model="newPlayer.email" label="Correo" required />
              <v-text-field v-model="newPlayer.contraseña" label="Contraseña" type="password" required />
              <v-btn type="submit" color="primary" class="modern-btn full-btn mt-2" :loading="creating" :disabled="creating">
                Crear
              </v-btn>
              <v-alert v-if="createError" type="error" class="mt-2">{{ createError }}</v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createPlayer } from '@/services/playerService'

export default {
  data() {
    return {
      newPlayer: {
        nombre: '',
        apellidos: '',
        alias: '',
        email: '',
        contraseña: ''
      },
      creating: false,
      createError: null
    }
  },
  methods: {
    getUserTeam() {
      const sessionUser = sessionStorage.getItem('user')
      if (!sessionUser) return ''
      const user = JSON.parse(sessionUser)
      return user.equipo || user.team || ''
    },
    async createPlayerSubmit() {
      this.createError = null
      this.creating = true
      try {
        const team = this.getUserTeam()
        const payload = { ...this.newPlayer, equipo: team, team }
        await createPlayer(payload)
        this.newPlayer = { nombre: '', apellidos: '', alias: '', email: '', contraseña: '' }
      } catch (err) {
        console.error('Error creating player', err)
        this.createError = 'Error creando jugador'
      } finally {
        this.creating = false
      }
    }
  }
}
</script>

<style scoped>
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

@media (max-width: 768px) {
  .modern-btn {
    width: 100%;
    margin: 5px auto;
  }
}
</style>

