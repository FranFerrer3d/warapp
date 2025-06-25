<template>
  <v-container>
    <!-- Button to return to dashboard -->
    <v-row class="my-4" justify="center">
      <v-btn color="primary" class="modern-btn full-btn" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </v-btn>
    </v-row>
    <hr />

    <!-- Profile Edit Card -->
    <v-card class="mx-auto" max-width="600">
      <v-card-title class="text-h6">Mi Perfil</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="saveProfile">
          <v-text-field
            v-model="player.name"
            :rules="[rules.required]"
            label="Nombre"
            outlined
          />
          <v-text-field
            v-model="player.lastName"
            :rules="[rules.required]"
            label="Apellidos"
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
            v-model="player.password"
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
          <v-btn
            type="submit"
            :loading="saving"
            :disabled="saving"
            class="modern-btn full-btn mt-4"
            color="secondary"
          >
            Guardar Cambios
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Reports List -->
    <v-row class="mt-8" justify="center">
      <v-col cols="12" md="8">
        <h2 class="text-center">Reportes Creados</h2>
        <v-list>
          <v-list-item v-for="report in reports" :key="report.id">
            <v-list-item-title>{{ formatDate(report.date) }} - {{ report.opponent?.name }}</v-list-item-title>
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

export default {
  data() {
    return {
      player: {
        name: '',
        lastName: '',
        email: '',
        password: '',
        photo: ''
      },
      rules: {
        required: v => !!v || 'Campo obligatorio',
        email: v => /.+@.+\..+/.test(v) || 'Correo inválido'
      },
      reports: [],
      saving: false,
      deleteDialog: false,
      reportToDelete: null,
    };
  },
  created() {
    this.fetchPlayer();
    this.fetchReports();
  },
  methods: {
    playerId() {
      const sessionUser = sessionStorage.getItem('user');
      if (!sessionUser) return null;
      const user = JSON.parse(sessionUser);
      return user.id ?? user.playerId ?? user.Id ?? user.ID;
    },
    async fetchPlayer() {
      const id = this.playerId();
      if (!id) return;
      try {
        const { data } = await getPlayerById(id);
        Object.assign(this.player, data);
      } catch (err) {
        console.error('Error fetching player', err);
      }
    },
    async fetchReports() {
      const id = this.playerId();
      if (!id) return;
      try {
        const { data } = await getReportsByPlayer(id);
        const rawReports = Array.isArray(data) ? data : data?.reports || [];
        this.reports = rawReports.filter(r => r.playerAId === id);
      } catch (err) {
        console.error('Error fetching reports', err);
      }
    },
    async saveProfile() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;
      this.saving = true;
      const id = this.playerId();
      try {
        await updatePlayer(id, this.player);
        sessionStorage.setItem('user', JSON.stringify(this.player));
      } catch (err) {
        console.error('Error updating player', err);
      } finally {
        this.saving = false;
      }
    },
    handlePhotoChange(file) {
      if (!file) return;
      const selected = Array.isArray(file) ? file[0] : file;
      const reader = new FileReader();
      reader.onload = e => {
        this.player.photo = e.target.result;
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

