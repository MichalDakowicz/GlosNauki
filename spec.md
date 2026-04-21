# Specyfikacja techniczna – Inteligentny Asystent Edukacyjny

## 1\. Architektura systemu

System składa się z lekkiej aplikacji mobilnej (React Native) oraz backendu chmurowego opartego o FastAPI. Komunikacja między klientem a serwerem odbywa się z wykorzystaniem REST (operacje nie‑czasowe) oraz WebSocketów dla dwukierunkowego strumieniowania audio (ASR/TTS) i zdarzeń w czasie rzeczywistym.

### 1.1. Warstwa kliencka (React Native)

- Platformy: iOS, Android.
- Technologie: React Native, TypeScript.
- Dostępność:
    - wykorzystanie natywnych komponentów z poprawnie skonfigurowanymi atrybutami `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`,
    - wsparcie dla VoiceOver i TalkBack, testy manualne podstawowych ścieżek z włączonym screen‑readerem,
    - logiczna kolejność fokusa, unikanie pułapek i nieoczekiwanych zmian kontekstu.
- VUI:
    - integracja z systemowym API rozpoznawania mowy (lub zewnętrznym ASR przez WebSocket),
    - mapowanie komend głosowych na akcje nawigacyjne (start, następny fragment, powtórka, zmiana szczegółowości).

### 1.2. Warstwa serwerowa (FastAPI)

- Język: Python.
- Framework: FastAPI (async).
- Endpointy:
    - REST: zarządzanie użytkownikami, sesjami, materiałami, konfiguracją preferencji,
    - WebSocket: strumieniowe przyjmowanie audio do ASR oraz wysyłanie wygenerowanego audio z TTS (np. w formacie OGG/MP3/PCM).
- Integracje:
    - LLM (GPT‑5.x / GPT-o1 / Claude 4.5 / Gemini 3 Pro) przez API HTTP,
    - TTS (ElevenLabs Turbo) przez API HTTP, z możliwością streamingu i optymalizacji opóźnień,
    - opcjonalnie OCR (Google Cloud Vision) jako usługa pomocnicza dla plików PDF/obrazów.

## 2\. Moduły logiczne backendu

### 2.1. Moduł źródeł tekstu

- Obsługiwane wejścia:
    - czysty tekst (wklejony, z plików, z CMS/LMS),
    - pliki PDF (ekstrakcja tekstu, a w razie potrzeby OCR),
    - obrazy (np. zdjęcia tablicy/notatek) – opcjonalna ścieżka z OCR.
- OCR:
    - użycie Google Cloud Vision API (tryb dokumentowy dla druku, ewentualnie handwriting dla prostych notatek),
    - pre‑processing po stronie klienta lub backendu (kadrowanie, poprawa kontrastu) w celu zwiększenia jakości rozpoznawania.

### 2.2. Moduł przetwarzania tekstu (Text Processing Core)

- Zadania:
    - segmentacja tekstu na sekcje, akapity, definicje, przykłady, zadania,
    - normalizacja tekstu (usuwanie artefaktów OCR, korekta białych znaków, ujednolicenie znaków),
    - dodanie prostych metadanych (typ fragmentu, ważność, powiązania między fragmentami).
- Implementacja:
    - połączenie heurystyk (regexy, proste reguły) z wywołaniami LLM do „inteligentnego” tagowania i segmentacji w przypadkach niejednoznacznych.

### 2.3. Silnik dialogowy LLM

- Zakres odpowiedzialności:
    - generowanie streszczeń materiału na różnych poziomach szczegółowości,
    - tworzenie pytań zgodnych z taksonomią Blooma (od prostych pytań faktograficznych po zadania wymagające analizy i syntezy),
    - ocenianie odpowiedzi użytkownika (trafność, kompletność, poziom zrozumienia),
    - dynamiczne dostosowywanie trudności pytań oraz sposobu wyjaśniania.
- Technicznie:
    - warstwa „prompt engineeringu” i szablonów rozmowy z LLM,
    - pamięć sesyjna (kontekst bieżącej sesji \+ meta‑dane postępu użytkownika).

### 2.4. Moduł interaktywnej powtórki

- Logika dialogowa (state machine / state chart) opisująca przebieg sesji:
    - inicjalizacja (wybór materiału, trybu, poziomu szczegółowości),
    - cykl pytanie → odpowiedź → ocena → feedback,
    - obsługa akcji użytkownika (prośba o podpowiedź, powtórzenie, zmiana trybu).
- Integracja z ASR/TTS:
    - odbiór transkryptów z ASR,
    - przekazywanie odpowiedzi LLM do TTS i ich streaming do klienta.

## 3\. Warstwa głosowa

### 3.1. ASR (Automatic Speech Recognition)

- Możliwe podejścia:
    - wykorzystanie systemowego ASR (iOS/Android) – mniejsze opóźnienia, brak dodatkowych kosztów chmurowych,
    - zewnętrzny ASR w chmurze – w przypadku wymagań dot. jakości, języków lub słowników domenowych.
- Wymagania:
    - obsługa języka polskiego,
    - możliwość pracy w trybie near‑real‑time (strumień lub krótkie fragmenty),
    - konfiguracja słowników domenowych (terminy z przedmiotów szkolnych).

### 3.2. TTS (Text‑to‑Speech)

- Usługa: ElevenLabs (modele Turbo z obsługą języka polskiego).
- Wymagania funkcjonalne:
    - naturalnie brzmiące głosy męskie/żeńskie, możliwość wyboru przez użytkownika,
    - wsparcie dla regulacji tempa mowy, głośności, ekspresji,
    - możliwość streamingu odpowiedzi w krótkich kawałkach (aby zredukować odczuwalne opóźnienia).
- Optymalizacja latencji:
    - wykorzystywanie mechanizmów „latency optimization” dostarczanych przez API (np. krótkie zapytania, odpowiednie formaty audio, dobór regionu),
    - wstępne generowanie krótkich komunikatów często używanych (np. komunikaty nawigacyjne).

## 4\. Dostępność i VUI

### 4.1. WCAG 2.1 AA \+ screen‑reader‑first

- Implementacja zasad:
    - odpowiednie role i etykiety dla komponentów UI,
    - zachowanie kolejności fokusa zgodnej z wizualnym i logicznym układem,
    - wyraźne komunikaty błędów i stanów (fokus przenoszony na komunikat, odczyt przez screen‑reader).
- Proces:
    - regularne testy manualne z VoiceOver (iOS) i TalkBack (Android),
    - check‑lista scenariuszy (logowanie, wybór materiału, start sesji, odpowiedzi na pytania, zmiana ustawień).

### 4.2. VUI (Voice User Interface)

- Projektowanie komend głosowych:
    - zestaw prostych, naturalnych komend („następne”, „powtórz”, „wytłumacz prościej”, „zadaj trudniejsze pytanie”),
    - unikanie skomplikowanych fraz, możliwość rozpoznawania wariantów.
- Sprzężenie zwrotne:
    - krótkie komunikaty potwierdzające akcję (np. „Przechodzimy do kolejnego fragmentu”, „Powtarzam ostatnie wyjaśnienie”),
    - możliwość przerwania długiej wypowiedzi prostą komendą („stop”, „wystarczy”).

## 5\. Bezpieczeństwo i prywatność

- Komunikacja:
    - wszystkie połączenia klient ↔ serwer oraz serwer ↔ dostawcy zewnętrzni zabezpieczone protokołem HTTPS (TLS),
    - brak przechowywania haseł w formie jawnej.
- Dane:
    - minimalizacja zakresu gromadzonych danych osobowych,
    - anonimizacja treści przed wysłaniem do usług LLM/TTS, gdy to możliwe,
    - polityki retencji (np. usuwanie nagrań audio po określonym czasie).
- Zgodność:
    - dostosowanie do obowiązujących przepisów w zakresie ochrony danych osobowych (RODO) oraz wytycznych European Accessibility Act w zakresie dostępności usług cyfrowych.
