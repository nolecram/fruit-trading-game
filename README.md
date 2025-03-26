# Fruit Trading Game

A fun fruit trading game where players can buy and sell fruits to maximize profits over 30 days. Features achievements, market analysis, and dynamic events.

## Play Online

You can play the game directly in your browser without installation via GitHub Pages:

**[Play Fruit Trading Game Online](https://nolecram.github.io/fruit-trading-game/)**

## Features

- Buy and sell various fruits to maximize profits
- Track price trends and history
- Dynamic events that impact market prices
- Achievement system to reward different play styles
- 30-day gameplay loop with end-game score
- Dark/Light mode toggle for comfortable gameplay in any environment

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm

### Installation

1. Clone the repository:
```
git clone https://github.com/nolecram/fruit-trading-game.git
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

### GitHub Pages Deployment

The game is deployed on GitHub Pages and is accessible at [https://nolecram.github.io/fruit-trading-game/](https://nolecram.github.io/fruit-trading-game/).

To update the GitHub Pages deployment:

1. Make and test your changes on the main branch
2. Merge the changes to the gh-pages branch:
```
git checkout gh-pages
git merge main
git push origin gh-pages
```
3. GitHub will automatically rebuild and deploy the updated site

The deployment uses a simple redirect from the root level to the public folder where the game is located.

## Game Mechanics

### How to Play

1. **Starting the Game**: Click the "Start Trading" button on the landing page to begin your 30-day trading journey.

2. **User Interface**:
   - The top panel shows special events that affect prices
   - Left side displays your available money and days remaining
   - Buy and Sell buttons allow you to trade fruits
   - Market inventory shows available fruits and their current prices
   - Your inventory displays the fruits you own
   - Price trends chart helps you analyze market movements
   - Market tips provide strategic advice

3. **Controls**:
   - Buy/Sell buttons: Trade fruits at current market prices
   - Next Day button: Advance to the next day (prices will change)
   - Dark/Light mode toggle: Switch between light and dark themes (top right)
   - Music controls: Play/pause background music and adjust volume (top left)

4. **Winning**: Finish the 30-day period with more money than you started with (over $100).

### Trading

Players start with $100 and can buy and sell different types of fruits. Prices fluctuate daily, and players must strategize to maximize profits.

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