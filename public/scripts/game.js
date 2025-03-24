class TradingService {
    constructor() {
        this.inventory = new Map([
            ['Apple', { price: 1.0, quantity: 10 }],
            ['Banana', { price: 1.2, quantity: 8 }],
            ['Orange', { price: 0.8, quantity: 15 }],
        ]);
    }

    getInventory() {
        return this.inventory;
    }

    buyFruit(name, quantity) {
        const fruit = this.inventory.get(name);
        if (fruit && fruit.quantity >= quantity) {
            fruit.quantity -= quantity;
            return true;
        }
        return false;
    }

    sellFruit(name, quantity) {
        const fruit = this.inventory.get(name);
        if (fruit) {
            fruit.quantity += quantity;
            return true;
        }
        return false;
    }
}

class Game {
    constructor() {
        this.isRunning = false;
        this.daysLeft = 30;
        this.money = 100;
        this.tradingService = new TradingService();
        this.userInventory = new Map([
            ['Apple', 0],
            ['Banana', 0],
            ['Orange', 0],
            ['Grapes', 0]
        ]);
        this.events = [
            { description: "A storm destroyed some crops! Prices increase.", effect: 1.5 },
            { description: "A bumper harvest! Prices decrease.", effect: 0.5 },
            { description: "No special events today.", effect: 1.0 },
            { description: "You won the lottery! Money increased by 15%.", moneyEffect: 1.15 },
            { description: "You had to pay unexpected taxes. Money decreased by 15%.", moneyEffect: 0.85 }
        ];
        this.achievements = {
            fruitBaron: { name: "Fruit Baron", description: "Own 50 of any fruit at once", earned: false },
            profitMaster: { name: "Profit Master", description: "Make $100 profit in a single trade", earned: false },
            diversePortfolio: { name: "Diverse Portfolio", description: "Own all types of fruits", earned: false },
            luckyStreak: { name: "Lucky Streak", description: "Get 3 positive events in a row", earned: false },
            marketCrash: { name: "Market Survivor", description: "Recover from having less than $50", earned: false }
        };
        this.positiveEventStreak = 0;
        this.priceHistory = new Map();
        this.tradingService.getInventory().forEach((_, fruit) => {
            this.priceHistory.set(fruit, []);
        });
    }

    start() {
        this.isRunning = true;
        this.initializeMarket();
        this.updateUI();
        this.triggerSpecialEvent(); // Trigger a special event at the start of the game
        this.showDailyPrompt();
    }

    initializeMarket() {
        // Initialize with our required fruits
        this.tradingService.inventory = new Map([
            ['Apple', { price: this.getRandomPrice(3, 8), quantity: this.getRandomQuantity() }],
            ['Banana', { price: this.getRandomPrice(2, 6), quantity: this.getRandomQuantity() }],
            ['Orange', { price: this.getRandomPrice(2, 7), quantity: this.getRandomQuantity() }],
            ['Grapes', { price: this.getRandomPrice(4, 10), quantity: this.getRandomQuantity() }]
        ]);
    }

    getRandomPrice(min, max) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }

    getRandomQuantity() {
        return Math.floor(Math.random() * 10) + 1; // 1-10 quantity
    }

    showDailyPrompt() {
        const dailyPrompt = document.getElementById('daily-prompt');
        const eventDisplay = document.getElementById('event-display');
        
        if (!eventDisplay) {
            // Create event display if it doesn't exist
            const newEventDisplay = document.createElement('div');
            newEventDisplay.id = 'event-display';
            newEventDisplay.style.marginBottom = '15px';
            newEventDisplay.style.padding = '10px';
            newEventDisplay.style.backgroundColor = '#f8f9fa';
            newEventDisplay.style.border = '1px solid #dee2e6';
            newEventDisplay.style.borderRadius = '5px';
            dailyPrompt.parentNode.insertBefore(newEventDisplay, dailyPrompt);
        }
        
        dailyPrompt.style.display = 'block';
        document.getElementById('next-day-button').style.display = 'inline-block';

        // Show price trends
        this.tradingService.getInventory().forEach((fruit, name) => {
            const history = this.priceHistory.get(name) || [];
            if (history.length >= 2) {
                const trend = this.calculateTrend([history[history.length - 2], fruit.price]);
                const trendIndicator = document.createElement('span');
                trendIndicator.className = `market-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`;
                const priceElement = document.querySelector(`#market-inventory-list li[data-name="${name}"]`);
                if (priceElement) {
                    priceElement.appendChild(trendIndicator);
                }
            }
        });
    }

    nextDay() {
        if (this.daysLeft <= 0) {
            this.stop();
            return;
        }

        this.daysLeft--;
        this.triggerSpecialEvent();
        this.updateMarketInventory();
        this.updateUI();
    }

    triggerSpecialEvent() {
        // Get a random event
        const event = this.events[Math.floor(Math.random() * this.events.length)];
        const eventDisplay = document.getElementById('event-display');
        
        if (eventDisplay) {
            let eventText = event.description;
            
            // Add economic impact information
            if (event.effect) {
                const impactPercent = (event.effect > 1) ? 
                    `+${Math.round((event.effect - 1) * 100)}%` : 
                    `-${Math.round((1 - event.effect) * 100)}%`;
                eventText += ` (Price Impact: ${impactPercent})`;
            }
            
            if (event.moneyEffect) {
                const impactPercent = (event.moneyEffect > 1) ? 
                    `+${Math.round((event.moneyEffect - 1) * 100)}%` : 
                    `-${Math.round((1 - event.moneyEffect) * 100)}%`;
                eventText += ` (Money Impact: ${impactPercent})`;
            }
            
            eventDisplay.textContent = eventText;
            eventDisplay.style.display = 'block';
        }

        // Apply event effects
        if (event.effect) {
            this.tradingService.inventory.forEach((fruit) => {
                fruit.price = parseFloat((fruit.price * event.effect).toFixed(2));
            });
        }

        if (event.moneyEffect) {
            this.money = parseFloat((this.money * event.moneyEffect).toFixed(2));
        }

        if (event.effect > 1 || event.moneyEffect > 1) {
            this.positiveEventStreak++;
            if (this.positiveEventStreak >= 3 && !this.achievements.luckyStreak.earned) {
                this.unlockAchievement('luckyStreak');
            }
        } else {
            this.positiveEventStreak = 0;
        }
    }

    updateMarketInventory() {
        // Update quantities and prices for all fruits
        this.tradingService.inventory.forEach((fruit, name) => {
            // Update price (±20%)
            fruit.price = parseFloat((fruit.price * (0.8 + Math.random() * 0.4)).toFixed(2));
            
            // Update quantity
            const randomChange = Math.random() > 0.5 ? 1 : -1;
            const randomQuantity = Math.floor(Math.random() * 5) + 1;
            fruit.quantity += randomChange * randomQuantity;
            if (fruit.quantity < 0) fruit.quantity = 0;
        });

        // Update price history
        this.tradingService.getInventory().forEach((fruit, name) => {
            const history = this.priceHistory.get(name) || [];
            history.push(fruit.price);
            if (history.length > 10) history.shift(); // Keep last 10 days
            this.priceHistory.set(name, history);
        });
    }

    handleBuy(fruitName, quantity) {
        const fruit = this.tradingService.getInventory().get(fruitName);

        if (!fruit) {
            alert(`${fruitName} is not available in the market!`);
            return;
        }

        if (quantity <= 0) {
            alert('Please enter a valid quantity!');
            return;
        }

        if (fruit.quantity < quantity) {
            alert(`Not enough ${fruitName} in stock. Available: ${fruit.quantity}`);
            return;
        }

        const cost = fruit.price * quantity;
        if (this.money < cost) {
            alert(`Not enough money to buy ${quantity} ${fruitName}(s). Needed: $${cost.toFixed(2)}, Available: $${this.money.toFixed(2)}`);
            return;
        }

        // Perform the transaction
        this.money = parseFloat((this.money - cost).toFixed(2));
        fruit.quantity -= quantity;
        const currentQuantity = this.userInventory.get(fruitName) || 0;
        this.userInventory.set(fruitName, currentQuantity + quantity);
        
        // Check for Profit Master achievement
        const profit = fruit.price * quantity;
        if (profit >= 100 && !this.achievements.profitMaster.earned) {
            this.unlockAchievement('profitMaster');
        }
        this.checkAchievements();
        this.updateUI();
    }

    handleSell(fruitName, quantity) {
        const currentQuantity = this.userInventory.get(fruitName) || 0;
        const fruit = this.tradingService.getInventory().get(fruitName);

        if (!fruit) {
            alert(`${fruitName} is not recognized in the market!`);
            return;
        }

        if (quantity <= 0) {
            alert('Please enter a valid quantity!');
            return;
        }

        if (currentQuantity < quantity) {
            alert(`Not enough ${fruitName} in your inventory. Available: ${currentQuantity}`);
            return;
        }

        // Perform the transaction
        const revenue = fruit.price * quantity;
        this.money = parseFloat((this.money + revenue).toFixed(2));
        fruit.quantity += quantity;
        this.userInventory.set(fruitName, currentQuantity - quantity);
        
        this.updateUI();
    }

    updateUI() {
        document.getElementById('money').textContent = `Money: $${this.money.toFixed(2)}`;
        document.getElementById('days-left').textContent = `Days Left: ${this.daysLeft}`;

        // Update user inventory
        const userInventoryList = document.getElementById('inventory-list');
        userInventoryList.innerHTML = '';
        this.userInventory.forEach((quantity, name) => {
            const fruit = this.tradingService.getInventory().get(name);
            if (fruit) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${name} - Quantity: <span class="quantity">${quantity}</span> - Price: $${fruit.price.toFixed(2)}`;
                listItem.setAttribute('data-price', fruit.price);
                userInventoryList.appendChild(listItem);
            }
        });

        // Update market inventory
        const marketInventoryList = document.getElementById('market-inventory-list');
        marketInventoryList.innerHTML = '';
        this.tradingService.getInventory().forEach((fruit, name) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${name} - Quantity: <span class="quantity">${fruit.quantity}</span> - Price: $${fruit.price.toFixed(2)}`;
            listItem.setAttribute('data-price', fruit.price);
            marketInventoryList.appendChild(listItem);
        });

        // Add market tips
        const tips = this.generateMarketTip();
        const tipsContainer = document.getElementById('market-tips') || this.createTipsContainer();
        tipsContainer.innerHTML = '<h3>Market Tips</h3>' + 
            tips.map(tip => `<div class="tip">${tip}</div>`).join('');
    }

    stop() {
        this.isRunning = false;
        
        // Hide game elements
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('daily-prompt').style.display = 'none';
        
        // Determine if player won or lost
        if (this.money > 100) {
            // Show victory page
            const victoryPage = document.getElementById('victory-page');
            const victoryMoney = document.getElementById('victory-money');
            
            victoryMoney.textContent = `You ended with $${this.money.toFixed(2)}, making a profit of $${(this.money - 100).toFixed(2)}!`;
            victoryPage.style.display = 'block';
        } else {
            // Show loss page
            const lossPage = document.getElementById('loss-page');
            const lossMoney = document.getElementById('loss-money');
            
            lossMoney.textContent = `You ended with $${this.money.toFixed(2)}, losing $${(100 - this.money).toFixed(2)}.`;
            lossPage.style.display = 'block';
        }
    }

    checkAchievements() {
        // Check Fruit Baron
        this.userInventory.forEach((quantity, fruit) => {
            if (quantity >= 50 && !this.achievements.fruitBaron.earned) {
                this.unlockAchievement('fruitBaron');
            }
        });

        // Check Diverse Portfolio
        let hasAllFruits = true;
        this.userInventory.forEach((quantity) => {
            if (quantity === 0) hasAllFruits = false;
        });
        if (hasAllFruits && !this.achievements.diversePortfolio.earned) {
            this.unlockAchievement('diversePortfolio');
        }

        // Check Market Survivor
        if (this.money < 50 && !this.achievements.marketCrash.earned) {
            this.unlockAchievement('marketCrash');
        }
    }

    unlockAchievement(achievementId) {
        if (!this.achievements[achievementId].earned) {
            this.achievements[achievementId].earned = true;
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-popup';
            achievementElement.innerHTML = `
                🏆 Achievement Unlocked!
                <strong>${this.achievements[achievementId].name}</strong>
                ${this.achievements[achievementId].description}
            `;
            document.body.appendChild(achievementElement);
            setTimeout(() => achievementElement.remove(), 5000);
        }
    }

    generateMarketTip() {
        const tips = [];
        this.tradingService.getInventory().forEach((fruit, name) => {
            const history = this.priceHistory.get(name) || [];
            if (history.length >= 3) {
                const trend = this.calculateTrend(history.slice(-3));
                if (trend > 0.1) {
                    tips.push(`📈 ${name} prices are trending up - consider buying!`);
                } else if (trend < -0.1) {
                    tips.push(`📉 ${name} prices are trending down - good time to sell!`);
                }
            }
            // Add historical low/high tips
            if (fruit.price <= Math.min(...history)) {
                tips.push(`💡 ${name} is at a historical low price!`);
            } else if (fruit.price >= Math.max(...history)) {
                tips.push(`💡 ${name} is at a historical high price!`);
            }
        });

        // Add random market wisdom
        const wisdom = [
            "🌟 Diversifying your inventory can help manage risk!",
            "💼 Buy low, sell high is the golden rule!",
            "⏰ Remember to watch for special events that affect prices!",
            "🎯 Set profit goals for each trade!",
            "🔄 Don't be afraid to hold onto inventory for better prices!"
        ];
        tips.push(wisdom[Math.floor(Math.random() * wisdom.length)]);
        
        return tips;
    }

    calculateTrend(prices) {
        if (prices.length < 2) return 0;
        const first = prices[0];
        const last = prices[prices.length - 1];
        return (last - first) / first;
    }

    createTipsContainer() {
        const container = document.createElement('div');
        container.id = 'market-tips';
        container.className = 'market-tips';
        document.getElementById('game-container').appendChild(container);
        return container;
    }
}

let game = new Game();

document.getElementById('start-game-button').addEventListener('click', () => {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    game.start();
});

document.getElementById('next-day-button').addEventListener('click', () => {
    game.nextDay();
});

document.getElementById('buy-button').addEventListener('click', () => {
    const fruitName = prompt('Enter the fruit name to buy:');
    const quantity = parseInt(prompt('Enter the quantity to buy:'), 10);
    game.handleBuy(fruitName, quantity);
});

document.getElementById('sell-button').addEventListener('click', () => {
    const fruitName = prompt('Enter the fruit name to sell:');
    const quantity = parseInt(prompt('Enter the quantity to sell:'), 10);
    game.handleSell(fruitName, quantity);
});

// Add event listeners for replay buttons
document.getElementById('replay-button-victory').addEventListener('click', resetGame);
document.getElementById('replay-button-loss').addEventListener('click', resetGame);

function resetGame() {
    // Hide victory and loss pages
    document.getElementById('victory-page').style.display = 'none';
    document.getElementById('loss-page').style.display = 'none';
    
    // Show landing page
    document.getElementById('landing-page').style.display = 'block';
    
    // Reset game instance
    game = new Game();
}