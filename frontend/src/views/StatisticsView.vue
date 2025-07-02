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

    <!-- Mejores y Peores Oponentes -->
    <v-row class="mb-6" justify="center">
      <v-col cols="12" md="6" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title class="text-center">Mejor Contra</v-card-title>
          <v-card-text class="text-center">
            <span class="text-h5">{{ bestOpponent || 'N/A' }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title class="text-center">Peor Contra</v-card-title>
          <v-card-text class="text-center">
            <span class="text-h5">{{ worstOpponent || 'N/A' }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtro por Ejército -->
    <v-row class="mb-4" justify="center">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedArmy"
          :items="armies"
          label="Filtrar por Ejército"
          clearable
        ></v-select>
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
import { getReportsByPlayer } from '@/services/reportService';
import { getBestOpponent, getWorstOpponent } from '@/services/playerStatsService';

export default {
  data() {
    return {
      reports: [],
      allReports: [],
      armies: [],
      selectedArmy: '',
      bestOpponent: '',
      worstOpponent: '',
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
              backgroundColor: ["#00bfff", "#6a0dad", "#ffef00"],
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
              backgroundColor: "#00bfff",
            },
          ],
        },
      });
    },
    async fetchReports() {
      try {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) throw new Error('Usuario no encontrado');
        const user = JSON.parse(sessionUser);
        const playerId = user.id ?? user.playerId ?? user.Id ?? user.ID;
        const { data } = await getReportsByPlayer(playerId);
        const rawReports = Array.isArray(data) ? data : data?.reports || [];

        this.allReports = rawReports.map((r) => {
          const isPlayerA = r.playerAId === playerId;
          const player = isPlayerA ? r.playerA : r.playerB;
          const opponent = isPlayerA ? r.playerB : r.playerA;
          const army = isPlayerA ? r.armyA : r.armyB;

          let primaryResult = 'none';
          if (r.primaryResult === 1) {
            primaryResult = isPlayerA ? 'player' : 'opponent';
          } else if (r.primaryResult === 2) {
            primaryResult = isPlayerA ? 'opponent' : 'player';
          }

          return {
            id: r.id,
            player,
            opponent,
            map: r.map,
            deployment: r.deployment,
            primaryMission: r.primaryMission,
            date: r.date,
            army,
            secondaryPlayer: isPlayerA ? r.secondaryA : r.secondaryB,
            secondaryOpponent: isPlayerA ? r.secondaryB : r.secondaryA,
            pointsPlayer: isPlayerA ? r.killsA : r.killsB,
            pointsOpponent: isPlayerA ? r.killsB : r.killsA,
            finalScore: `${isPlayerA ? r.finalScoreA : r.finalScoreB}-${isPlayerA ? r.finalScoreB : r.finalScoreA}`,
            primaryResult,
          };
        });
        this.reports = this.allReports;
        this.armies = [...new Set(this.allReports.map((r) => r.army).filter(Boolean))];
        this.$nextTick(() => this.setupCharts());
      } catch (err) {
        console.error('Error fetching reports', err);
      }
    },

    async fetchStats() {
      try {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) throw new Error('Usuario no encontrado');
        const user = JSON.parse(sessionUser);
        const { data: best } = await getBestOpponent(user.id);
        const { data: worst } = await getWorstOpponent(user.id);
        this.bestOpponent = best;
        this.worstOpponent = worst;
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    },
  },
  watch: {
    selectedArmy() {
      if (!this.selectedArmy) {
        this.reports = this.allReports;
      } else {
        this.reports = this.allReports.filter((r) => r.army === this.selectedArmy);
      }
      this.$nextTick(() => this.setupCharts());
    },
  },
  mounted() {
    this.fetchReports();
    this.fetchStats();
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
  background-color: #6a0dad;
}
.v-table tbody tr:nth-child(even) {
  background-color: #1e1e1e;
}
</style>
