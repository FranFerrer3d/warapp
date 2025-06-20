<template>
  <v-container fluid>
    <!-- Botón Nuevo Reporte -->
    <v-row class="my-4" justify="center">
      <v-btn color="primary" @click="$router.push('/create-report')">
        Nuevo Reporte
      </v-btn>
      <v-btn color="secondary" @click="$router.push('/statistics')">
        Ver Estadísticas
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
            Oponente: {{ report.opponent.name }}
          </v-card-title>

          <v-card-subtitle>{{ formatDate(report.date) }}</v-card-subtitle>

          <v-card-text>
            <div><strong>Resultado:</strong> {{ report.finalScore }}</div>
            <div>
              <strong>Primaria:</strong> {{ primaryWinnerText(report) }}
            </div>
          </v-card-text>

          <v-avatar size="64" class="army-avatar">
            <v-img
              :src="armyImage(report.player.army)"
              alt="Army Icon"
              contain
            />
          </v-avatar>
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
          <v-list dense>
            <v-list-item>
              <v-list-item-title>Jugador</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.player.name
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Oponente</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedReport.opponent.name
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="reportDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      reports: [
        {
          id: 1,
          date: "2025-06-06",
          player: { name: "Thorin", army: "Dwarven Holds" },
          opponent: { name: "Elrond" },
          map: "Bosque de las Sombras",
          deployment: "Frontline Clash",
          primaryMission: "Spoils of War",
          primaryResult: "player",
          secondaryPlayer: "Capture the Flags",
          secondaryOpponent: "Slay the Beast",
          pointsPlayer: 3000,
          pointsOpponent: 2500,
          finalScore: "15-5",
        },
        {
          id: 2,
          date: "2025-06-05",
          player: { name: "Eowyn", army: "Kingdom of Equitaine" },
          opponent: { name: "Saruman" },
          map: "Colinas de Sangre",
          deployment: "Refused Flank",
          primaryMission: "Breakthrough",
          primaryResult: "opponent",
          secondaryPlayer: "Stand Firm",
          secondaryOpponent: "Forbid Trespass",
          pointsPlayer: 1800,
          pointsOpponent: 2200,
          finalScore: "8-12",
        },
        {
          id: 3,
          date: "2025-06-04",
          player: { name: "Gimli", army: "Infernal Dwarves" },
          opponent: { name: "Boromir" },
          map: "Campos de Pelennor",
          deployment: "Spearhead",
          primaryMission: "Hold the Centre",
          primaryResult: "both",
          secondaryPlayer: "Slay the Beast",
          secondaryOpponent: "Demonstrate Superiority",
          pointsPlayer: 2000,
          pointsOpponent: 2000,
          finalScore: "10-10",
        },
        {
          id: 4,
          date: "2025-06-03",
          player: { name: "Faramir", army: "Highborn Elves" },
          opponent: { name: "Gollum" },
          map: "Ruinas de Osgiliath",
          deployment: "Mutual Encroachment",
          primaryMission: "Forage and Plunder",
          primaryResult: "none",
          secondaryPlayer: "Work as One",
          secondaryOpponent: "Commit to Battle",
          pointsPlayer: 2700,
          pointsOpponent: 2100,
          finalScore: "14-6",
        },
      ],

      visibleReports: [],
      itemsPerPage: 5,
      loading: false,
      allLoaded: false,
      reportDialog: false,
      selectedReport: null,
      searchQuery: "",
    };
  },
  computed: {
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
          report.player.army.toLowerCase().includes(query) // <-- Añadido aquí
        );
      });
    },
  },
  created() {
    this.loadMoreReports();
  },
  methods: {
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
  background: linear-gradient(
    117deg,
    rgba(50, 204, 47, 1) 0%,
    rgba(141, 214, 139, 1) 8%,
    rgba(110, 119, 156, 1) 52%,
    rgba(110, 119, 156, 1) 100%
  );
}
.card-lose {
  background: linear-gradient(
    117deg,
    rgba(204, 84, 47, 1) 0%,
    rgba(214, 139, 139, 1) 8%,
    rgba(110, 119, 156, 1) 52%,
    rgba(110, 119, 156, 1) 100%
  );
}
.card-draw {
  background: linear-gradient(
    117deg,
    rgb(128, 193, 255) 0%,
    rgb(175, 216, 255) 8%,
    rgba(110, 119, 156, 1) 52%,
    rgba(110, 119, 156, 1) 100%
  );
}

/* Necesario para que el avatar se posicione dentro de la card */
.position-relative {
  position: relative;
}

/* Avatar en la esquina inferior derecha */
.army-avatar {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: white; /* opcional: para que destaque el avatar */
}
</style>
