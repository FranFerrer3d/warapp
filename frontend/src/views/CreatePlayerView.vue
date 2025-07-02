<template>
  <v-container>
    <!-- Return button -->
    <v-row class="my-4" justify="center">
      <ModernButton color="primary" class="full-btn" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </ModernButton>
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
              <ModernButton type="submit" color="primary" class="full-btn mt-2" :loading="creating" :disabled="creating">
                Crear
              </ModernButton>
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
import { getSessionUser } from '@/utils/session.js'
import ModernButton from '@/components/ModernButton.vue'

export default {
  components: { ModernButton },
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
      const user = getSessionUser()
      if (!user) return ''
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


