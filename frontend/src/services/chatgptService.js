
import axios from 'axios'
import appsettings from '@/config/appsettings.json'

// The OpenAI API key is provided through the `ChatBotPass` environment variable.
const OPENAI_API_KEY = import.meta.env.ChatBotPass

export const askChatGPT = ({ question }) => {
  return axios.post(
    appsettings.chatbot.endpoint,
    {
      model: appsettings.chatbot.model,
      messages: [
        {
          role: 'system',
          content: appsettings.chatbot.systemPrompt,
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

