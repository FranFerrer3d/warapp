<template>
  <v-container>
    <!-- Botón Volver -->
    <v-row class="my-4" justify="center">
      <v-btn
        color="primary"
        class="modern-btn full-btn"
        @click="$router.push('/dashboard')"
      >
        Volver al Dashboard
      </v-btn>
    </v-row>
    <hr />
    <!-- Wizard Card -->
    <v-card class="mx-auto" max-width="800">
      <!-- Step Title + Indicator -->
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
      </v-card-title>

      <!-- Steps -->
      <v-window v-model="step" style="min-height: 700px">
        <!-- Step 1: Info General -->
        <v-window-item :value="1">
          <v-card-text>
            <v-btn
              @click="openPlayerDialog"
              class="ma-2"
              color="primary"
              outlined
            >
              <v-icon start>
                {{
                  playerComplete
                    ? "mdi-check-circle"
                    : "mdi-checkbox-blank-circle-outline"
                }}
              </v-icon>
              Jugador
            </v-btn>

            <v-btn
              @click="openOpponentDialog"
              class="ma-2"
              color="primary"
              outlined
            >
              <v-icon start>
                {{
                  opponentComplete
                    ? "mdi-check-circle"
                    : "mdi-checkbox-blank-circle-outline"
                }}
              </v-icon>
              Oponente
            </v-btn>

            <v-btn
              class="ma-2"
              color="secondary"
              outlined
              @click="randomizeFields"
            >
              <v-icon start>mdi-dice-multiple</v-icon>
              Aleatorio
            </v-btn>

            <v-text-field
              label="Fecha"
              v-model="reportDate"
              type="date"
              outlined
              class="mt-4"
            />

            <v-select
              v-model="selectedMap"
              :items="maps"
              item-title="name"
              label="Mapa"
              return-object
              outlined
              class="mt-4"
              append-inner-icon="mdi-information-outline"
              @click:append-inner="openInfoDialog(selectedMap?.info)"
            />

            <v-select
              v-model="selectedDeployment"
              :items="deployments"
              item-title="name"
              label="Despliegue"
              outlined
              class="mt-4"
            />

            <v-select
              v-model="selectedPrimary"
              :items="primaries"
              item-title="name"
              label="Misión Primaria"
              return-object
              outlined
              class="mt-4"
              append-inner-icon="mdi-information-outline"
              @click:append-inner="openInfoDialog(selectedPrimary?.info)"
            />

            <v-select
              v-model="selectedSecondaryPlayer"
              :items="secondaries"
              item-title="name"
              label="Misión Secundaria Jugador"
              outlined
              class="mt-4"
            />

            <v-select
              v-model="selectedSecondaryOpponent"
              :items="secondaries"
              item-title="name"
              label="Misión Secundaria Oponente"
              outlined
              class="mt-4"
            />
          </v-card-text>
        </v-window-item>

        <!-- Step 2: Magia -->
        <v-window-item :value="2">
          <v-card-text>
            <h3>Turnos de Magia - Jugador</h3>
            <v-row dense>
              <v-col
                cols="6"
                v-for="(turn, index) in playerMagic"
                :key="'player-turn-' + index"
              >
                <v-select
                  v-model="playerMagic[index]"
                  :items="magicOptionsForPlayerA(index)"
                  item-title="label"
                  item-value="value"
                  :label="`Turno ${index + 1}`"
                  outlined
                />
              </v-col>
            </v-row>

            <h3 class="mt-6">Turnos de Magia - Oponente</h3>
            <v-row dense>
              <v-col
                cols="6"
                v-for="(turn, index) in opponentMagic"
                :key="'opponent-turn-' + index"
              >
                <v-select
                  v-model="opponentMagic[index]"
                  :items="magicOptionsForPlayerB(index)"
                  item-title="label"
                  item-value="value"
                  :label="`Turno ${index + 1}`"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <!-- Step 3: Resultado -->
        <v-window-item :value="3">
          <v-card-text>
            <h3>Puntos Eliminados</h3>
            <v-text-field
              v-model="pointsPlayer"
              label="Puntos Eliminados al Jugador"
              type="number"
              min="0"
              max="4000"
              outlined
              class="mt-2"
            />
            <v-text-field
              v-model="pointsOpponent"
              label="Puntos Eliminados al Oponente"
              type="number"
              min="0"
              max="4000"
              outlined
              class="mt-2"
            />

            <h3 class="mt-6">Resultado Misión Primaria</h3>
            <v-radio-group v-model="primaryResult" row>
              <v-radio label="Jugador" value="player" />
              <v-radio label="Oponente" value="opponent" />
              <v-radio label="Ambos" value="both" />
              <v-radio label="Ninguno" value="none" />
            </v-radio-group>

            <h3 class="mt-6">Resultado Misión Secundaria</h3>
            <v-checkbox
              v-model="secondaryPlayerCompleted"
              label="Jugador completó su secundaria"
            />
            <v-checkbox
              v-model="secondaryOpponentCompleted"
              label="Oponente completó su secundaria"
            />

            <v-alert type="info" class="mt-6" v-if="finalScore">
              Resultado: {{ finalScore }}
            </v-alert>
          </v-card-text>
        </v-window-item>
      </v-window>

      <!-- Divider -->
      <v-divider></v-divider>

      <!-- Navegación -->
      <v-card-actions>
        <v-btn v-if="step > 1" variant="text" class="full-btn" @click="step--">
          Atrás
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < 3"
          color="primary"
          variant="flat"
          class="full-btn"
          @click="step++"
        >
          Siguiente
        </v-btn>
        <v-btn
          v-else
          class="modern-btn full-btn"
          color="success"
          variant="flat"
          @click="saveReport"
          :disabled="!canSaveReport || saving"
          :loading="saving"
        >
          Guardar Reporte
        </v-btn>
        <v-alert v-if="saveError" type="error" class="mt-4">
          {{ saveError }}
        </v-alert>
      </v-card-actions>
    </v-card>

    <!-- Dialogs de Info y Formularios -->
    <v-dialog v-model="infoDialog" max-width="500px">
      <v-card>
        <v-card-title>Información</v-card-title>
        <v-card-text>{{ currentInfo }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="infoDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="playerDialog" max-width="500px">
      <v-card>
        <v-card-title>Jugador</v-card-title>
        <v-card-text>
          <v-text-field
            :model-value="currentUserName"
            label="Nombre"
            outlined
            readonly
          />
          <v-textarea v-model="player.list" label="Lista" rows="6" outlined />
          <v-select
            v-model="expectedA"
            :items="expectedOptions"
            label="Resultado Esperado"
            outlined
            class="mt-4"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="playerDialog = false">Cancelar</v-btn>
          <v-btn text color="success" @click="savePlayer">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="opponentDialog" max-width="500px">
      <v-card>
        <v-card-title>Oponente</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="opponent.id"
            :items="players"
            item-title="nombre"
            item-value="id"
            label="Nombre"
            outlined
          />
          <v-textarea v-model="opponent.list" label="Lista" rows="6" outlined />
          <v-select
            v-model="expectedB"
            :items="expectedOptions"
            label="Resultado Esperado"
            outlined
            class="mt-4"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="opponentDialog = false">Cancelar</v-btn>
          <v-btn text color="success" @click="saveOpponent">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  maps,
  deployments,
  primaries,
  secondaries,
} from "@/mock/reportOptions.js";
import { createReport } from "@/services/reportService";
import { getAllPlayers } from "@/services/playerService";

export default {
  data() {
    return {
      step: 1,
      reportDate: new Date().toISOString().substr(0, 10),
      playerDialog: false,
      opponentDialog: false,
      player: { id: null, list: "" },
      opponent: { id: null, list: "" },
      expectedA: null,
      expectedB: null,
      expectedOptions: Array.from({ length: 21 }, (_, i) => i),
      players: [],
      currentUser: null,
      maps,
      deployments,
      primaries,
      secondaries,
      selectedMap: null,
      selectedDeployment: null,
      selectedPrimary: null,
      selectedSecondaryPlayer: null,
      selectedSecondaryOpponent: null,
      infoDialog: false,
      currentInfo: "",
      magicOptions: [
        { value: 1, label: "1 - 4 Magic Dice" },
        { value: 2, label: "2 - 5 Magic Dice" },
        { value: 3, label: "3 - 6 Magic Dice" },
        { value: 4, label: "4 - 6 Magic Dice" },
        { value: 5, label: "5 - 5 Magic Dice" },
        { value: 6, label: "6 - 5 Magic Dice" },
        { value: 7, label: "7 - 6 Magic Dice" },
        { value: 8, label: "8 - 7 Magic Dice" },
      ],
      playerMagic: [null, null, null, null, null, null],
      opponentMagic: [null, null, null, null, null, null],
      pointsPlayer: null,
      pointsOpponent: null,
        primaryResult: null,
        secondaryPlayerCompleted: false,
        secondaryOpponentCompleted: false,
        saving: false,
        saveError: null,
      };
  },
  created() {
    this.fetchPlayers();
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      this.currentUser = JSON.parse(sessionUser);
      const playerId =
        this.currentUser.id ?? this.currentUser.playerId ?? this.currentUser.Id ?? this.currentUser.ID;
      this.player.id = playerId;
    }
  },
  computed: {
    currentUserName() {
      return this.currentUser?.nombre || this.currentUser?.name || "";
    },
    currentTitle() {
      const titles = ["Información General", "Turnos de Magia", "Resultados"];
      return titles[this.step - 1] || "Paso";
    },
    playerComplete() {
      return this.player.id && this.player.list && this.expectedA !== null;
    },
    opponentComplete() {
      return this.opponent.id && this.opponent.list && this.expectedB !== null;
    },
    magicComplete() {
      return (
        this.playerMagic.every((m) => m !== null) &&
        this.opponentMagic.every((m) => m !== null)
      );
    },
    canSaveReport() {
      return (
        this.playerComplete &&
        this.opponentComplete &&
        this.selectedMap &&
        this.selectedDeployment &&
        this.selectedPrimary &&
        this.selectedSecondaryPlayer &&
        this.selectedSecondaryOpponent
      );
    },
    finalScore() {
      if (this.pointsPlayer === null || this.pointsOpponent === null)
        return null;

      const totalPoints = 4000;
      const diff = Math.abs(this.pointsPlayer - this.pointsOpponent);
      const percent = (diff / totalPoints) * 100;

      let basePlayerPoints = 10;

      if (percent <= 5) basePlayerPoints = 10;
      else if (percent <= 10) basePlayerPoints = 11;
      else if (percent <= 20) basePlayerPoints = 12;
      else if (percent <= 30) basePlayerPoints = 13;
      else if (percent <= 40) basePlayerPoints = 14;
      else if (percent <= 50) basePlayerPoints = 15;
      else basePlayerPoints = 16;

      if (this.pointsPlayer > this.pointsOpponent) {
        basePlayerPoints = basePlayerPoints;
      } else if (this.pointsOpponent > this.pointsPlayer) {
        basePlayerPoints = 20 - basePlayerPoints;
      } else {
        basePlayerPoints = 10;
      }

      let baseOpponentPoints = 20 - basePlayerPoints;

      if (this.primaryResult === "player") {
        basePlayerPoints += 3;
        baseOpponentPoints -= 3;
      } else if (this.primaryResult === "opponent") {
        basePlayerPoints -= 3;
        baseOpponentPoints += 3;
      }

      if (this.secondaryPlayerCompleted && !this.secondaryOpponentCompleted) {
        basePlayerPoints += 1;
        baseOpponentPoints -= 1;
      } else if (
        !this.secondaryPlayerCompleted &&
        this.secondaryOpponentCompleted
      ) {
        basePlayerPoints -= 1;
        baseOpponentPoints += 1;
      }

      basePlayerPoints = Math.min(Math.max(basePlayerPoints, 0), 20);
      baseOpponentPoints = 20 - basePlayerPoints;

      return `${basePlayerPoints}-${baseOpponentPoints}`;
    },
  },
  methods: {
    async fetchPlayers() {
      try {
        const { data } = await getAllPlayers();
        this.players = data;
      } catch (err) {
        console.error("Error fetching players", err);
      }
    },
    randomizeFields() {
      const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
      this.selectedMap = rand(this.maps);
      this.selectedDeployment = rand(this.deployments);
      this.selectedPrimary = rand(this.primaries);
      this.selectedSecondaryPlayer = rand(this.secondaries);
      this.selectedSecondaryOpponent = rand(this.secondaries);
    },
    openPlayerDialog() {
      if (this.currentUser) {
        const playerId =
          this.currentUser.id ?? this.currentUser.playerId ?? this.currentUser.Id ?? this.currentUser.ID;
        this.player.id = playerId;
      }
      this.playerDialog = true;
    },
    openOpponentDialog() {
      this.opponentDialog = true;
    },
    savePlayer() {
      this.playerDialog = false;
    },
    saveOpponent() {
      this.opponentDialog = false;
    },
    openInfoDialog(info) {
      this.currentInfo = info;
      this.infoDialog = true;
    },
    magicOptionsForPlayerA(index) {
      return this.magicOptions.filter(
        (opt) =>
          !this.playerMagic.includes(opt.value) || this.playerMagic[index] === opt.value
      );
    },
    magicOptionsForPlayerB(index) {
      return this.magicOptions.filter(
        (opt) =>
          !this.opponentMagic.includes(opt.value) || this.opponentMagic[index] === opt.value
      );
    },
    async saveReport() {
      this.saving = true;
      this.saveError = null;
      const report = {
        PlayerAId: this.player.id,
        PlayerBId: this.opponent.id,
        listA: this.player.list,
        listB: this.opponent.list,
        expectedA: this.expectedA,
        expectedB: this.expectedB,
        date: new Date(this.reportDate).toISOString(),
        map: this.selectedMap.name,
        deployment: this.selectedDeployment.name,
        primaryMission: this.selectedPrimary.name,
        secondaryA: this.selectedSecondaryPlayer.name,
        secondaryB: this.selectedSecondaryOpponent.name,
        magicA: this.playerMagic.map((m) => m ?? 0),
        magicB: this.opponentMagic.map((m) => m ?? 0),
        killsA: this.pointsPlayer,
        killsB: this.pointsOpponent,
        primaryResult:
          this.primaryResult === "player"
            ? "PlayerA"
            : this.primaryResult === "opponent"
            ? "PlayerB"
            : "none",
        secondaryWinA: this.secondaryPlayerCompleted,
        secondaryWinB: this.secondaryOpponentCompleted,
      };
      try {
        await createReport(report);
        this.$router.push("/dashboard");
      } catch (err) {
        console.error("Error saving report", err);
        this.saveError = "Error guardando reporte";
      }
      this.saving = false;
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  color: #ffef00;
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
</style>
