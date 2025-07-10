<template>
  <div class="report-view">
    <BackgroundShapes />
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
      <v-alert v-if="stepError" type="error" class="mx-4">
        {{ stepError }}
      </v-alert>

      <!-- Steps -->
      <v-window v-model="step">
        <!-- Step 1: Jugadores -->
        <v-window-item :value="1">
          <v-card-text>
            <v-btn
              @click="openPlayerDialog"
              class="modern-btn"
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
              class="modern-btn"
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
          </v-card-text>
        </v-window-item>

        <!-- Step 2: Escenario -->
        <v-window-item :value="2">
          <v-card-text>
            <v-btn
              class="modern-btn"
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
              @click:append-inner="
                openInfoDialog(selectedMap?.info, selectedMap?.image)
              "
            />

            <v-select
              v-model="selectedDeployment"
              :items="deployments"
              item-title="name"
              label="Despliegue"
              outlined
              class="mt-4"
              append-inner-icon="mdi-information-outline"
              @click:append-inner="
                openInfoDialog(
                  selectedDeployment?.info,
                  selectedDeployment?.image
                )
              "
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
              :items="filteredSecondariesPlayer"
              item-title="name"
              label="Misión Secundaria Jugador"
              return-object
              outlined
              class="mt-4"
              append-inner-icon="mdi-information-outline"
              @click:append-inner="
                openInfoDialog(selectedSecondaryPlayer?.info)
              "
            />

            <v-select
              v-model="selectedSecondaryOpponent"
              :items="filteredSecondariesOpponent"
              item-title="name"
              label="Misión Secundaria Oponente"
              return-object
              outlined
              class="mt-4"
              append-inner-icon="mdi-information-outline"
              @click:append-inner="
                openInfoDialog(selectedSecondaryOpponent?.info)
              "
            />
          </v-card-text>
        </v-window-item>

        <!-- Step 3: Magia -->
        <v-window-item :value="3">
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
            <div class="d-flex align-center mt-2">
              <v-btn
                class="modern-btn mr-4"
                color="secondary"
                outlined
                @click="randomNextPlayerMagic"
              >
                <v-icon start>mdi-dice-multiple</v-icon>
                Siguiente Aleatorio
              </v-btn>
              <v-checkbox
                class="ml-2"
                :model-value="playerMagicDieSaved"
                :label="
                  playerMagicDieSaved
                    ? 'Dado de magia guardado'
                    : 'Guardar dado de magia'
                "
                @click="promptMagicDieToggle('player')"
              />
            </div>

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
            <div class="d-flex align-center mt-2">
              <v-btn
                class="modern-btn mr-4"
                color="secondary"
                outlined
                @click="randomNextOpponentMagic"
              >
                <v-icon start>mdi-dice-multiple</v-icon>
                Siguiente Aleatorio
              </v-btn>
              <v-checkbox
                class="ml-2"
                :model-value="opponentMagicDieSaved"
                :label="
                  opponentMagicDieSaved
                    ? 'Dado de magia guardado'
                    : 'Guardar dado de magia'
                "
                @click="promptMagicDieToggle('opponent')"
              />
            </div>
            <v-btn
              color="info"
              class="mt-4"
              @click="chatDialog = true"
              style="width: 100%"
            >
              9th Age - Chat bot
            </v-btn>
          </v-card-text>
        </v-window-item>

        <!-- Step 4: Resultado -->
        <v-window-item :value="4">
          <v-card-text>
            <h3>Puntos Eliminados</h3>
            <v-text-field
              v-model="pointsPlayer"
              label="Puntos Eliminados por el Jugador"
              type="number"
              min="0"
              max="4000"
              outlined
              class="mt-2"
            />
            <v-text-field
              v-model="pointsOpponent"
              label="Puntos Eliminados por el Oponente"
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
      <v-card-actions class="sticky-actions">
        <v-btn
          v-if="step > 1"
          variant="text"
          class="full-btn"
          @click="prevStep"
        >
          Atrás
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < 4"
          color="primary"
          variant="flat"
          class="full-btn"
          @click="nextStep"
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
        <v-card-text>
          <v-img
            v-if="currentImage"
            :src="currentImage"
            class="mb-2 map-rotated"
          />
          <div
            v-for="section in currentSections"
            :key="section.title"
            class="mb-4"
          >
            <h3 class="text-subtitle-1">{{ section.title }}</h3>
            <ul v-if="section.items.length > 1">
              <li v-for="(item, idx) in section.items" :key="idx">{{ item }}</li>
            </ul>
            <p v-else>{{ section.items[0] }}</p>
          </div>
        </v-card-text>
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
            v-model="player.army"
            :items="armies"
            label="Ejército"
            outlined
            class="mt-4"
          />
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
            v-model="opponent.army"
            :items="armies"
            label="Ejército"
            outlined
            class="mt-4"
          />
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
    <v-dialog v-model="magicDieDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{
            pendingMagicDie
              ? 'Guardar dado de magia'
              : 'Gastar dado de magia'
          }}
        </v-card-title>
        <v-card-text>
          {{
            pendingMagicDie
              ? '¿Estas seguro de querer guardar un dado de magia?'
              : '¿Estas seguro de querer gastar un dado de magia?'
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelMagicDieToggle">Cancelar</v-btn>
          <v-btn text color="primary" @click="confirmMagicDieToggle"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ChatbotModal v-model="chatDialog" />
  </v-container>
  </div>
</template>

<script>
import {
  maps,
  deployments,
  primaries,
  secondaries,
  armySecondaryMap,
  armies,
} from "@/mock/reportOptions.js";
import {
  createReport,
  updateReport,
  getReportById,
} from "@/services/reportService";
import { getAllPlayers } from "@/services/playerService";
import ChatbotModal from "@/components/ChatbotModal.vue";
import BackgroundShapes from "@/components/BackgroundShapes.vue";

export default {
  components: { ChatbotModal, BackgroundShapes },
  data() {
    return {
      step: 1,
      reportDate: new Date().toISOString().substr(0, 10),
      playerDialog: false,
      opponentDialog: false,
      chatDialog: false,
      player: { id: null, list: "", army: "" },
      opponent: { id: null, list: "", army: "" },
      expectedA: null,
      expectedB: null,
      expectedOptions: Array.from({ length: 21 }, (_, i) => i),
      players: [],
      currentUser: null,
      maps,
      deployments,
      primaries,
      armies,
      secondaries,
      selectedMap: null,
      selectedDeployment: null,
      selectedPrimary: null,
      selectedSecondaryPlayer: null,
      selectedSecondaryOpponent: null,
      infoDialog: false,
      currentInfo: "",
      currentImage: "",
      currentSections: [],
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
      playerMagicDieSaved: false,
      opponentMagicDieSaved: false,
      magicDieDialog: false,
      pendingMagicDie: false,
      pendingMagicDieOwner: null,
      saving: false,
      stepError: null,
      saveError: null,
      editId: null,
    };
  },
  created() {
    this.fetchPlayers();
    this.loadDraft();
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      this.currentUser = JSON.parse(sessionUser);

      const playerId =
        this.currentUser.id ??
        this.currentUser.playerId ??
        this.currentUser.Id ??
        this.currentUser.ID;
      this.player.id = playerId;
    }
    const editId = this.$route.params.id;
    if (editId) {
      this.editId = editId;
      this.loadReport(editId);
    }
  },
  computed: {
    currentUserName() {
      return this.currentUser?.nombre || this.currentUser?.name || "";
    },
    currentTitle() {
      const titles = [
        "Jugadores",
        "Escenario",
        "Turnos de Magia",
        "Resultados",
      ];
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
    scenarioComplete() {
      return (
        this.selectedMap &&
        this.selectedDeployment &&
        this.selectedPrimary &&
        this.selectedSecondaryPlayer &&
        this.selectedSecondaryOpponent
      );
    },
    filteredSecondariesPlayer() {
      const allowed = armySecondaryMap[this.player.army];
      return allowed
        ? this.secondaries.filter((s) => allowed.includes(s.name))
        : this.secondaries;
    },
    filteredSecondariesOpponent() {
      const allowed = armySecondaryMap[this.opponent.army];
      return allowed
        ? this.secondaries.filter((s) => allowed.includes(s.name))
        : this.secondaries;
    },
    canSaveReport() {
      return (
        this.playerComplete &&
        this.opponentComplete &&
        this.scenarioComplete &&
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
  watch: {
    "player.id"(id) {
      const p = this.players.find((pl) => pl.id === id);
      this.player.army = p?.army || "";
    },
    "opponent.id"(id) {
      const p = this.players.find((pl) => pl.id === id);
      this.opponent.army = p?.army || "";
    },
    "player.list"(list) {
      const army = this.parseArmy(list);
      if (army) this.player.army = army;
    },
    "opponent.list"(list) {
      const army = this.parseArmy(list);
      if (army) this.opponent.army = army;
    },
    "player.army"() {
      if (
        this.selectedSecondaryPlayer &&
        !this.filteredSecondariesPlayer.some(
          (s) => s.name === this.selectedSecondaryPlayer.name
        )
      ) {
        this.selectedSecondaryPlayer = null;
      }
    },
    "opponent.army"() {
      if (
        this.selectedSecondaryOpponent &&
        !this.filteredSecondariesOpponent.some(
          (s) => s.name === this.selectedSecondaryOpponent.name
        )
      ) {
        this.selectedSecondaryOpponent = null;
      }
    },
    $data: {
      handler() {
        this.saveDraft();
      },
      deep: true,
    },
  },
  methods: {
    saveDraft() {
      const draft = {
        step: this.step,
        reportDate: this.reportDate,
        player: this.player,
        opponent: this.opponent,
        expectedA: this.expectedA,
        expectedB: this.expectedB,
        selectedMap: this.selectedMap,
        selectedDeployment: this.selectedDeployment,
        selectedPrimary: this.selectedPrimary,
        selectedSecondaryPlayer: this.selectedSecondaryPlayer,
        selectedSecondaryOpponent: this.selectedSecondaryOpponent,
        playerMagic: this.playerMagic,
        opponentMagic: this.opponentMagic,
        pointsPlayer: this.pointsPlayer,
        pointsOpponent: this.pointsOpponent,
        primaryResult: this.primaryResult,
        secondaryPlayerCompleted: this.secondaryPlayerCompleted,
      secondaryOpponentCompleted: this.secondaryOpponentCompleted,
      playerMagicDieSaved: this.playerMagicDieSaved,
      opponentMagicDieSaved: this.opponentMagicDieSaved,
      editId: this.editId,
    };
      sessionStorage.setItem("reportDraft", JSON.stringify(draft));
    },

    loadDraft() {
      const stored = sessionStorage.getItem("reportDraft");
      if (!stored) return;
      try {
        const d = JSON.parse(stored);
        this.step = d.step ?? this.step;
        this.reportDate = d.reportDate ?? this.reportDate;
        if (d.player) this.player = d.player;
        if (d.opponent) this.opponent = d.opponent;
        this.expectedA = d.expectedA ?? this.expectedA;
        this.expectedB = d.expectedB ?? this.expectedB;
        this.selectedMap = d.selectedMap ?? this.selectedMap;
        this.selectedDeployment =
          d.selectedDeployment ?? this.selectedDeployment;
        this.selectedPrimary = d.selectedPrimary ?? this.selectedPrimary;
        this.selectedSecondaryPlayer =
          d.selectedSecondaryPlayer ?? this.selectedSecondaryPlayer;
        this.selectedSecondaryOpponent =
          d.selectedSecondaryOpponent ?? this.selectedSecondaryOpponent;
        this.playerMagic = d.playerMagic ?? this.playerMagic;
        this.opponentMagic = d.opponentMagic ?? this.opponentMagic;
        this.pointsPlayer = d.pointsPlayer ?? this.pointsPlayer;
        this.pointsOpponent = d.pointsOpponent ?? this.pointsOpponent;
        this.primaryResult = d.primaryResult ?? this.primaryResult;
        this.secondaryPlayerCompleted =
          d.secondaryPlayerCompleted ?? this.secondaryPlayerCompleted;
        this.secondaryOpponentCompleted =
          d.secondaryOpponentCompleted ?? this.secondaryOpponentCompleted;
        this.playerMagicDieSaved =
          d.playerMagicDieSaved ?? this.playerMagicDieSaved;
        this.opponentMagicDieSaved =
          d.opponentMagicDieSaved ?? this.opponentMagicDieSaved;
        this.editId = d.editId ?? this.editId;
      } catch (err) {
        console.error("Error loading draft", err);
      }
    },
    async fetchPlayers() {
      try {
        const { data } = await getAllPlayers();
        this.players = data;
        if (this.player.id) {
          const p = this.players.find((pl) => pl.id === this.player.id);
          this.player.army = p?.army || this.player.army || "";
        }
        if (this.opponent.id) {
          const p = this.players.find((pl) => pl.id === this.opponent.id);
          this.opponent.army = p?.army || this.opponent.army || "";
        }
      } catch (err) {
        console.error("Error fetching players", err);
      }
    },
    async loadReport(id) {
      try {
        const { data } = await getReportById(id);
        const r = data;
        this.reportDate = r.date ? r.date.substr(0, 10) : this.reportDate;
        this.player.id = r.playerAId;
        this.opponent.id = r.playerBId;
        this.player.list = r.listA;
        this.opponent.list = r.listB;
        this.player.army = r.armyA;
        this.opponent.army = r.armyB;
        this.expectedA = r.expectedA;
        this.expectedB = r.expectedB;
        this.selectedMap = this.maps.find((m) => m.name === r.map) || null;
        this.selectedDeployment =
          this.deployments.find((d) => d.name === r.deployment) || null;
        this.selectedPrimary =
          this.primaries.find((p) => p.name === r.primaryMission) || null;
        this.selectedSecondaryPlayer =
          this.secondaries.find((s) => s.name === r.secondaryA) || null;
        this.selectedSecondaryOpponent =
          this.secondaries.find((s) => s.name === r.secondaryB) || null;
        this.playerMagic = Array.isArray(r.magicA)
          ? [...r.magicA]
          : [null, null, null, null, null, null];
        this.opponentMagic = Array.isArray(r.magicB)
          ? [...r.magicB]
          : [null, null, null, null, null, null];
        this.pointsPlayer = r.killsA;
        this.pointsOpponent = r.killsB;
        if (r.primaryResult === 1) this.primaryResult = "player";
        else if (r.primaryResult === 2) this.primaryResult = "opponent";
        else if (r.primaryResult === 3) this.primaryResult = "both";
        else this.primaryResult = "none";
        this.secondaryPlayerCompleted = r.secondaryWinA;
        this.secondaryOpponentCompleted = r.secondaryWinB;
      } catch (err) {
        console.error("Error loading report", err);
      }
    },
    randomizeFields() {
      const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
      this.selectedMap = rand(this.maps);
      this.selectedDeployment = rand(this.deployments);
      this.selectedPrimary = rand(this.primaries);
      this.selectedSecondaryPlayer = rand(this.filteredSecondariesPlayer);
      this.selectedSecondaryOpponent = rand(this.filteredSecondariesOpponent);
    },
    openPlayerDialog() {
      if (this.currentUser) {
        const playerId =
          this.currentUser.id ??
          this.currentUser.playerId ??
          this.currentUser.Id ??
          this.currentUser.ID;
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
    openInfoDialog(info, image) {
      this.currentInfo = info;
      this.currentImage = image || "";
      this.currentSections = this.parseInfo(info);
      this.infoDialog = true;
    },
    parseInfo(text) {
      if (!text) return [];
      const lines = text.split(/\r?\n/);
      const sections = [];
      let current = null;
      lines.forEach((l) => {
        const line = l.trim();
        if (!line) return;
        const match = line.match(/^([\wÁÉÍÓÚáéíóúÑñ ]+):\s*(.*)$/);
        if (match) {
          if (current) sections.push(current);
          current = { title: match[1], items: [] };
          if (match[2]) current.items.push(match[2]);
        } else if (line.startsWith("-")) {
          if (!current) {
            current = { title: "", items: [] };
          }
          current.items.push(line.substring(1).trim());
        } else {
          if (!current) {
            current = { title: "", items: [] };
          }
          current.items.push(line);
        }
      });
      if (current) sections.push(current);
      return sections;
    },
    magicOptionsForPlayerA(index) {
      return this.magicOptions.filter(
        (opt) =>
          !this.playerMagic.includes(opt.value) ||
          this.playerMagic[index] === opt.value
      );
    },
    magicOptionsForPlayerB(index) {
      return this.magicOptions.filter(
        (opt) =>
          !this.opponentMagic.includes(opt.value) ||
          this.opponentMagic[index] === opt.value
      );
    },
    randomNextPlayerMagic() {
      const idx = this.playerMagic.findIndex((m) => m === null);
      if (idx === -1) return;
      const opts = this.magicOptionsForPlayerA(idx);
      if (!opts.length) return;
      const choice = opts[Math.floor(Math.random() * opts.length)];
      this.playerMagic[idx] = choice.value;
    },
    randomNextOpponentMagic() {
      const idx = this.opponentMagic.findIndex((m) => m === null);
      if (idx === -1) return;
      const opts = this.magicOptionsForPlayerB(idx);
      if (!opts.length) return;
      const choice = opts[Math.floor(Math.random() * opts.length)];
      this.opponentMagic[idx] = choice.value;
    },
    promptMagicDieToggle(owner) {
      this.pendingMagicDieOwner = owner;
      if (owner === 'player') {
        this.pendingMagicDie = !this.playerMagicDieSaved;
      } else {
        this.pendingMagicDie = !this.opponentMagicDieSaved;
      }
      this.magicDieDialog = true;
    },
    confirmMagicDieToggle() {
      if (this.pendingMagicDieOwner === 'player') {
        this.playerMagicDieSaved = this.pendingMagicDie;
      } else if (this.pendingMagicDieOwner === 'opponent') {
        this.opponentMagicDieSaved = this.pendingMagicDie;
      }
      this.magicDieDialog = false;
      this.pendingMagicDieOwner = null;
    },
    cancelMagicDieToggle() {
      this.magicDieDialog = false;
      this.pendingMagicDieOwner = null;
    },
    parseArmy(list) {
      if (!list) return null;
      const firstLine = list.split(/\r?\n/)[0].trim();
      if (!firstLine) return null;
      const lineLower = firstLine.toLowerCase();
      const found = this.armies.find((a) =>
        lineLower.includes(a.toLowerCase())
      );
      return found || null;
    },
    nextStep() {
      this.stepError = null;
      if (this.step === 1 && (!this.playerComplete || !this.opponentComplete)) {
        this.stepError = "Completa la información de los jugadores";
        return;
      }
      if (this.step === 2 && !this.scenarioComplete) {
        this.stepError = "Completa la información del escenario";
        return;
      }
      if (this.step === 3 && !this.magicComplete) {
        this.stepError = "Completa los turnos de magia";
        return;
      }
      this.step++;
    },
    prevStep() {
      this.stepError = null;
      if (this.step > 1) this.step--;
    },
    async saveReport() {
      this.saving = true;
      this.saveError = null;
      const [finalScoreA, finalScoreB] = this.finalScore
        ? this.finalScore.split("-").map((n) => parseInt(n))
        : [0, 0];

      const report = {
        PlayerAId: this.player.id,
        PlayerBId: this.opponent.id,
        listA: this.player.list,
        listB: this.opponent.list,
        armyA: this.player.army || "",
        armyB: this.opponent.army || "",
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
            : this.primaryResult === "both"
            ? "Both"
            : "None",
        secondaryWinA: this.secondaryPlayerCompleted,
        secondaryWinB: this.secondaryOpponentCompleted,
        finalScoreA,
        finalScoreB,
      };
      try {
        if (this.editId) {
          await updateReport(this.editId, report);
        } else {
          await createReport(report);
        }
        sessionStorage.removeItem("reportDraft");
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

.sticky-actions {
  position: sticky;
  bottom: 0;
  background-color: var(--v-theme-surface, #121212);
  z-index: 1;
}

.report-view {
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .modern-btn {
    width: 100%;
    margin: 5px auto;
  }
}
</style>
