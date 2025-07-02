# WarApp Frontend

This repository contains the front-end of the WarApp project. The application is built with Vue 3 and Vuetify.

## ChatGPT integration

The magic step now includes an optional chatbot modal that connects directly to
the OpenAI API. The API key is provided via the `ChatBotPass` environment variable at build time:

```
ChatBotPass=your-key-here
```

You can set this value in `.env` during development or `.env.production` for a production build. Additional chatbot settings such as the endpoint or model are defined in `frontend/src/config/appsettings.json`.

## End-to-end tests

Cypress is used for e2e testing. To execute the tests you need the
application running in preview mode on port `4173`:

```bash
cd frontend
npm run build
npm run preview &
# in another terminal
npm run test:e2e
```

This will launch Cypress and run the test suite located in `frontend/cypress`.
