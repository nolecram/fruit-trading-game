# Fruit Trading Game 🍎 🍌 🍊

Welcome to the **Fruit Trading Game**! This fun and interactive game allows you to trade fruits over 30 days to maximize your profits. Each day, fruit prices fluctuate, and random events can influence the market. Can you make the most money by the end of the game?

[![Game Status](https://img.shields.io/badge/status-active-success.svg)](https://shields.io/)
[![Platform](https://img.shields.io/badge/platform-web-blue.svg)](https://shields.io/)
[![Trading Days](https://img.shields.io/badge/trading%20days-30-orange.svg)](https://shields.io/)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://shields.io/)

## How to Play

1. **Objective**: Start with $100 and trade fruits over 30 days to maximize your profits.
2. **Daily Actions**:
   - Observe the daily fruit prices and special events
   - Use market tips to make informed trading decisions
   - Buy low and sell high to maximize profits
   - Watch out for random events that can influence prices or your money
3. **End of Game**: The game ends after 30 days, with your final score being the amount of money you have.

## Features

- **Dynamic Pricing**: Fruit prices change daily with a ±20% variation
- **Market Analysis**: Price trend indicators and historical price tracking
- **Trading Tips**: Smart market insights and trading recommendations
- **Achievement System**: Unlock achievements for various trading milestones:
  - 🏆 Fruit Baron: Own 50 of any fruit at once
  - 💰 Profit Master: Make $100 profit in a single trade
  - 📊 Diverse Portfolio: Own all types of fruits
  - 🎯 Lucky Streak: Get 3 positive events in a row
  - 💪 Market Survivor: Recover from having less than $50
- **Special Events**: Random events like storms, bumper harvests, lottery wins, or taxes
- **Economic Impact Display**: Clear visualization of event effects on prices and money
- **Price Trends**: Visual indicators (↗️↘️) showing market movements
- **Sound System**:
  - Background music with multiple tracks
  - Volume controls and sound test functionality
  - Music customization options
- **Visual Feedback**:
  - Achievement popups with animations
  - Color-coded price changes
  - Interactive inventory items
  - Victory/Loss animations
- **Responsive Design**: Plays well on various screen sizes

## Installation & Running

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd fruit-trading-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the web server:
   ```bash
   npm run web
   ```

   For development with hot-reloading:
   ```bash
   npm run web:dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Project Structure

```
fruit-trading-game/
├── public/               # Web version files
│   ├── index.html        # Main HTML interface
│   ├── styles.css        # CSS styling
│   ├── audio/            # Background music files
│   │   └── fallback.mp3  # Fallback audio file
│   └── scripts/
│       └── game.js       # Main game logic
├── src/                  # TypeScript source code
│   ├── game.ts           # Game entry point
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── package.json          # Node.js dependencies
└── tsconfig.json         # TypeScript configuration
```

## Controls & Gameplay

- **Market Analysis**: Watch price trends and follow market tips for better trading
- **Trading**: Use the blue buttons to buy and sell fruits
- **Events**: Special events display at the start of each day with economic impact information
- **Achievements**: Unlock special achievements through strategic trading
- **Music Controls**: 
  - Toggle music with play/pause
  - Adjust volume
  - Change tracks by clicking the game title
  - Test audio system with built-in diagnostics
- **Price History**: Track historical prices to make informed decisions

## Technical Implementation

The game is implemented in **TypeScript/JavaScript** with a focus on modern web technologies:
- TypeScript for type-safe code
- Modern CSS with animations and responsive design
- Web Audio API for sound management
- DOM manipulation for dynamic UI updates

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Commit your changes
4. Push to your branch
5. Open a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- Background music from [Chosic](https://www.chosic.com/)
- Special thanks to all contributors and players!

---

© 2025 Fruit Trading Game. Created by Marco Celon.