<template>
  <div>
    <v-row class="mb-4" justify="center">
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
            <div>🏆 Victorias: {{ totalWins }}</div>
            <div>⚖️ Empates: {{ totalDraws }}</div>
            <div>❌ Derrotas: {{ totalLosses }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Distribución Resultados</v-card-title>
          <v-card-text>
            <canvas :id="`resultsChart-${playerId}`"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Mapas más Jugados</v-card-title>
          <v-card-text>
            <canvas :id="`mapsChart-${playerId}`"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { getReportsByPlayer } from '@/services/reportService'

export default {
  props: {
    playerId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      reports: []
    }
  },
  computed: {
    totalGames() {
      return this.reports.length
    },
    totalWins() {
      return this.reports.filter(r => this.isWin(r)).length
    },
    totalLosses() {
      return this.reports.filter(r => this.isLoss(r)).length
    },
    totalDraws() {
      return this.reports.filter(r => this.isDraw(r)).length
    },
    topMaps() {
      const counts = {}
      this.reports.forEach(r => {
        counts[r.map] = (counts[r.map] || 0) + 1
      })
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    }
  },
  methods: {
    isWin(report) {
      const [a, b] = report.finalScore.split('-').map(Number)
      return a > b
    },
    isLoss(report) {
      const [a, b] = report.finalScore.split('-').map(Number)
      return a < b
    },
    isDraw(report) {
      const [a, b] = report.finalScore.split('-').map(Number)
      return a === b
    },
    setupCharts() {
      const ctx1 = document.getElementById(`resultsChart-${this.playerId}`)
      new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Victorias', 'Derrotas', 'Empates'],
          datasets: [{
            data: [this.totalWins, this.totalLosses, this.totalDraws],
            backgroundColor: ['#00bfff', '#6a0dad', '#ffef00']
          }]
        }
      })

      const ctx2 = document.getElementById(`mapsChart-${this.playerId}`)
      new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: this.topMaps.map(m => m[0]),
          datasets: [{
            label: 'Veces Jugado',
            data: this.topMaps.map(m => m[1]),
            backgroundColor: '#00bfff'
          }]
        }
      })
    },
    async fetchReports() {
      try {
        const { data } = await getReportsByPlayer(this.playerId)
        const raw = Array.isArray(data) ? data : data?.reports || []
        this.reports = raw.map(r => {
          const isA = r.playerAId === this.playerId
          return {
            map: r.map,
            finalScore: `${isA ? r.finalScoreA : r.finalScoreB}-${isA ? r.finalScoreB : r.finalScoreA}`
          }
        })
        this.$nextTick(() => this.setupCharts())
      } catch (err) {
        console.error('Error fetching reports', err)
      }
    }
  },
  mounted() {
    this.fetchReports()
  }
}
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
