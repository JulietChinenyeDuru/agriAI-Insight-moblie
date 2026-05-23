# AgriAI Insights Mobile

> AI-powered crop yield predictions in the hands of Nigerian smallholder farmers.

A React Native / Expo mobile app that connects to the [AgriAI Insights](https://github.com/JulietChinenyeDuru/agriAI-insights) backend, letting farmers get instant yield forecasts, save their results, and review history — even when offline. Also deployable as a progressive web app via Netlify.

---

## Features

| Feature | Description |
|---|---|
| **Prediction Form** | Enter region, crop type, rainfall, temperature, humidity, fertilizer, soil pH, and farm size to get an AI yield forecast |
| **AI Results Screen** | Displays predicted yield (t/ha), confidence score, and season-fit advice |
| **Offline History** | All saved predictions are stored on-device via AsyncStorage — no network needed to review past results |
| **Season Awareness** | Home screen fetches the current growing season from the API and surfaces relevant crop recommendations |
| **Android, iOS & Web** | Targets Android-first (APK / AAB via EAS); iOS and web (Netlify PWA) also supported |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev/) + [Expo SDK 52](https://docs.expo.dev/) |
| Navigation | React Navigation (Native Stack) |
| Offline storage | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |
| Web support | [react-native-web](https://necolas.github.io/react-native-web/) + [@expo/metro-runtime](https://docs.expo.dev/) |
| Cloud builds | [EAS Build](https://docs.expo.dev/build/introduction/) (development / preview / production profiles) |
| OTA updates | [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/) |
| Web hosting | [Netlify](https://www.netlify.com/) |
| Backend API | FastAPI on AWS Lambda — [agriAI-insights](https://github.com/JulietChinenyeDuru/agriAI-insights) |

---

## Screens

```
App.js
└── NativeStack
    ├── HomeScreen       — current season + navigation entry points
    ├── PredictionScreen — crop input form → calls POST /predict
    ├── ResultsScreen    — displays prediction + Save to History button
    └── HistoryScreen    — reads saved predictions from AsyncStorage
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/client) on your Android or iOS device **or** an Android emulator

### Install & run

```bash
git clone https://github.com/JulietChinenyeDuru/agriAI-insights-mobile.git
cd agriAI-insights-mobile
npm install
npx expo start
```

Scan the QR code in Expo Go to open the app on your device.

### Run in the browser

```bash
npm run web
# or
npx expo start --web
```

### Point at a custom backend

```bash
EXPO_PUBLIC_AGRIAI_API_URL=https://your-api-url.execute-api.eu-west-1.amazonaws.com npx expo start
```

The default backend is the live deployment at `https://urr6s98icd.execute-api.eu-west-1.amazonaws.com`.

---

## Netlify Web Deployment

The app is configured to export a static web build via Expo and serve it through Netlify.

### Build & deploy

Pushes to `main` automatically trigger a Netlify deploy. The build command is:

```bash
expo export -p web
```

Output is published from the `dist/` directory.

### Environment variables (Netlify UI)

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_AGRIAI_API_URL` | Backend API base URL (optional — defaults to the live AWS endpoint) |

---

## EAS Cloud Builds (Android / iOS)

```bash
# Debug APK (internal testing)
eas build --profile development

# Preview APK (internal distribution)
eas build --profile preview

# Production AAB (Google Play)
eas build --profile production
```

Requires an [Expo account](https://expo.dev/) and `EXPO_TOKEN` set in your CI/CD environment.

---

## Project Structure

```
agriAI-insights-mobile/
├── App.js                  # root navigator
├── app.json                # Expo config (package name, versioning, platforms, plugins)
├── eas.json                # EAS build profiles
├── babel.config.js
├── package.json
└── src/
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── PredictionScreen.js
    │   ├── ResultsScreen.js
    │   └── HistoryScreen.js
    └── services/
        └── ApiService.js   # HTTP wrapper (reads EXPO_PUBLIC_AGRIAI_API_URL)
```

---

## Monitoring

The backend API is monitored via a full observability stack maintained in the main repository under [`monitoring/`](https://github.com/JulietChinenyeDuru/agriAI-insights/tree/main/monitoring).

| Tool | Purpose | Port |
|---|---|---|
| **Prometheus** | Metrics scraping & alerting (error rate, latency, prediction volume) | 9090 |
| **Grafana** | 12-panel dashboard — request rate, p95 latency, top crops, yield distribution | 3000 |
| **Zipkin** | Distributed request tracing via OpenTelemetry | 9411 |
| **UptimeRobot** | External uptime checks on the API and this web app every 5 minutes | — (cloud) |

Start the full stack locally:

```bash
# from the agriAI-insights repo root
cd monitoring/docker
docker compose up -d
```

Then open Grafana at http://localhost:3000 (admin / admin) — the AgriAI dashboard loads automatically.

---

## Related

- **Main repository & backend:** [github.com/JulietChinenyeDuru/agriAI-insights](https://github.com/JulietChinenyeDuru/agriAI-insights)
- **Monitoring stack:** [agriAI-insights/monitoring](https://github.com/JulietChinenyeDuru/agriAI-insights/tree/main/monitoring)
- **Live web app:** [agriai-insight.netlify.app](https://agriai-insight.netlify.app)

---

## Author

**Juliet Chinenye Duru**
- GitHub: [@JulietChinenyeDuru](https://github.com/JulietChinenyeDuru)
- Email: durujulietchinenye@gmail.com

---

## License

MIT
