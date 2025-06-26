# WarApp Frontend

This repository contains the front-end of the WarApp project. The application is built with Vue 3 and Vuetify.

## ChatGPT integration

The magic step now includes an optional chatbot modal that connects directly to the OpenAI API. To enable it you must define an API key at build time:

```
VITE_OPENAI_API_KEY=your-key-here
```

You can set this value in `.env` during development or `.env.production` for a production build.

Note that exposing an OpenAI API key in a public build is not recommended for production environments.
