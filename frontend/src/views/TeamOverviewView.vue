<template>
  <v-container>
    <!-- Return button -->
    <v-row class="my-4" justify="center">
      <ModernButton color="primary" class="full-btn" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </ModernButton>
    </v-row>
    <hr />

    <v-row class="mb-6">
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>Gestión del Equipo</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveTeam">
              <v-text-field v-model="team.nombre" label="Nombre del Equipo" required />
              <ModernButton type="submit" color="primary" class="mt-2" :loading="savingTeam">
                {{ hasTeam ? 'Guardar Cambios' : 'Crear Equipo' }}
              </ModernButton>
              <ModernButton v-if="hasTeam" color="error" class="mt-2" @click="deleteTeamDialog = true">
                Eliminar Equipo
              </ModernButton>
            </v-form>
            <v-alert v-if="teamError" type="error" class="mt-2">{{ teamError }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteTeamDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Deseas eliminar este equipo?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteTeamDialog = false">Cancelar</v-btn>
          <v-btn text color="error" @click="deleteTeam">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="12">
        <ModernButton color="primary" class="mb-4" @click="$router.push('/team-management/create-player')">Nuevo Jugador</ModernButton>
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
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from '@/services/teamService'
import TeamStats from '@/components/TeamStats.vue'
import ModernButton from '@/components/ModernButton.vue'
import { getSessionUser } from '@/utils/session.js'

export default {
  components: { TeamStats, ModernButton },
  data() {
    return {
      players: [],
      playerStats: [],
      selectedPlayers: [],
      detailDialog: false,
      selectedPlayerId: null,
      team: { id: null, nombre: '' },
      savingTeam: false,
      teamError: null,
      deleteTeamDialog: false,
      teams: []
    }
  },
  computed: {
    filteredStats() {
      if (!this.selectedPlayers.length) {
        return this.playerStats
      }
      return this.playerStats.filter(s => this.selectedPlayers.includes(s.player.id))
    },
    hasTeam() {
      return !!this.team.nombre
    }
  },
  created() {
    this.fetchCurrentTeam()
    this.fetchPlayers()
  },
  methods: {
    getUserTeam() {
      const user = getSessionUser()
      if (!user) return ''
      return user.equipo || user.team || ''
    },
    async fetchCurrentTeam() {
      try {
        const { data } = await getAllTeams()
        this.teams = Array.isArray(data) ? data : data?.teams || []
        const name = this.getUserTeam()
        const found = this.teams.find(t => (t.nombre || t.name) === name)
        if (found) {
          this.team.id = found.id || found.teamId || found.Id || found.ID
          this.team.nombre = found.nombre || found.name
        } else {
          this.team.nombre = name
        }
      } catch (err) {
        console.error('Error fetching team', err)
      }
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
    async saveTeam() {
      this.savingTeam = true
      this.teamError = null
      try {
        if (this.hasTeam && this.team.id) {
          await updateTeam(this.team)
        } else {
          const { data } = await createTeam({ nombre: this.team.nombre })
          this.team.id = data?.id || data?.teamId || this.team.id
        }
        const u = getSessionUser() || {}
        u.equipo = this.team.nombre
        sessionStorage.setItem('user', JSON.stringify(u))
        await this.fetchPlayers()
      } catch (err) {
        console.error('Error saving team', err)
        this.teamError = 'Error guardando equipo'
      } finally {
        this.savingTeam = false
      }
    },
    async deleteTeam() {
      if (!this.team.id) {
        this.deleteTeamDialog = false
        return
      }
      try {
        await deleteTeam(this.team.id)
        const u = getSessionUser() || {}
        u.equipo = ''
        sessionStorage.setItem('user', JSON.stringify(u))
        this.team = { id: null, nombre: '' }
        this.players = []
        this.playerStats = []
      } catch (err) {
        console.error('Error deleting team', err)
        this.teamError = 'Error eliminando equipo'
      } finally {
        this.deleteTeamDialog = false
      }
    },
    openDetail(id) {
      this.selectedPlayerId = id
      this.detailDialog = true
    }
  }
}
</script>


