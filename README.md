# Fruit Trading Game

A fun fruit trading game where players can buy and sell fruits to maximize profits over 30 days. Features achievements, market analysis, and dynamic events.

## Features

- Buy and sell various fruits to maximize profits
- Track price trends and history
- Dynamic events that impact market prices
- Achievement system to reward different play styles
- 30-day gameplay loop with end-game score

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/fruit-trading-game.git
cd fruit-trading-game
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run web:dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Development

### Project Structure

```
├── public/             # Static assets and HTML
├── src/                # Source code
│   ├── models/         # Data models
│   ├── services/       # Business logic
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Helper functions
│   └── game.ts         # Main game logic
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

### Available Scripts

- `npm start`: Run the game using ts-node
- `npm run build`: Build the project
- `npm run web`: Serve the public directory
- `npm run web:dev`: Serve the public directory with caching disabled
- `npm run lint`: Check code for style issues
- `npm run lint:fix`: Automatically fix style issues when possible

## Game Mechanics

### Trading

Players start with a set amount of money and can buy and sell different types of fruits. Prices fluctuate daily, and players must strategize to maximize profits.

### Events

Random events can occur each day, affecting fruit prices or the player's money:
- Storms: Increase fruit prices
- Bumper harvests: Decrease fruit prices
- Lottery: Increase player money
- Taxes: Decrease player money

### Achievements

Players can earn achievements for different strategies:
- Fruit Baron: Own 50 of any fruit at once
- Profit Master: Make $100 profit in a single trade
- Diverse Portfolio: Own all types of fruits
- Lucky Streak: Get 3 positive events in a row
- Market Survivor: Recover from having less than $50

## License

This project is licensed under the MIT License - see the LICENSE file for details.