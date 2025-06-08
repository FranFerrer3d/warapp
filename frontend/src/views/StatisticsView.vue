<template>
  <v-container>
    <!-- Botón Volver -->
    <v-row class="my-4" justify="center">
      <v-btn color="primary" @click="$router.push('/dashboard')">
        Volver al Dashboard
      </v-btn>
    </v-row>
    <hr />
    <!-- Estadísticas Generales -->
    <v-row class="mb-6" justify="center">
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title class="text-center">Partidas Jugadas</v-card-title>
          <v-card-text class="text-center">
            <span class="text-h4">{{ totalGames }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title class="text-center">Resultados</v-card-title>
          <v-card-text class="text-center">
            <div>🏆 Victorias: {{ totalWins }} ({{ winRate }}%)</div>
            <div>❌ Derrotas: {{ totalLosses }} ({{ lossRate }}%)</div>
            <div>⚖️ Empates: {{ totalDraws }} ({{ drawRate }}%)</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title class="text-center">Winrate Global</v-card-title>
          <v-card-text class="text-center">
            <span class="text-h4">{{ winRate }}%</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Distribución Resultados</v-card-title>
          <v-card-text>
            <canvas id="resultsChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Mapas más Jugados</v-card-title>
          <v-card-text>
            <canvas id="mapsChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tablas Avanzadas -->
    <v-row class="mb-6">
      <!-- Despliegues -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Despliegues - Rendimiento</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Despliegue</th>
                  <th>Jugadas</th>
                  <th>Winrate (%)</th>
                  <th>Lossrate (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stats, deploy) in deploymentWinrate" :key="deploy">
                  <td>{{ deploy }}</td>
                  <td>{{ stats.played }}</td>
                  <td>{{ stats.winrate }}</td>
                  <td>{{ stats.lossrate }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Primarias -->
      <v-col cols="12" class="mt-6">
        <v-card>
          <v-card-title>Primarias - Rendimiento</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Primaria</th>
                  <th>Jugadas</th>
                  <th>Ganadas</th>
                  <th>Perdidas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stats, primary) in primaryStats" :key="primary">
                  <td>{{ primary }}</td>
                  <td>{{ stats.played }}</td>
                  <td>{{ stats.won }}</td>
                  <td>{{ stats.lost }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Secundarias -->
      <v-col cols="12" class="mt-6">
        <v-card>
          <v-card-title>Secundarias - Rendimiento</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Secundaria</th>
                  <th>Completadas</th>
                  <th>Falladas</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stats, secondary) in secondaryStats"
                  :key="secondary"
                >
                  <td>{{ secondary }}</td>
                  <td>{{ stats.completed }}</td>
                  <td>{{ stats.failed }}</td>
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
import Chart from "chart.js/auto";
import reports from "@/mock/statisticsMock.js"; // Aquí tu mock real

export default {
  data() {
    return {
      reports,
    };
  },
  computed: {
    totalGames() {
      return this.reports.length;
    },
    totalWins() {
      return this.reports.filter((r) => this.isWin(r)).length;
    },
    totalLosses() {
      return this.reports.filter((r) => this.isLoss(r)).length;
    },
    totalDraws() {
      return this.reports.filter((r) => this.isDraw(r)).length;
    },
    winRate() {
      return this.totalGames
        ? ((this.totalWins / this.totalGames) * 100).toFixed(2)
        : 0;
    },
    lossRate() {
      return this.totalGames
        ? ((this.totalLosses / this.totalGames) * 100).toFixed(2)
        : 0;
    },
    drawRate() {
      return this.totalGames
        ? ((this.totalDraws / this.totalGames) * 100).toFixed(2)
        : 0;
    },
    topMaps() {
      const counts = {};
      this.reports.forEach((r) => {
        counts[r.map] = (counts[r.map] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    },
    deploymentWinrate() {
      const data = {};
      this.reports.forEach((r) => {
        const dep = r.deployment;
        if (!data[dep]) {
          data[dep] = { played: 0, won: 0, lost: 0 };
        }
        data[dep].played++;
        if (this.isWin(r)) data[dep].won++;
        if (this.isLoss(r)) data[dep].lost++;
      });
      const formatted = {};
      Object.keys(data).forEach((dep) => {
        const { played, won, lost } = data[dep];
        formatted[dep] = {
          played,
          winrate: played ? ((won / played) * 100).toFixed(2) : "0.00",
          lossrate: played ? ((lost / played) * 100).toFixed(2) : "0.00",
        };
      });
      return formatted;
    },
    primaryStats() {
      const data = {};
      this.reports.forEach((r) => {
        const prim = r.primaryMission;
        if (!data[prim]) {
          data[prim] = { played: 0, won: 0, lost: 0 };
        }
        data[prim].played++;
        if (r.primaryResult === "player") data[prim].won++;
        if (r.primaryResult === "opponent") data[prim].lost++;
      });
      return data;
    },
    secondaryStats() {
      const data = {};
      this.reports.forEach((r) => {
        const sec = r.secondaryPlayer;
        if (!data[sec]) {
          data[sec] = { completed: 0, failed: 0 };
        }
        data[sec].completed += r.secondaryPlayerCompleted ? 1 : 0;
        data[sec].failed += r.secondaryPlayerCompleted ? 0 : 1;
      });
      return data;
    },
  },
  methods: {
    isWin(report) {
      const [player, opponent] = report.finalScore.split("-").map(Number);
      return player > opponent;
    },
    isLoss(report) {
      const [player, opponent] = report.finalScore.split("-").map(Number);
      return player < opponent;
    },
    isDraw(report) {
      const [player, opponent] = report.finalScore.split("-").map(Number);
      return player === opponent;
    },
    setupCharts() {
      const ctx1 = document.getElementById("resultsChart");
      new Chart(ctx1, {
        type: "doughnut",
        data: {
          labels: ["Victorias", "Derrotas", "Empates"],
          datasets: [
            {
              data: [this.totalWins, this.totalLosses, this.totalDraws],
              backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
            },
          ],
        },
      });

      const ctx2 = document.getElementById("mapsChart");
      new Chart(ctx2, {
        type: "bar",
        data: {
          labels: this.topMaps.map((m) => m[0]),
          datasets: [
            {
              label: "Veces Jugado",
              data: this.topMaps.map((m) => m[1]),
              backgroundColor: "#42A5F5",
            },
          ],
        },
      });
    },
  },
  mounted() {
    this.setupCharts();
  },
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
.v-list-item-title {
  font-weight: bold;
}
.v-table {
  width: 100%;
  border-collapse: collapse;
}
.v-table th,
.v-table td {
  padding: 8px 12px;
  text-align: center;
}
.v-table th {
  background-color: #42a5f5;
}
.v-table tbody tr:nth-child(even) {
  background-color: #5b6b79;
}
</style>
