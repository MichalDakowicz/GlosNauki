# GlosNauki

Aplikacja mobilna React Native (Expo + TypeScript) dla projektu Inteligentny Asystent Edukacyjny.

## Stan aktualny

Ekran glowny jest przygotowany w wersji placeholder:

- klikniecie obszaru "DODAJ PLIK" otwiera modal z 4 przykladowymi obrazami,
- klikniecie przycisku glosowego uruchamia kolejne przykładowe komendy VUI,
- dolna nawigacja przelacza zakladki placeholder i pokazuje komunikaty testowe,
- wszystkie odpowiedzi i teksty sterujace pochodza z plikow JSON.

## Struktura

- `src/screens/MainScreen.tsx` - glowny ekran zgodny z makieta,
- `src/components/*` - komponenty UI i placeholder flow,
- `src/data/placeholderResponses.json` - mock odpowiedzi i komunikatow,
- `src/data/sampleImages.json` - 4 przykladowe obrazy pod upload.

## Uruchomienie

1. `npm install`
2. `npm run android` lub `npm run ios` lub `npm run web`

## Kolejny krok

W kolejnym etapie mozna podmienic dane JSON na rzeczywiste endpointy REST/WebSocket backendu FastAPI, bez przebudowy warstwy UI.

