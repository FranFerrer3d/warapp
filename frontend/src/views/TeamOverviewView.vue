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
      <v-col cols="12">
        <v-btn color="primary" class="modern-btn mb-4" @click="$router.push('/team-management/create-player')">Nuevo Jugador</v-btn>
      </v-col>
      <!-- Team Statistics -->
      <v-col cols="12">
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
                  <th>Ganadas</th>
                  <th>Empatadas</th>
                  <th>Perdidas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in filteredStats" :key="stat.player.id">
                  <td>{{ stat.player.alias }}</td>
                  <td>{{ stat.games }}</td>
                  <td>{{ stat.wins }}</td>
                  <td>{{ stat.draws }}</td>
                  <td>{{ stat.losses }}</td>
                  <td>
                    <v-btn size="small" color="secondary" @click="openDetail(stat.player.id)">
                      Más información
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="detailDialog" max-width="900px">
      <v-card>
        <v-card-title>Detalles Jugador</v-card-title>
        <v-card-text>
          <TeamStats :player-id="selectedPlayerId" v-if="detailDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getAllPlayers } from '@/services/playerService'
import { getReportsByPlayer } from '@/services/reportService'
import TeamStats from '@/components/TeamStats.vue'

export default {
  components: { TeamStats },
  data() {
    return {
      players: [],
      playerStats: [],
      selectedPlayers: [],
      detailDialog: false,
      selectedPlayerId: null
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
    openDetail(id) {
      this.selectedPlayerId = id
      this.detailDialog = true
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

