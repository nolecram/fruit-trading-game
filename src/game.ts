// This file is the entry point of the game. It initializes the game logic and manages the game loop.
import { Fruit as FruitModel } from './models/fruit';
import { TradingService } from './services/tradingService';
import { Fruit, Trade, Achievement } from './types';
import { formatCurrency, calculateTotal } from './utils/helpers';

interface SpecialEvent {
    description: string;
    effect?: number;
    moneyEffect?: number;
}

class Game {
    private isRunning: boolean;
    private daysLeft: number;
    private money: number;
    private tradingService: TradingService;
    private userInventory: Map<string, number>;
    private priceHistory: Map<string, number[]>;
    private achievements: Record<string, Achievement>;
    private positiveEventStreak: number;

    constructor() {
        this.isRunning = false;
        this.daysLeft = 30; // Game lasts 30 days
        this.money = 100; // Starting money
        this.tradingService = new TradingService();
        this.userInventory = new Map([
            ['apple', 0],
            ['banana', 0],
            ['orange', 0]
        ]);
        this.priceHistory = new Map();
        this.achievements = {
            fruitBaron: { name: "Fruit Baron", description: "Own 50 of any fruit at once", earned: false },
            profitMaster: { name: "Profit Master", description: "Make $100 profit in a single trade", earned: false },
            diversePortfolio: { name: "Diverse Portfolio", description: "Own all types of fruits", earned: false },
            luckyStreak: { name: "Lucky Streak", description: "Get 3 positive events in a row", earned: false },
            marketSurvivor: { name: "Market Survivor", description: "Recover from having less than $50", earned: false }
        };
        this.positiveEventStreak = 0;
        
        this.initializePriceHistory();
    }

    private initializePriceHistory(): void {
        this.tradingService.getInventory().forEach((_, fruit) => {
            this.priceHistory.set(fruit, []);
        });
    }

    public start(): void {
        this.isRunning = true;
        this.updateUI();
        console.log(`Game started! You have ${formatCurrency(this.money)}.`);
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

        // Simulate a day passing
        this.daysLeft--;

        // Continue to the next day
        setTimeout(() => this.gameLoop(), 1000); // Simulate a delay for the next day
    }

    private triggerSpecialEvent(): void {
        const events: SpecialEvent[] = [
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
                fruit.price = parseFloat((fruit.price * randomEvent.effect!).toFixed(2));
            });
        }

        if (randomEvent.moneyEffect !== undefined) {
            this.money = parseFloat((this.money * randomEvent.moneyEffect).toFixed(2));
        }
    }

    private updateFruitPrices(): void {
        const inventory = this.tradingService.getInventory();
        inventory.forEach((fruit, name) => {
            const currentPrice = fruit.price;
            const newPrice = parseFloat((currentPrice * (0.8 + Math.random() * 0.4)).toFixed(2)); // Price varies by ±20%
            fruit.price = newPrice;
            
            // Update price history
            const history = this.priceHistory.get(name);
            if (history) {
                history.push(currentPrice);
                // Keep history limited to a reasonable size
                if (history.length > 10) {
                    history.shift();
                }
            }
            
            console.log(`${name} price updated to $${newPrice}`);
        });
    }

    private updateUI(): void {
        // Update money and days left
        const moneyElement = document.getElementById('money');
        const daysLeftElement = document.getElementById('days-left');
        const inventoryListElement = document.getElementById('inventory-list');

        if (moneyElement) moneyElement.textContent = `Money: ${formatCurrency(this.money)}`;
        if (daysLeftElement) daysLeftElement.textContent = `Days Left: ${this.daysLeft}`;

        // Update inventory
        if (inventoryListElement) {
            inventoryListElement.innerHTML = '';
            this.updateMarketInventoryUI(inventoryListElement);
            this.updateUserInventoryUI();
        }
        
        // Check achievements after updating UI
        this.checkAchievements();
    }
    
    private updateMarketInventoryUI(inventoryListElement: HTMLElement): void {
        // Display market inventory
        const marketInventory = this.tradingService.getInventory();
        marketInventory.forEach((fruit, name) => {
            const listItem = document.createElement('li');
            const formattedPrice = formatCurrency(fruit.price);
            listItem.textContent = `${name}: ${formattedPrice} (${fruit.quantity} in stock)`;
            
            // Add price trend indicators
            const history = this.priceHistory.get(name);
            if (history && history.length >= 2) {
                const trend = history[history.length - 1] > history[history.length - 2] ? 'trend-up' : 'trend-down';
                const trendIndicator = document.createElement('span');
                trendIndicator.className = `market-trend ${trend}`;
                listItem.appendChild(trendIndicator);
            }
            
            inventoryListElement.appendChild(listItem);
        });
    }
    
    private updateUserInventoryUI(): void {
        // Display user inventory
        const userInventoryElement = document.getElementById('user-inventory');
        if (userInventoryElement) {
            userInventoryElement.innerHTML = '';
            this.userInventory.forEach((quantity, name) => {
                if (quantity > 0) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${name}: ${quantity}`;
                    userInventoryElement.appendChild(listItem);
                }
            });
        }
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
                    endMessageElement.textContent = `Congratulations! You ended with ${formatCurrency(this.money)}. You made a profit!`;
                } else {
                    endMessageElement.textContent = `Game Over! You ended with ${formatCurrency(this.money)}. Better luck next time!`;
                }
            }
        }
    }

    public stop(): void {
        this.isRunning = false;
        this.updateUI();
        console.log(`Game stopped. You ended with ${formatCurrency(this.money)}.`);
        this.showEndPage();
    }
    
    private checkAchievements(): void {
        // Fruit Baron: Own 50 of any fruit at once
        this.checkFruitBaronAchievement();
        
        // Diverse Portfolio: Own all types of fruits
        this.checkDiversePortfolioAchievement();
        
        // Market Survivor: Recover from having less than $50
        this.checkMarketSurvivorAchievement();
    }
    
    private checkFruitBaronAchievement(): void {
        let hasFiftyOfAnyFruit = false;
        this.userInventory.forEach(quantity => {
            if (quantity >= 50) hasFiftyOfAnyFruit = true;
        });
        
        if (hasFiftyOfAnyFruit && !this.achievements.fruitBaron.earned) {
            this.unlockAchievement('fruitBaron');
        }
    }
    
    private checkDiversePortfolioAchievement(): void {
        let hasAllFruits = true;
        this.userInventory.forEach(quantity => {
            if (quantity <= 0) hasAllFruits = false;
        });
        
        if (hasAllFruits && !this.achievements.diversePortfolio.earned) {
            this.unlockAchievement('diversePortfolio');
        }
    }
    
    private checkMarketSurvivorAchievement(): void {
        if (this.money < 50) {
            localStorage.setItem('needsRecovery', 'true');
        } else if (localStorage.getItem('needsRecovery') === 'true' && this.money >= 100 && !this.achievements.marketSurvivor.earned) {
            this.unlockAchievement('marketSurvivor');
            localStorage.removeItem('needsRecovery');
        }
    }
    
    private unlockAchievement(achievementId: string): void {
        const achievement = this.achievements[achievementId];
        if (!achievement) {
            console.error(`Achievement ${achievementId} does not exist`);
            return;
        }
        
        if (!achievement.earned) {
            achievement.earned = true;
            this.showAchievementPopup(achievementId);
        }
    }
    
    private showAchievementPopup(achievementId: string): void {
        // Create achievement popup elements
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        
        const title = document.createElement('h3');
        title.textContent = 'Achievement Unlocked!';
        
        const description = document.createElement('p');
        description.textContent = this.achievements[achievementId].name + ': ' + 
            this.achievements[achievementId].description;
        
        // Append elements
        popup.appendChild(title);
        popup.appendChild(description);
        document.body.appendChild(popup);
        
        // Remove popup after 5 seconds
        setTimeout(() => {
            popup.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => document.body.removeChild(popup), 1000);
        }, 5000);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Add event listener to start button
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            game.start();
        });
    }
});