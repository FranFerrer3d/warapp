<template>
  <v-container>
    <v-row class="my-4" justify="center">
      <ModernButton color="primary" class="full-btn" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </ModernButton>
    </v-row>
    <hr />

    <v-tabs v-model="tab" grow>
      <v-tab value="players">Usuarios</v-tab>
      <v-tab value="reports">Reportes</v-tab>
      <v-tab value="teams">Equipos</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-4">
      <v-window-item value="players">
        <v-alert v-if="playerError" type="error" class="mb-2">{{ playerError }}</v-alert>
        <v-row class="mb-2" justify="end">
          <ModernButton color="primary" @click="openNewPlayer">Nuevo Usuario</ModernButton>
        </v-row>
        <v-table dense>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias</th>
              <th>Email</th>
              <th>Equipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in players" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.alias || p.nombre }}</td>
              <td>{{ p.email }}</td>
              <td>{{ p.equipo || p.team }}</td>
              <td>
                <v-btn size="small" color="secondary" class="mr-2" @click="openEditPlayer(p)">Editar</v-btn>
                <v-btn size="small" color="error" @click="removePlayer(p.id)">Eliminar</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>

      <v-window-item value="reports">
        <v-alert v-if="reportError" type="error" class="mb-2">{{ reportError }}</v-alert>
        <v-row class="mb-2" justify="end">
          <ModernButton color="primary" @click="$router.push('/create-report')">Nuevo Reporte</ModernButton>
        </v-row>
        <v-table dense>
          <thead>
            <tr>
              <th>ID</th>
              <th>Jugador A</th>
              <th>Jugador B</th>
              <th>Mapa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reports" :key="r.id">
              <td>{{ r.id }}</td>
              <td>{{ r.playerA?.alias }}</td>
              <td>{{ r.playerB?.alias }}</td>
              <td>{{ r.map }}</td>
              <td>
                <v-btn size="small" color="secondary" class="mr-2" @click="editReport(r.id)">Editar</v-btn>
                <v-btn size="small" color="error" @click="removeReport(r.id)">Eliminar</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>

      <v-window-item value="teams">
        <v-alert v-if="teamError" type="error" class="mb-2">{{ teamError }}</v-alert>
        <v-row class="mb-2" justify="end">
          <ModernButton color="primary" @click="openNewTeam">Nuevo Equipo</ModernButton>
        </v-row>
        <v-table dense>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in teams" :key="t.id">
              <td>{{ t.id }}</td>
              <td>{{ t.nombre || t.name }}</td>
              <td>
                <v-btn size="small" color="secondary" class="mr-2" @click="openEditTeam(t)">Editar</v-btn>
                <v-btn size="small" color="error" @click="removeTeam(t.id)">Eliminar</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>
    </v-window>
    <v-dialog v-model="playerDialog" max-width="500">
      <v-card>
        <v-card-title>{{ editingPlayer.id ? 'Editar Usuario' : 'Nuevo Usuario' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="savePlayer">
            <v-text-field v-model="editingPlayer.nombre" label="Nombre" />
            <v-text-field v-model="editingPlayer.apellidos" label="Apellidos" />
            <v-text-field v-model="editingPlayer.alias" label="Alias" required />
            <v-text-field v-model="editingPlayer.email" label="Correo" required />
            <v-text-field
              v-model="editingPlayer.contraseña"
              label="Contraseña"
              type="password"
              :required="!editingPlayer.id"
            />
            <ModernButton type="submit" color="primary" class="mt-2" :loading="savingPlayer">Guardar</ModernButton>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="teamDialog" max-width="400">
      <v-card>
        <v-card-title>{{ editingTeam.id ? 'Editar Equipo' : 'Nuevo Equipo' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveTeam">
            <v-text-field v-model="editingTeam.nombre" label="Nombre" required />
            <ModernButton type="submit" color="primary" class="mt-2" :loading="savingTeam">Guardar</ModernButton>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  getAllPlayers,
  deletePlayer,
  createPlayer,
  updatePlayer
} from '@/services/playerService'
import { getAllReports, deleteReport } from '@/services/reportService'
import {
  getAllTeams,
  deleteTeam,
  createTeam,
  updateTeam
} from '@/services/teamService'
import ModernButton from '@/components/ModernButton.vue'

export default {
  components: { ModernButton },
  data() {
    return {
      tab: 'players',
      players: [],
      reports: [],
      teams: [],
      playerError: null,
      reportError: null,
      teamError: null,
      playerDialog: false,
      editingPlayer: {
        id: null,
        nombre: '',
        apellidos: '',
        alias: '',
        email: '',
        contraseña: ''
      },
      savingPlayer: false,
      teamDialog: false,
      editingTeam: { id: null, nombre: '' },
      savingTeam: false
    }
  },
  created() {
    this.fetchPlayers()
    this.fetchReports()
    this.fetchTeams()
  },
  methods: {
    openNewPlayer() {
      this.editingPlayer = {
        id: null,
        nombre: '',
        apellidos: '',
        alias: '',
        email: '',
        contraseña: ''
      }
      this.playerDialog = true
    },
    openEditPlayer(player) {
      this.editingPlayer = { ...player }
      this.playerDialog = true
    },
    async savePlayer() {
      this.savingPlayer = true
      try {
        if (this.editingPlayer.id) {
          await updatePlayer(this.editingPlayer)
        } else {
          await createPlayer(this.editingPlayer)
        }
        await this.fetchPlayers()
        this.playerDialog = false
      } catch (err) {
        console.error('Error saving player', err)
      } finally {
        this.savingPlayer = false
      }
    },
    async fetchPlayers() {
      try {
        const { data } = await getAllPlayers()
        this.players = Array.isArray(data) ? data : data?.players || []
      } catch (err) {
        console.error('Error fetching players', err)
        this.playerError = 'Error obteniendo jugadores'
      }
    },
    async fetchReports() {
      try {
        const { data } = await getAllReports()
        this.reports = Array.isArray(data) ? data : data?.reports || []
      } catch (err) {
        console.error('Error fetching reports', err)
        this.reportError = 'Error obteniendo reportes'
      }
    },
    async fetchTeams() {
      try {
        const { data } = await getAllTeams()
        this.teams = Array.isArray(data) ? data : data?.teams || []
      } catch (err) {
        console.error('Error fetching teams', err)
        this.teamError = 'Error obteniendo equipos'
      }
    },
    async removePlayer(id) {
      if (!confirm('¿Eliminar jugador?')) return
      try {
        await deletePlayer(id)
        this.players = this.players.filter(p => p.id !== id)
      } catch (err) {
        console.error('Error deleting player', err)
      }
    },
    async removeReport(id) {
      if (!confirm('¿Eliminar reporte?')) return
      try {
        await deleteReport(id)
        this.reports = this.reports.filter(r => r.id !== id)
      } catch (err) {
        console.error('Error deleting report', err)
      }
    },
    editReport(id) {
      this.$router.push(`/edit-report/${id}`)
    },
    async removeTeam(id) {
      if (!confirm('¿Eliminar equipo?')) return
      try {
        await deleteTeam(id)
        this.teams = this.teams.filter(t => t.id !== id)
      } catch (err) {
        console.error('Error deleting team', err)
      }
    },
    openNewTeam() {
      this.editingTeam = { id: null, nombre: '' }
      this.teamDialog = true
    },
    openEditTeam(team) {
      this.editingTeam = { ...team }
      this.teamDialog = true
    },
    async saveTeam() {
      this.savingTeam = true
      try {
        if (this.editingTeam.id) {
          await updateTeam(this.editingTeam)
        } else {
          await createTeam({ nombre: this.editingTeam.nombre })
        }
        await this.fetchTeams()
        this.teamDialog = false
      } catch (err) {
        console.error('Error saving team', err)
      } finally {
        this.savingTeam = false
      }
    }
  }
}
</script>

<style scoped>
.v-table th {
  text-align: center;
}
.v-table td {
  text-align: center;
}
</style>

