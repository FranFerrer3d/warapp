<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>Asistente de Magia</v-card-title>
      <v-card-text>
        <div class="messages">
          <div v-for="(msg, i) in messages" :key="i" :class="msg.role">
            <b>{{ msg.role === 'user' ? 'Tú' : 'GPT' }}:</b> {{ msg.content }}
          </div>
        </div>
        <v-textarea
          v-model="question"
          label="Pregunta"
          auto-grow
          rows="1"
          outlined
        />
        <div class="d-flex align-center">
          <v-btn icon @click="toggleRecording">
            <v-icon>{{ recording ? 'mdi-microphone-off' : 'mdi-microphone' }}</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="sendQuestion" :loading="loading" :disabled="!question">Enviar</v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="show = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { askChatGPT } from '@/services/chatgptService'

export default {
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  data() {
    return {
      show: this.modelValue,
      question: '',
      messages: [],
      loading: false,
      recording: false,
      recognition: null,
    }
  },
  watch: {
    modelValue(val) {
      this.show = val
    },
    show(val) {
      this.$emit('update:modelValue', val)
    },
  },
  mounted() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'es-ES'
      this.recognition.interimResults = false
      this.recognition.continuous = false
      this.recognition.onresult = (e) => {
        const text = e.results[0][0].transcript
        this.question = (this.question + ' ' + text).trim()
      }
      this.recognition.onend = () => {
        this.recording = false
      }
    }
  },
  methods: {
    toggleRecording() {
      if (!this.recognition) return
      if (this.recording) {
        this.recognition.stop()
      } else {
        this.recognition.start()
      }
      this.recording = !this.recording
    },
    async sendQuestion() {
      if (!this.question) return
      const q = this.question
      this.question = ''
      this.messages.push({ role: 'user', content: q })
      this.loading = true
      try {
        const { data } = await askChatGPT({ question: q })
        this.messages.push({ role: 'bot', content: data.answer || 'Sin respuesta' })
      } catch (err) {
        console.error('Error', err)
        this.messages.push({ role: 'bot', content: 'Error obteniendo respuesta' })
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>
.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 12px;
}
.user {
  text-align: right;
  margin-bottom: 4px;
}
.bot {
  text-align: left;
  margin-bottom: 4px;
}
</style>

