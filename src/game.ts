// This file is the entry point of the game. It initializes the game logic and manages the game loop.

class TradingService {
    private inventory: Map<string, { price: number, quantity: number }>;

    constructor() {
        this.inventory = new Map([
            ['Apple', { price: 1.0, quantity: 10 }],
            ['Banana', { price: 1.2, quantity: 8 }],
            ['Orange', { price: 0.8, quantity: 15 }],
        ]);
    }

    public getInventory(): Map<string, { price: number, quantity: number }> {
        return this.inventory;
    }

    public buyFruit(name: string, quantity: number, price: number): boolean {
        const fruit = this.inventory.get(name);
        if (fruit && fruit.quantity >= quantity) {
            fruit.quantity -= quantity;
            return true;
        }
        return false;
    }

    public sellFruit(name: string, quantity: number, price: number): boolean {
        const fruit = this.inventory.get(name);
        if (fruit) {
            fruit.quantity += quantity;
            return true;
        }
        return false;
    }
}

class Game {
    private isRunning: boolean;
    private daysLeft: number;
    private money: number;
    private tradingService: TradingService;

    constructor() {
        this.isRunning = false;
        this.daysLeft = 30; // Game lasts 30 days
        this.money = 100; // Starting money
        this.tradingService = new TradingService();
    }

    public start(): void {
        this.isRunning = true;
        this.updateUI();
        console.log(`Game started! You have $${this.money}.`);
        this.gameLoop();
    }

    private gameLoop(): void {
        if (!this.isRunning || this.daysLeft <= 0) {
            console.log("Game over!");
            this.stop();
            return;
        }

        console.log(`Day ${31 - this.daysLeft}:`);
        this.triggerSpecialEvent();
        this.updateFruitPrices();
        this.updateUI();

        // Display ASCII art at the end of the day
        this.displayAsciiArt();

        // Simulate a day passing
        this.daysLeft--;

        // Continue to the next day
        setTimeout(() => this.gameLoop(), 1000); // Simulate a delay for the next day
    }

    private triggerSpecialEvent(): void {
        const events = [
            { description: "A storm destroyed some crops! Prices increase.", effect: 1.5 },
            { description: "A bumper harvest! Prices decrease.", effect: 0.5 },
            { description: "No special events today.", effect: 1.0 },
            { description: "You won the lottery! Money increased by 15%.", moneyEffect: 1.15 },
            { description: "You had to pay unexpected taxes. Money decreased by 15%.", moneyEffect: 0.85 },
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        console.log(randomEvent.description);

        if (randomEvent.effect !== undefined) {
            const inventory = this.tradingService.getInventory();
            inventory.forEach((fruit) => {
                fruit.price = parseFloat((fruit.price * randomEvent.effect).toFixed(2));
            });
        }

        if (randomEvent.moneyEffect !== undefined) {
            this.money = parseFloat((this.money * randomEvent.moneyEffect).toFixed(2));
        }
    }

    private updateFruitPrices(): void {
        const inventory = this.tradingService.getInventory();
        inventory.forEach((fruit, name) => {
            const newPrice = parseFloat((fruit.price * (0.8 + Math.random() * 0.4)).toFixed(2)); // Price varies by ±20%
            fruit.price = newPrice;
            console.log(`${name} price updated to $${newPrice}`);
        });
    }

    private updateUI(): void {
        // Update money and days left
        const moneyElement = document.getElementById('money');
        const daysLeftElement = document.getElementById('days-left');
        const inventoryListElement = document.getElementById('inventory-list');

        if (moneyElement) moneyElement.textContent = `Money: $${this.money}`;
        if (daysLeftElement) daysLeftElement.textContent = `Days Left: ${this.daysLeft}`;

        // Update inventory
        if (inventoryListElement) {
            inventoryListElement.innerHTML = '';
            const inventory = this.tradingService.getInventory();
            inventory.forEach((fruit, name) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${name}: $${fruit.price} (${fruit.quantity} in stock)`;
                inventoryListElement.appendChild(listItem);
            });
        }
    }

    private displayAsciiArt(): void {
        const asciiArtElement = document.getElementById('ascii-art');
        if (!asciiArtElement) return;

        const art = `
        Days Left: ${this.daysLeft}
        Money: $${this.money}
        Inventory:
        ${Array.from(this.tradingService.getInventory().entries())
            .map(([name, fruit]) => {
                let fruitArt = '';
                switch (name.toLowerCase()) {
                    case 'apple':
                        fruitArt = `   ,--./,-.\n  / #      \\\n |          |\n  \\        / \n   `._,._,'`;
                        break;
                    case 'banana':
                        fruitArt = `   _\n  //\\\n ||  \\\n ||   `-.\n  \\\\     `-.\n   `-._     `-.\n       `-._    `-.\n           `-._.-'`;
                        break;
                    case 'orange':
                        fruitArt = `   .-\"\"\"\"-.\n  /        \\\n /          \\\n |,  .-.  .-.  ,|\n | )(_o/  \\\o_)( |\n |/     /\\     \\\|\n (_     ^^     _)\n  \\\__|IIIIII|__/\n   `--'IIIIII'--'`;
                        break;
                    default:
                        fruitArt = `${name}`;
                }
                return `${fruitArt}\n${name}: ${fruit.quantity} units`;
            })
            .join('\n')}
        `;

        asciiArtElement.textContent = art;
    }

    private showStartPage(): void {
        const startPageElement = document.getElementById('start-page');
        const gamePageElement = document.getElementById('game-page');
        const endPageElement = document.getElementById('end-page');

        if (startPageElement && gamePageElement && endPageElement) {
            startPageElement.style.display = 'block';
            gamePageElement.style.display = 'none';
            endPageElement.style.display = 'none';

            const startButton = document.getElementById('start-button');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    startPageElement.style.display = 'none';
                    gamePageElement.style.display = 'block';
                    this.start();
                });
            }
        }
    }

    private showEndPage(): void {
        const startPageElement = document.getElementById('start-page');
        const gamePageElement = document.getElementById('game-page');
        const endPageElement = document.getElementById('end-page');

        if (startPageElement && gamePageElement && endPageElement) {
            startPageElement.style.display = 'none';
            gamePageElement.style.display = 'none';
            endPageElement.style.display = 'block';

            const endMessageElement = document.getElementById('end-message');
            if (endMessageElement) {
                if (this.money > 100) {
                    endMessageElement.textContent = `Congratulations! You ended with $${this.money}. You made a profit!`;
                } else {
                    endMessageElement.textContent = `Game Over! You ended with $${this.money}. Better luck next time!`;
                }
            }
        }
    }

    public stop(): void {
        this.isRunning = false;
        this.updateUI();
        console.log(`Game stopped. You ended with $${this.money}.`);
        this.showEndPage();
    }
}

const game = new Game();
game.start();