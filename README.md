# MetaloTrack

A React Native Expo app to track live prices of Gold, Silver, Platinum, and Palladium in INR using goldapi.io.

## Features
- HomeScreen: 4 metal cards (Gold, Silver, Platinum, Palladium) with live price, timestamp, loading spinner per tile, error handling, navigation to DetailsScreen.
- DetailsScreen: Metal name, Previous Close, Previous Open, Current Price, fetched time, and today's date/time.
- API: goldapi.io, Axios, reusable getMetalPrice function.
- Components: MetalCard (loading/error/data).
- Navigation: React Navigation Stack.
- Functional components, hooks, ScrollView, clean UI.

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start Expo:
   ```sh
   npx expo start
   ```
3. API Key: Already included in `api/metals.js`.

## Folder Structure
- `screens/` - HomeScreen, DetailsScreen
- `components/` - MetalCard
- `api/` - metals.js

## Customization
- Replace UI colors/styles as needed for branding.
- Replace API key if required.

---
© 2025 MetaloTrack
