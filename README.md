# MMO Sandbox

A frontend sandbox application for an MMO (Massively Multiplayer Online) game, built with modern web technologies. This project demonstrates a complete game interface including character creation, crafting, guilds, PvP combat, market trading, skills, and world exploration.

## Features

- **Character Creation**: Create and customize your character
- **Dashboard**: Overview of your character's stats and activities
- **Crafting System**: Craft items using various stations and recipes
- **Guild Management**: Join or create guilds, manage members and alliances
- **PvP Combat**: Engage in player-vs-player battles in designated zones
- **Market Trading**: Buy and sell items in the in-game market
- **Skills System**: Level up various skills to improve your character
- **World Map**: Explore different regions and travel between them
- **Inventory Management**: Manage your items and resources

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Charts**: Chart.js
- **Mocking**: MSW (Mock Service Worker)
- **Linting**: ESLint

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mmo_sandbox
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API handlers
│   ├── components/    # React components organized by feature
│   │   ├── character/
│   │   ├── common/
│   │   ├── crafting/
│   │   ├── dashboard/
│   │   ├── guilds/
│   │   ├── layout/
│   │   ├── market/
│   │   ├── pvp/
│   │   ├── skills/
│   │   ├── worldmap/
│   ├── mocks/         # Mock data for development
│   ├── styles/        # CSS styles
│   └── main.tsx       # Application entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Development

This project uses mock data for all game features, making it a frontend-only demonstration. The mock service worker (MSW) intercepts API calls and returns predefined data.

Key components:
- `App.tsx` - Main application component with character creation flow
- `GameInterface.tsx` - Main game UI with navigation tabs
- Various feature-specific components in their respective folders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is private and proprietary.</content>
<parameter name="filePath">h:\WebHatchery\game_apps\mmo_sandbox\README.md
