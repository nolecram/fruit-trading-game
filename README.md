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
- **Interactive Console**: Track your money, days left, and inventory in real-time.
- **Cross-Platform**: Compatible with macOS, Linux, and Windows.

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
3. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
4. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Start the game:
   ```bash
   python src/game.py
   ```

---

## File Structure

```
fruit-trading-game/
├── src/
│   ├── game.py          # Main game logic
│   ├── game.ts          # TypeScript version of the game logic
│   ├── models/          # Data models
│   │   ├── fruit.py     # Fruit model (Python)
│   │   └── fruit.ts     # Fruit model (TypeScript)
│   ├── services/        # Business logic
│   │   ├── trading_service.py  # Trading service (Python)
│   │   └── tradingService.ts   # Trading service (TypeScript)
│   ├── utils/           # Utility functions
│   │   ├── helpers.py   # Helper functions (Python)
│   │   └── helpers.ts   # Helper functions (TypeScript)
├── public/
│   ├── index.html       # Frontend entry point
│   ├── styles.css       # Styling for the game
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
├── tsconfig.json        # TypeScript configuration
├── README.md            # Project documentation
```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.