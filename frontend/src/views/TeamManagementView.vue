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
      <v-col cols="12" md="4">
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

      <!-- Team Statistics -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Estadísticas del Equipo</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedPlayers"
              :items="players"
              item-title="alias"
              item-value="id"
              multiple
              clearable
              label="Filtrar jugadores"
            />
            <v-table class="mt-4">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Partidas</th>
                  <th>Victorias</th>
                  <th>Derrotas</th>
                  <th>Empates</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in filteredStats" :key="stat.player.id">
                  <td>{{ stat.player.alias }}</td>
                  <td>{{ stat.games }}</td>
                  <td>{{ stat.wins }}</td>
                  <td>{{ stat.losses }}</td>
                  <td>{{ stat.draws }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getAllPlayers, createPlayer } from '@/services/playerService'
import { getReportsByPlayer } from '@/services/reportService'

export default {
  data() {
    return {
      players: [],
      playerStats: [],
      selectedPlayers: [],
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
  computed: {
    filteredStats() {
      if (!this.selectedPlayers.length) {
        return this.playerStats
      }
      return this.playerStats.filter(s => this.selectedPlayers.includes(s.player.id))
    }
  },
  created() {
    this.fetchPlayers()
  },
  methods: {
    getUserTeam() {
      const sessionUser = sessionStorage.getItem('user')
      if (!sessionUser) return ''
      const user = JSON.parse(sessionUser)
      return user.equipo || user.team || ''
    },
    async fetchPlayers() {
      try {
        const { data } = await getAllPlayers()
        const list = Array.isArray(data) ? data : data?.players || []
        const team = this.getUserTeam()
        this.players = list.filter(p => (p.equipo || p.team) === team)
        await this.computeStats()
      } catch (err) {
        console.error('Error fetching players', err)
      }
    },
    async computeStats() {
      const stats = []
      for (const p of this.players) {
        try {
          const playerId = p.id ?? p.playerId ?? p.Id ?? p.ID
          const { data } = await getReportsByPlayer(playerId)
          const raw = Array.isArray(data) ? data : data?.reports || []
          let wins = 0
          let losses = 0
          let draws = 0
          raw.forEach(r => {
            const isA = r.playerAId === playerId
            const scorePlayer = isA ? r.finalScoreA : r.finalScoreB
            const scoreOpp = isA ? r.finalScoreB : r.finalScoreA
            if (scorePlayer > scoreOpp) wins++
            else if (scorePlayer < scoreOpp) losses++
            else draws++
          })
          stats.push({ player: p, games: raw.length, wins, losses, draws })
        } catch (err) {
          console.error('Error stats player', err)
        }
      }
      this.playerStats = stats
    },
    async createPlayerSubmit() {
      this.createError = null
      this.creating = true
      try {
        const team = this.getUserTeam()
        const payload = { ...this.newPlayer, equipo: team, team }
        await createPlayer(payload)
        this.newPlayer = { nombre: '', apellidos: '', alias: '', email: '', contraseña: '' }
        await this.fetchPlayers()
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

