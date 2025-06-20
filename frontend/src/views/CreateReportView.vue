<template>
  <v-container>
    <!-- Botón Volver -->
    <v-row class="my-4" justify="center">
      <v-btn color="primary" @click="$router.push('/dashboard')">
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
                  :items="magicOptions"
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
                  :items="magicOptions"
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
        <v-btn v-if="step > 1" variant="text" @click="step--">Atrás</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 3" color="primary" variant="flat" @click="step++">
          Siguiente
        </v-btn>
        <v-btn
          v-else
          color="success"
          variant="flat"
          @click="saveReport"
          :disabled="!canSaveReport"
        >
          Guardar Reporte
        </v-btn>
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
          <v-text-field v-model="player.name" label="Nombre" outlined />
          <v-textarea v-model="player.list" label="Lista" rows="6" outlined />
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
          <v-text-field v-model="opponent.name" label="Nombre" outlined />
          <v-textarea v-model="opponent.list" label="Lista" rows="6" outlined />
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

export default {
  data() {
    return {
      step: 1,
      reportDate: new Date().toISOString().substr(0, 10),
      playerDialog: false,
      opponentDialog: false,
      player: { name: "", list: "" },
      opponent: { name: "", list: "" },
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
    };
  },
  computed: {
    currentTitle() {
      const titles = ["Información General", "Turnos de Magia", "Resultados"];
      return titles[this.step - 1] || "Paso";
    },
    playerComplete() {
      return this.player.name && this.player.list;
    },
    opponentComplete() {
      return this.opponent.name && this.opponent.list;
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
        this.selectedSecondaryOpponent &&
        this.magicComplete
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
    openPlayerDialog() {
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
    saveReport() {
      const report = {
        date: this.reportDate,
        player: this.player,
        opponent: this.opponent,
        map: this.selectedMap.name,
        deployment: this.selectedDeployment.name,
        primaryMission: this.selectedPrimary.name,
        secondaryPlayer: this.selectedSecondaryPlayer.name,
        secondaryOpponent: this.selectedSecondaryOpponent.name,
        magicPlayer: this.playerMagic,
        magicOpponent: this.opponentMagic,
        pointsPlayer: this.pointsPlayer,
        pointsOpponent: this.pointsOpponent,
        primaryResult: this.primaryResult,
        secondaryPlayerCompleted: this.secondaryPlayerCompleted,
        secondaryOpponentCompleted: this.secondaryOpponentCompleted,
        finalScore: this.finalScore,
      };
      console.log("Reporte guardado:", report);
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
