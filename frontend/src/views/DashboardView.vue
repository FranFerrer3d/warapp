<template>
  <v-container fluid>
    <!-- Botón Nuevo Reporte -->
    <v-row class="my-4" justify="center">
      <v-btn
        color="primary"
        class="modern-btn full-btn mx-2"
        @click="$router.push('/create-report')"
      >
        Nuevo Reporte
      </v-btn>
      <v-btn
        color="secondary"
        class="modern-btn full-btn mx-2"
        @click="$router.push('/statistics')"
      >
        Ver Estadísticas
      </v-btn>
      <v-btn
        color="accent"
        class="modern-btn full-btn mx-2"
        @click="$router.push('/profile')"
      >
        Mi Perfil
      </v-btn>
      <v-btn
        v-if="[1, 2, 3].includes(userRole)"
        color="warning"
        class="modern-btn full-btn mx-2"
        @click="$router.push('/team-management/overview')"
      >
        Gestión de Equipo
      </v-btn>
    </v-row>
    <hr />
    <!-- Buscador -->
    <v-row class="mb-4" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Buscar por oponente, mapa, despliegue o resultado"
          outlined
          clearable
        />
      </v-col>
    </v-row>

    <v-row v-if="fetchError" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-alert type="error" class="mb-4">{{ fetchError }}</v-alert>
      </v-col>
    </v-row>

    <!-- Cards de Reportes -->
    <v-row>
      <v-col
        v-for="report in filteredReports"
        :key="report.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="hoverable position-relative"
          elevation="2"
          :class="cardClass(report)"
          @click="openReportModal(report)"
        >
          <v-card-title class="text-h6">
            <b>Oponente:</b> {{ report.opponent?.nombre }}
            {{ report.opponent?.apellidos }}
            <b>[{{ report.opponent?.alias }}]</b>
          </v-card-title>

          <v-card-subtitle>{{ formatDate(report.date) }}</v-card-subtitle>

          <v-card-text>
            <div><strong>Resultado:</strong> {{ report.finalScore }}</div>
            <div>
              <strong>Primaria:</strong> {{ primaryWinnerText(report) }}
            </div>
          </v-card-text>

          <div class="army-avatars">
            <v-avatar size="48" class="mx-1">
              <v-img :src="armyImage(report.armyPlayer)" alt="Army A" contain />
            </v-avatar>
            <v-avatar size="48" class="mx-1">
              <v-img
                :src="armyImage(report.armyOpponent)"
                alt="Army B"
                contain
              />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Scroll Infinito -->
    <v-infinite-scroll
      v-if="!loading && !allLoaded"
      side="end"
      @load="loadMoreReports"
    >
      <template #loading>
        <div class="text-center my-4">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>
    </v-infinite-scroll>

    <!-- Modal Detalle Reporte -->
    <v-dialog v-model="reportDialog" max-width="800px">
      <v-card>
        <v-card-title>Detalles del Reporte</v-card-title>
        <v-card-text v-if="selectedReport">
          <div class="d-flex justify-center mb-3">
            <v-avatar size="64" class="mx-1">
              <v-img
                :src="armyImage(selectedReport.armyPlayer)"
                alt="Army A"
                contain
              />
            </v-avatar>
            <v-avatar size="64" class="mx-1">
              <v-img
                :src="armyImage(selectedReport.armyOpponent)"
                alt="Army B"
                contain
              />
            </v-avatar>
          </div>
          <v-list dense>
            <v-list-item>
              <v-list-item-title>Oponente</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.opponent.alias
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Fecha</v-list-item-title>
              <v-list-item-subtitle>{{
                formatDate(selectedReport.date)
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Mapa</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.map
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Despliegue</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.deployment
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Misión Primaria</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.primaryMission
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Ganador Primaria</v-list-item-title>
              <v-list-item-subtitle>{{
                primaryWinnerText(selectedReport)
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Misión Secundaria Jugador</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.secondaryPlayer
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Misión Secundaria Oponente</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.secondaryOpponent
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Puntos Eliminados Jugador</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.pointsPlayer
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Puntos Eliminados Oponente</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.pointsOpponent
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Resultado Final</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.finalScore
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-expansion-panels class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-title>Lista Jugador</v-expansion-panel-title>
              <v-expansion-panel-text>
                <pre class="preformatted">{{ selectedReport.listPlayer }}</pre>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Lista Oponente</v-expansion-panel-title>
              <v-expansion-panel-text>
                <pre class="preformatted">{{
                  selectedReport.listOpponent
                }}</pre>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="selectedReport && selectedReport.isCreator"
            icon
            color="primary"
            @click="goToEditReport(selectedReport.id)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn text color="primary" @click="reportDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getReportsByPlayer } from "@/services/reportService";

export default {
  data() {
    return {
      reports: [],

      visibleReports: [],
      itemsPerPage: 5,
      loading: false,
      allLoaded: false,
      reportDialog: false,
      selectedReport: null,
      searchQuery: "",
      fetchError: null,
    };
  },
  computed: {
    userRole() {
      const sessionUser = sessionStorage.getItem('user')
      if (!sessionUser) return null
      const u = JSON.parse(sessionUser)
      return Number(
        u.role ?? u.rol ?? u.roleId ?? u.rolId ?? u.Role ?? u.Rol ?? u.RoleID ?? u.RolID ?? 0
      )
    },
    filteredReports() {
      if (!this.searchQuery) {
        return this.visibleReports;
      }
      const query = this.searchQuery.toLowerCase();
      return this.visibleReports.filter((report) => {
        return (
          report.opponent.name.toLowerCase().includes(query) ||
          report.map.toLowerCase().includes(query) ||
          report.deployment.toLowerCase().includes(query) ||
          report.finalScore.includes(query) ||
          report.armyPlayer?.toLowerCase().includes(query) ||
          report.armyOpponent?.toLowerCase().includes(query)
        );
      });
    },
  },
  created() {
    this.fetchReports();
  },
  methods: {
    async fetchReports() {
      try {
        this.loading = true;
        this.fetchError = null;
        const sessionUser = sessionStorage.getItem("user");
        if (!sessionUser) {
          throw new Error("Usuario no encontrado en sessionStorage");
        }
        const user = JSON.parse(sessionUser);
        const playerId = user.id ?? user.playerId ?? user.Id ?? user.ID;
        const { data } = await getReportsByPlayer(playerId);
        const rawReports = Array.isArray(data) ? data : data?.reports || [];

        this.reports = rawReports.map((r) => {
          const isPlayerA = r.playerAId === playerId;
          const player = isPlayerA ? r.playerA : r.playerB;
          const opponent = isPlayerA ? r.playerB : r.playerA;
          const armyPlayer = isPlayerA ? r.armyA : r.armyB;
          const armyOpponent = isPlayerA ? r.armyB : r.armyA;
          const listPlayer = isPlayerA ? r.listA : r.listB;
          const listOpponent = isPlayerA ? r.listB : r.listA;

          let primaryResult = "none";
          if (r.primaryResult === 1) {
            primaryResult = isPlayerA ? "player" : "opponent";
          } else if (r.primaryResult === 2) {
            primaryResult = isPlayerA ? "opponent" : "player";
          }

          var res = {
            id: r.id,
            player,
            opponent,
            map: r.map,
            deployment: r.deployment,
            primaryMission: r.primaryMission,
            date: r.date,
            armyPlayer,
            armyOpponent,
            listPlayer,
            listOpponent,
            secondaryPlayer: isPlayerA ? r.secondaryA : r.secondaryB,
            secondaryOpponent: isPlayerA ? r.secondaryB : r.secondaryA,
            pointsPlayer: isPlayerA ? r.killsA : r.killsB,
            pointsOpponent: isPlayerA ? r.killsB : r.killsA,
            finalScore: `${isPlayerA ? r.finalScoreA : r.finalScoreB}-${
              isPlayerA ? r.finalScoreB : r.finalScoreA
            }`,
            primaryResult,
            isCreator: isPlayerA,
          };

          console.log("Reports", res);
          return res;
        });

        this.visibleReports = [];
        this.allLoaded = false;
      } catch (err) {
        console.error("Error fetching reports", err);
        this.fetchError = "No se pudieron cargar los reportes";
      } finally {
        this.loading = false;
        this.loadMoreReports();
      }
    },
    armyImage(armyName) {
      const armyMap = {
        "Highborn Elves": "Altos.png",
        "Beast Herds": "Bestias.png",
        "Kingdom of Equitaine": "Bretonia.png",
        "Warriors of the Dark Gods": "Caos.png",
        "Vampire Covenant": "Condes.png",
        "Daemons of Change": "Demonios.png",
        "Dwarven Holds": "Enanos.png",
        "Empire of Sonnstahl": "Imperio.png",
        "Infernal Dwarves": "Nanocaos.png",
        "Ogre Khans": "Ogro.png",
        "Orcs and Goblins": "Orcos.png",
        "Dread Elves": "Oscuros.png",
        "Vermin Swarm": "Ratas.png",
        "Undying Dynasties": "Reyes.png",
        "Saurian Ancients": "Saurios.png",
        "Sylvan Elves": "Silvanos.png",
      };

      const filename = armyMap[armyName] || "default.png"; // fallback image
      return `/armies/${filename}`; // Direct access from public
    },
    loadMoreReports() {
      if (this.loading || this.allLoaded) return;

      this.loading = true;
      setTimeout(() => {
        const nextReports = this.reports.slice(
          this.visibleReports.length,
          this.visibleReports.length + this.itemsPerPage
        );
        if (nextReports.length > 0) {
          this.visibleReports.push(...nextReports);
        } else {
          this.allLoaded = true;
        }
        this.loading = false;
      }, 500);
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
    openReportModal(report) {
      this.selectedReport = report;
      this.reportDialog = true;
    },
    goToEditReport(id) {
      this.reportDialog = false;
      this.$router.push(`/edit-report/${id}`);
    },
    cardClass(report) {
      const [playerScore, opponentScore] = report.finalScore
        .split("-")
        .map(Number);
      if (playerScore > opponentScore) {
        return "card-win";
      } else if (playerScore < opponentScore) {
        return "card-lose";
      } else {
        return "card-draw";
      }
    },
    primaryWinnerText(report) {
      switch (report.primaryResult) {
        case "player":
          return "Jugador";
        case "opponent":
          return "Oponente";
        case "both":
          return "Ambos";
        case "none":
        default:
          return "Ninguno";
      }
    },
  },
};
</script>

<style scoped>
.hoverable {
  cursor: pointer;
  transition: transform 0.2s;
}
.hoverable:hover {
  transform: scale(1.02);
}

/* Gradientes para las Cards */
.card-win {
  background: linear-gradient(117deg, #00bfff 0%, #6a0dad 100%);
}
.card-lose {
  background: linear-gradient(117deg, #6a0dad 0%, #b00020 100%);
}
.card-draw {
  background: linear-gradient(117deg, #b5c0c4 0%, #00bfff 100%);
}

/* Necesario para que el avatar se posicione dentro de la card */
.position-relative {
  position: relative;
}

/* Container for two army avatars */
.army-avatars {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  background-color: white;
  padding: 2px;
  border-radius: 8px;
}

.preformatted {
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
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

@media (max-width: 768px) {
  .modern-btn {
    width: 100%;
    margin: 5px auto;
  }
}
</style>
