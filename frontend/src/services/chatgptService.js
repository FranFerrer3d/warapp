
import axios from 'axios'

// Direct call to the OpenAI API. The API key must be provided via the
// `VITE_OPENAI_API_KEY` environment variable at build time.
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export const askChatGPT = ({ question }) => {
  return axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Eres un experto en 9th Age y ayudas a los jugadores a resolver dudas.',
        },
        { role: 'user', content: question },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

