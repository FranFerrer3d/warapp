<template>
  <v-container>
    <!-- Button to return to dashboard -->
    <v-row class="my-4" justify="center">
      <ModernButton color="primary" class="full-btn" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </ModernButton>
    </v-row>
    <hr />

    <!-- Profile Edit Card -->
  <v-card class="mx-auto" max-width="600">
      <v-card-title class="text-h6">Mi Perfil</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="saveProfile">
          <v-avatar v-if="player.foto" size="120" class="mx-auto mb-4">
            <v-img :src="player.foto" alt="Foto de perfil" />
          </v-avatar>
          <v-text-field
            v-model="player.nombre"
            :rules="[rules.required]"
            label="Nombre"
            outlined
          />
          <v-text-field
            v-model="player.apellidos"
            :rules="[rules.required]"
            label="Apellidos"
            outlined
          />
          <v-text-field
            v-model="player.alias"
            :rules="[rules.required]"
            label="Alias"
            outlined
          />
          <v-text-field
            v-model="player.email"
            :rules="[rules.required, rules.email]"
            label="Correo"
            type="email"
            outlined
          />
          <v-text-field
            v-model="player.contraseña"
            :rules="[rules.required]"
            label="Contraseña"
            type="password"
            outlined
          />
          <v-file-input
            label="Foto de Perfil"
            accept="image/*"
            @change="handlePhotoChange"
            prepend-icon="mdi-camera"
          />
          <v-select
            v-model="player.equipo"
            :items="teams"
            item-title="nombre"
            item-value="nombre"
            label="Equipo"
            outlined
          />
          <ModernButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            class="full-btn mt-4"
            color="secondary"
          >
            Guardar Cambios
          </ModernButton>
          <v-alert v-if="saveError" type="error" class="mt-4">
            {{ saveError }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Reports List -->
    <v-row class="mt-8" justify="center">
      <v-col cols="12" md="8">
        <h2 class="text-center">Reportes Creados</h2>
        <v-list>
          <v-list-item v-for="report in reports" :key="report.id">
            <v-list-item-title>{{ formatDate(report.date) }} - {{ report.opponent?.nombre }}</v-list-item-title>
            <template #append>
              <v-btn icon color="error" @click="confirmDelete(report)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Deseas eliminar este reporte?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn text color="error" @click="deleteReportConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getPlayerById, updatePlayer } from '@/services/playerService';
import { getReportsByPlayer, deleteReport } from '@/services/reportService';
import { getAllTeams } from '@/services/teamService';
import ModernButton from '@/components/ModernButton.vue';
import { getPlayerId } from '@/utils/session.js';

export default {
  components: { ModernButton },
  data() {
    return {
      player: {
        nombre: '',
        apellidos: '',
        alias: '',
        email: '',
        contraseña: '',
        foto: '',
        equipo: ''
      },
      rules: {
        required: v => !!v || 'Campo obligatorio',
        email: v => /.+@.+\..+/.test(v) || 'Correo inválido'
      },
      reports: [],
      teams: [],
      saving: false,
      deleteDialog: false,
      reportToDelete: null,
      saveError: null,
    };
  },
  created() {
    const id = getPlayerId();
    if (!id) {
      this.$router.push('/');
      return;
    }
    this.fetchPlayer();
    this.fetchReports();
    this.fetchTeams();
  },
  methods: {
    async fetchPlayer() {
      const id = getPlayerId();
      if (!id) return;
      try {
        const { data } = await getPlayerById(id);
        this.player.id = data.id || data.playerId || data.Id || data.ID;
        this.player.nombre = data.nombre || data.name || '';
        this.player.apellidos = data.apellidos || data.lastName || '';
        this.player.alias = data.alias || '';
        this.player.email = data.email || '';
        this.player.equipo = data.equipo || data.team || '';
        this.player.foto = data.foto || data.photo || '';
        if (this.player.foto && !this.player.foto.startsWith('data:')) {
          this.player.foto = `data:image/png;base64,${this.player.foto}`;
        }
      } catch (err) {
        console.error('Error fetching player', err);
      }
    },
    async fetchReports() {
      const id = getPlayerId();
      if (!id) return;
      try {
        const { data } = await getReportsByPlayer(id);
        const rawReports = Array.isArray(data) ? data : data?.reports || [];
        this.reports = rawReports.filter(r => r.playerAId === id);
      } catch (err) {
        console.error('Error fetching reports', err);
      }
    },
    async fetchTeams() {
      try {
        const { data } = await getAllTeams();
        this.teams = Array.isArray(data) ? data : data?.teams || [];
      } catch (err) {
        console.error('Error fetching teams', err);
      }
    },
    async saveProfile() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;
      this.saving = true;
      this.saveError = null;
      try {
        const payload = { ...this.player };
        payload.id = payload.id || getPlayerId();
        if (payload.foto && payload.foto.startsWith('data:')) {
          payload.foto = payload.foto.split(',')[1];
        }
        await updatePlayer(payload);
        sessionStorage.setItem('user', JSON.stringify(payload));
        this.$router.push('/dashboard');
      } catch (err) {
        console.error('Error updating player', err);
        this.saveError = 'Error actualizando perfil';
      } finally {
        this.saving = false;
      }
    },
    handlePhotoChange(file) {
      if (!file) return;
      const selected = Array.isArray(file) ? file[0] : file;
      const reader = new FileReader();
      reader.onload = e => {
        this.player.foto = e.target.result;
      };
      reader.readAsDataURL(selected);
    },
    confirmDelete(report) {
      this.reportToDelete = report;
      this.deleteDialog = true;
    },
    async deleteReportConfirmed() {
      if (!this.reportToDelete) return;
      try {
        await deleteReport(this.reportToDelete.id);
        this.reports = this.reports.filter(r => r.id !== this.reportToDelete.id);
      } catch (err) {
        console.error('Error deleting report', err);
      } finally {
        this.deleteDialog = false;
        this.reportToDelete = null;
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('es-ES', options);
    },
  },
};
</script>


