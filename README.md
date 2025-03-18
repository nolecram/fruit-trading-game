# Fruit Trading Game

Welcome to the **Fruit Trading Game**! This is a fun and interactive game where you trade fruits over 30 days to maximize your profits. Each day, fruit prices fluctuate, and random events can influence the market. Can you make the most money by the end of the game?

---

## How to Play

1. **Objective**: Start with $100 and trade fruits over 30 days to maximize your profits.
2. **Daily Actions**:
   - Observe the daily fruit prices.
   - Buy or sell fruits based on the market conditions.
   - Watch out for random events that can influence prices or your money.
3. **End of Game**: The game ends after 30 days. Your final score is the amount of money you have.

---

## Features

- **Dynamic Pricing**: Fruit prices change daily with a ±20% variation.
- **Random Events**: Special events like storms, bumper harvests, lottery wins, or taxes can influence prices or your money by ±15%.
- **Interactive UI**: Track your money, days left, and inventory in real-time.
- **ASCII Art**: Enjoy ASCII art representations of fruits and game status at the end of each day.
- **Start and End Pages**: Begin the game with a starting page and conclude with a positive or negative ending page based on your performance.

---

## Installation

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
4. Start the game:
   ```bash
   npm start
   ```

---

## Game Preview

![Game Screenshot](https://via.placeholder.com/800x400?text=Game+Preview)

---

## File Structure

```
fruit-trading-game/
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Styles for the game
├── src/
│   ├── game.ts          # Main game logic
│   ├── models/          # Data models
│   │   └── fruit.ts     # Fruit model
│   ├── services/        # Business logic
│   │   └── tradingService.ts
│   ├── types/           # Type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── helpers.ts
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
├── README.md            # Project documentation
```

---

## ASCII Art for Fruits

Here are some ASCII art representations of the fruits used in the game:

- Apple:
```
   ,--./,-.
  / #      \
 |          |
  \        / 
   `._,._,'
```

- Banana:
```
   _
  //\
 ||  \
 ||   `-.
  \\     `-.
   `-._     `-.
       `-._    `-.
           `-._.-'
```

- Orange:
```
   .-""""-.
  /        \
 /          \
 |,  .-.  .-.  ,|
 | )(_o/  \o_)( |
 |/     /\     \|
 (_     ^^     _)
  \__|IIIIII|__/
   `--'IIIIII'--'
```

These ASCII arts are displayed in the game at the end of each day to enhance the user experience.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.