# Fruit Trading Game 🍎 🍌 🍊

Welcome to the **Fruit Trading Game**! This fun and interactive game allows you to trade fruits over 30 days to maximize your profits. Each day, fruit prices fluctuate, and random events can influence the market. Can you make the most money by the end of the game?

![Fruit Trading Game](https://i.imgur.com/exampleimage.png)

## How to Play

1. **Objective**: Start with $100 and trade fruits over 30 days to maximize your profits.
2. **Daily Actions**:
   - Observe the daily fruit prices and special events
   - Buy or sell fruits based on the market conditions
   - Watch out for random events that can influence prices or your money
3. **End of Game**: The game ends after 30 days, with your final score being the amount of money you have.

## Features

- **Dynamic Pricing**: Fruit prices change daily with a ±20% variation.
- **Special Events**: Random events like storms, bumper harvests, lottery wins, or taxes influence prices or your money.
- **Economic Impact Display**: Clear presentation of how events affect your finances.
- **Victory/Loss Screens**: Engaging animations when you win or lose the game.
- **Background Music**: Fun tunes to enjoy while trading fruits.
- **Responsive Design**: Plays well on various screen sizes.
- **Cross-Platform**: Runs on macOS, Linux, and Windows.

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
│       └── game.js       # Main game logic for web version
├── src/                  # Source code
│   ├── game.ts           # TypeScript version
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # This documentation
```

## Controls & Gameplay

- **Special Events**: Display at the beginning of each day with economic impact information
- **Buy/Sell**: Use the blue buttons to trade fruits
- **Background Music**: Toggle music using controls in the bottom-right corner
- **Victory/Loss**: Experience animations based on your final money amount

## Technical Implementation

The game is implemented in **JavaScript/TypeScript** and features modern CSS with animations, responsive design, and interactive elements.

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