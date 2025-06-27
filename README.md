# WarApp Frontend

This repository contains the front-end of the WarApp project. The application is built with Vue 3 and Vuetify.

## ChatGPT integration

The magic step now includes an optional chatbot modal that connects directly to
the OpenAI API. The API key is provided via the `ChatBotPass` environment variable at build time:

```
ChatBotPass=your-key-here
```

You can set this value in `.env` during development or `.env.production` for a production build. Additional chatbot settings such as the endpoint or model are defined in `frontend/src/config/appsettings.json`.
