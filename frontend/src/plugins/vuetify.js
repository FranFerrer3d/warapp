import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'esports',
    themes: {
      esports: {
        dark: true,
        colors: {
          background: '#000000',
          surface: '#121212',
          primary: '#00bfff',
          secondary: '#6a0dad',
          accent: '#ffef00',
        },
      },
    },
  },
})
