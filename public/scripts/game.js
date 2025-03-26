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
            ['Grapes', 0],
            ['Pineapple', 0],
            ['Strawberry', 0]
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
        
        // Ensure game container is visible
        document.getElementById('game-container').style.display = 'block';
        
        // Initialize the market and update UI
        this.initializeMarket();
        this.updateUI();
        
        // Make sure the daily prompt and next day button are visible with proper styling
        const dailyPrompt = document.getElementById('daily-prompt');
        const nextDayButton = document.getElementById('next-day-button');
        
        dailyPrompt.style.display = 'block';
        dailyPrompt.style.visibility = 'visible';
        nextDayButton.style.display = 'inline-block';
        nextDayButton.style.visibility = 'visible';
        
        this.triggerSpecialEvent(); // Trigger a special event at the start of the game
        this.showDailyPrompt();
    }

    initializeMarket() {
        // Initialize with our required fruits
        this.tradingService.inventory = new Map([
            ['Apple', { price: this.getRandomPrice(3, 8), quantity: this.getRandomQuantity() }],
            ['Banana', { price: this.getRandomPrice(2, 6), quantity: this.getRandomQuantity() }],
            ['Orange', { price: this.getRandomPrice(2, 7), quantity: this.getRandomQuantity() }],
            ['Grapes', { price: this.getRandomPrice(4, 10), quantity: this.getRandomQuantity() }],
            ['Pineapple', { price: this.getRandomPrice(5, 12), quantity: this.getRandomQuantity() }],
            ['Strawberry', { price: this.getRandomPrice(3, 9), quantity: this.getRandomQuantity() }]
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
        const nextDayButton = document.getElementById('next-day-button');
        
        if (!eventDisplay.innerHTML || eventDisplay.innerHTML === 'No events yet') {
            // If there's no event yet, create a default starting event
            eventDisplay.innerHTML = `<span class="event-icon">🏁</span><span class="event-text">Day ${31 - this.daysLeft}: Begin trading!</span>`;
            eventDisplay.classList.add('event-active');
        }
        
        // Ensure the daily prompt container is fully visible with proper styling
        dailyPrompt.style.display = 'block';
        dailyPrompt.style.visibility = 'visible';
        
        // Make sure the next day button is fully visible with proper styling
        nextDayButton.style.display = 'inline-block';
        nextDayButton.style.visibility = 'visible';
        // Let the CSS control the styling instead of using inline styles
        nextDayButton.removeAttribute('style');

        // Show price trends - compact version
        this.tradingService.getInventory().forEach((fruit, name) => {
            const history = this.priceHistory.get(name) || [];
            if (history.length >= 2) {
                const trend = this.calculateTrend([history[history.length - 2], fruit.price]);
                const trendIndicator = document.createElement('span');
                trendIndicator.className = `market-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`;
                const priceElement = document.querySelector(`#market-inventory-list li[data-name="${name}"]`);
                if (priceElement) {
                    // Find if there's already a trend indicator and remove it first
                    const existingTrend = priceElement.querySelector('.market-trend');
                    if (existingTrend) existingTrend.remove();
                    
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
            let eventIcon = "🎯"; // Default icon
            
            // Determine appropriate icon based on event type
            if (event.effect) {
                if (event.effect > 1) {
                    eventIcon = "📈"; // Price increase
                } else if (event.effect < 1) {
                    eventIcon = "📉"; // Price decrease
                }
            } else if (event.moneyEffect) {
                if (event.moneyEffect > 1) {
                    eventIcon = "💰"; // Money increase
                } else if (event.moneyEffect < 1) {
                    eventIcon = "💸"; // Money decrease
                }
            }
            
            // Add economic impact information with color coding
            if (event.effect) {
                const impactPercent = (event.effect > 1) ? 
                    `+${Math.round((event.effect - 1) * 100)}%` : 
                    `-${Math.round((1 - event.effect) * 100)}%`;
                
                const impactColor = (event.effect > 1) ? 
                    `color: #e74c3c;` : // Red for price increase (bad for buying)
                    `color: #2ecc71;`; // Green for price decrease (good for buying)
                    
                eventText += ` <span style="${impactColor} font-weight: bold;">(Price Impact: ${impactPercent})</span>`;
            }
            
            if (event.moneyEffect) {
                const impactPercent = (event.moneyEffect > 1) ? 
                    `+${Math.round((event.moneyEffect - 1) * 100)}%` : 
                    `-${Math.round((1 - event.moneyEffect) * 100)}%`;
                    
                const impactColor = (event.moneyEffect > 1) ? 
                    `color: #2ecc71;` : // Green for money increase
                    `color: #e74c3c;`; // Red for money decrease
                    
                eventText += ` <span style="${impactColor} font-weight: bold;">(Money Impact: ${impactPercent})</span>`;
            }
            
            // Update the event display with new icon and styled text
            eventDisplay.innerHTML = `<span class="event-icon">${eventIcon}</span><span class="event-text">${eventText}</span>`;
            
            // Make sure it's visible with an entrance animation
            eventDisplay.style.display = 'flex';
            eventDisplay.classList.add('event-active');
            
            // Ensure the event display is visible by scrolling to it if needed
            // Only if it's not already in view
            const rect = eventDisplay.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                eventDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Add extra animation for important events (price or money changes > 20%)
            if ((event.effect && Math.abs(event.effect - 1) > 0.2) || 
                (event.moneyEffect && Math.abs(event.moneyEffect - 1) > 0.2)) {
                eventDisplay.classList.add('event-important');
                
                // Remove the important class after animation completes
                setTimeout(() => {
                    eventDisplay.classList.remove('event-important');
                }, 3000);
            }
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
        if (!fruitName || !quantity) {
            this.showTradeDialog('buy');
            return;
        }

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
        if (!fruitName || !quantity) {
            this.showTradeDialog('sell');
            return;
        }

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

    showTradeDialog(tradeType) {
        // Remove existing dialog if present
        const existingDialog = document.getElementById('trade-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create dialog overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.id = 'trade-dialog';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        dialog.style.maxWidth = '500px';
        dialog.style.width = '90%';

        // Create dialog header
        const header = document.createElement('h2');
        header.textContent = tradeType === 'buy' ? 'Buy Fruit' : 'Sell Fruit';
        header.style.color = tradeType === 'buy' ? '#3498db' : '#2ecc71';
        header.style.marginTop = '0';
        dialog.appendChild(header);

        // Create fruit selection
        const fruitLabel = document.createElement('label');
        fruitLabel.textContent = 'Select Fruit:';
        fruitLabel.style.display = 'block';
        fruitLabel.style.marginTop = '15px';
        fruitLabel.style.marginBottom = '5px';
        fruitLabel.style.fontWeight = 'bold';
        dialog.appendChild(fruitLabel);

        const fruitSelect = document.createElement('select');
        fruitSelect.id = 'fruit-select';
        fruitSelect.style.width = '100%';
        fruitSelect.style.padding = '8px';
        fruitSelect.style.borderRadius = '4px';
        fruitSelect.style.border = '1px solid #ddd';
        fruitSelect.style.marginBottom = '15px';

        // Add fruit options
        if (tradeType === 'buy') {
            this.tradingService.getInventory().forEach((fruit, name) => {
                if (fruit.quantity > 0) {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = `${name} - ${fruit.quantity} available at $${fruit.price.toFixed(2)} each`;
                    fruitSelect.appendChild(option);
                }
            });
        } else {
            // Sell: only show fruits the user has
            this.userInventory.forEach((quantity, name) => {
                if (quantity > 0) {
                    const fruit = this.tradingService.getInventory().get(name);
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = `${name} - You have ${quantity}, current price: $${fruit.price.toFixed(2)}`;
                    fruitSelect.appendChild(option);
                }
            });
        }
        dialog.appendChild(fruitSelect);

        // Create quantity input
        const quantityLabel = document.createElement('label');
        quantityLabel.textContent = 'Quantity:';
        quantityLabel.style.display = 'block';
        quantityLabel.style.marginBottom = '5px';
        quantityLabel.style.fontWeight = 'bold';
        dialog.appendChild(quantityLabel);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = 'quantity-input';
        quantityInput.min = '1';
        quantityInput.value = '1';
        quantityInput.style.width = '100%';
        quantityInput.style.padding = '8px';
        quantityInput.style.borderRadius = '4px';
        quantityInput.style.border = '1px solid #ddd';
        quantityInput.style.marginBottom = '20px';
        dialog.appendChild(quantityInput);

        // Create price preview
        const pricePreview = document.createElement('div');
        pricePreview.id = 'price-preview';
        pricePreview.style.backgroundColor = '#f8f9fa';
        pricePreview.style.padding = '10px';
        pricePreview.style.borderRadius = '4px';
        pricePreview.style.marginBottom = '20px';
        pricePreview.style.fontWeight = 'bold';
        dialog.appendChild(pricePreview);

        // Update price preview on change
        const updatePricePreview = () => {
            const selectedFruit = fruitSelect.value;
            const quantity = parseInt(quantityInput.value, 10) || 0;
            const fruit = this.tradingService.getInventory().get(selectedFruit);
            
            if (fruit && quantity > 0) {
                const totalPrice = (fruit.price * quantity).toFixed(2);
                if (tradeType === 'buy') {
                    pricePreview.textContent = `Total Cost: $${totalPrice}`;
                    pricePreview.style.color = this.money >= parseFloat(totalPrice) ? '#2ecc71' : '#e74c3c';
                } else {
                    pricePreview.textContent = `Total Revenue: $${totalPrice}`;
                    pricePreview.style.color = '#2ecc71';
                }
            } else {
                pricePreview.textContent = 'Select a fruit and enter quantity';
                pricePreview.style.color = '#7f8c8d';
            }
        };

        fruitSelect.addEventListener('change', updatePricePreview);
        quantityInput.addEventListener('input', updatePricePreview);
        updatePricePreview(); // Initial update

        // Create buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '10px';
        dialog.appendChild(buttonContainer);

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'button';
        cancelButton.style.backgroundColor = '#95a5a6';
        cancelButton.style.marginRight = '10px';
        cancelButton.style.flex = '1';
        cancelButton.onclick = () => {
            overlay.remove();
        };
        buttonContainer.appendChild(cancelButton);

        // Confirm button
        const confirmButton = document.createElement('button');
        confirmButton.textContent = tradeType === 'buy' ? 'Buy' : 'Sell';
        confirmButton.className = 'button';
        confirmButton.style.backgroundColor = tradeType === 'buy' ? '#3498db' : '#2ecc71';
        confirmButton.style.flex = '1';
        confirmButton.onclick = () => {
            const selectedFruit = fruitSelect.value;
            const quantity = parseInt(quantityInput.value, 10);
            
            if (selectedFruit && quantity > 0) {
                if (tradeType === 'buy') {
                    this.handleBuy(selectedFruit, quantity);
                } else {
                    this.handleSell(selectedFruit, quantity);
                }
            }
            
            overlay.remove();
        };
        buttonContainer.appendChild(confirmButton);

        // Add dialog to page
        document.body.appendChild(overlay);
        overlay.appendChild(dialog);

        // Focus quantity input
        quantityInput.focus();
    }

    updateUI() {
        document.getElementById('money').textContent = `Money: $${this.money.toFixed(2)}`;
        document.getElementById('days-left').textContent = `Days Left: ${this.daysLeft}`;

        // Update user inventory - more compact display
        const userInventoryList = document.getElementById('inventory-list');
        userInventoryList.innerHTML = '';
        this.userInventory.forEach((quantity, name) => {
            const fruit = this.tradingService.getInventory().get(name);
            if (fruit) {
                const listItem = document.createElement('li');
                const fruitIcon = this.getFruitIcon(name);
                // More compact layout with flexbox
                listItem.innerHTML = `<div style="display:flex;align-items:center;"><span style="margin-right:5px">${fruitIcon}</span> <span>${name}</span></div><div><span class="quantity">${quantity}</span> @ $${fruit.price.toFixed(2)}</div>`;
                listItem.setAttribute('data-name', name);
                listItem.setAttribute('data-price', fruit.price);
                userInventoryList.appendChild(listItem);
            }
        });

        // Update market inventory - more compact display
        const marketInventoryList = document.getElementById('market-inventory-list');
        marketInventoryList.innerHTML = '';
        this.tradingService.getInventory().forEach((fruit, name) => {
            const listItem = document.createElement('li');
            const fruitIcon = this.getFruitIcon(name);
            // More compact layout with flexbox
            listItem.innerHTML = `<div style="display:flex;align-items:center;"><span style="margin-right:5px">${fruitIcon}</span> <span>${name}</span></div><div><span class="quantity">${fruit.quantity}</span> @ $${fruit.price.toFixed(2)}</div>`;
            listItem.setAttribute('data-name', name);
            listItem.setAttribute('data-price', fruit.price);
            marketInventoryList.appendChild(listItem);
        });

        // Add market tips - more compact version
        const tips = this.generateMarketTip();
        const tipsContainer = document.getElementById('market-tips');
        tipsContainer.innerHTML = tips.map(tip => `<div class="tip">${tip}</div>`).join('');

        // Update price history chart
        this.updatePriceHistoryChart();
    }

    stop() {
        this.isRunning = false;
        
        // Hide game elements using display property only (not visibility)
        document.getElementById('game-container').style.display = 'none';
        
        // Hide the daily prompt but don't change visibility property
        const dailyPrompt = document.getElementById('daily-prompt');
        dailyPrompt.style.display = 'none';
        
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
        const allTips = [];
        
        // Add price trend tips
        this.tradingService.getInventory().forEach((fruit, name) => {
            const history = this.priceHistory.get(name) || [];
            if (history.length >= 3) {
                const trend = this.calculateTrend(history.slice(-3));
                if (trend > 0.1) {
                    allTips.push(`📈 ${name} prices are trending up - consider buying!`);
                } else if (trend < -0.1) {
                    allTips.push(`📉 ${name} prices are trending down - good time to sell!`);
                }
            }
            // Add historical low/high tips
            if (fruit.price <= Math.min(...history)) {
                allTips.push(`💡 ${name} is at a historical low price!`);
            } else if (fruit.price >= Math.max(...history)) {
                allTips.push(`💡 ${name} is at a historical high price!`);
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
        allTips.push(wisdom[Math.floor(Math.random() * wisdom.length)]);
        
        // Shuffle tips and limit to 3 (changed from 4)
        return this.shuffleArray(allTips).slice(0, 3);
    }
    
    // Helper method to shuffle an array
    shuffleArray(array) {
        const newArray = [...array]; // Create a copy to avoid modifying the original
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
        }
        return newArray;
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

    updatePriceHistoryChart() {
        const ctx = document.getElementById('priceHistoryChart').getContext('2d');
        
        // Get all prices history data
        const priceData = {};
        const daysToShow = 16; // Increased from 14 to 16 for wider display
        
        // Clean existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Check if dark mode is enabled - directly check the body class
        const isDarkMode = document.body.classList.contains('dark-mode');
        console.log("Chart update - Dark mode:", isDarkMode); // Debug log
        
        // Set text colors based on mode
        const textColor = isDarkMode ? '#f0f5ff' : '#1a365d';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)';
        const tooltipBackground = isDarkMode ? 'rgba(45, 52, 70, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        
        // Setup the chart data
        this.tradingService.getInventory().forEach((fruit, fruitName) => {
            if (!priceData[fruitName]) {
                priceData[fruitName] = [];
            }
            
            const history = this.priceHistory.get(fruitName) || [];
            // Convert history to chart data points
            history.forEach((price, index) => {
                priceData[fruitName].push({
                    x: index,
                    y: price
                });
            });
        });
        
        // Generate chart datasets from the price data
        const datasets = [];
        const colors = {
            'Apple': 'rgb(255, 99, 132)',
            'Banana': 'rgb(255, 205, 86)',
            'Orange': 'rgb(255, 159, 64)',
            'Grapes': 'rgb(153, 102, 255)',
            'Pineapple': 'rgb(255, 182, 0)',
            'Strawberry': 'rgb(231, 76, 60)'
        };
        
        Object.keys(priceData).forEach(fruit => {
            if (priceData[fruit].length > 0) {
                datasets.push({
                    label: fruit,
                    data: priceData[fruit],
                    borderColor: colors[fruit] || `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    pointBackgroundColor: colors[fruit] || 'rgb(54, 162, 235)',
                    tension: 0.2,
                    borderWidth: isDarkMode ? 3 : 2,
                    pointRadius: isDarkMode ? 5 : 4,
                    fill: false,
                    pointHoverRadius: isDarkMode ? 9 : 8
                });
            }
        });
        
        // Configure and create the chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000
                },
                layout: {
                    padding: {
                        top: 10,
                        right: 25,
                        bottom: 10,
                        left: 10
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Day',
                            color: textColor,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor,
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                            lineWidth: isDarkMode ? 1.5 : 1
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                weight: isDarkMode ? 'bold' : 'normal'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price ($)',
                            color: textColor,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor,
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                            lineWidth: isDarkMode ? 1.5 : 1
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                weight: isDarkMode ? 'bold' : 'normal'
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: tooltipBackground,
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        displayColors: true,
                        padding: 10,
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            color: textColor,
                            font: {
                                size: 12,
                                weight: isDarkMode ? 'bold' : 'normal'
                            },
                            boxWidth: 15,
                            padding: 15
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                elements: {
                    point: {
                        hoverRadius: 8,
                        hoverBorderWidth: 2
                    },
                    line: {
                        borderWidth: 3
                    }
                }
            }
        });
    }

    getFruitIcon(fruitName) {
        const icons = {
            'Apple': '🍎',
            'Banana': '🍌',
            'Orange': '🍊',
            'Grapes': '🍇',
            'Pineapple': '🍍',
            'Strawberry': '🍓'
        };
        return icons[fruitName] || '🍑'; // Default icon if fruit not found
    }
}

let game = new Game();

// Expose game instance globally so the theme toggle can access it
window.game = game;

document.getElementById('start-game-button').addEventListener('click', () => {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    game.start();
});

document.getElementById('next-day-button').addEventListener('click', () => {
    game.nextDay();
});

document.getElementById('buy-button').addEventListener('click', () => {
    game.showTradeDialog('buy');
});

document.getElementById('sell-button').addEventListener('click', () => {
    game.showTradeDialog('sell');
});

// Add event listeners for replay buttons
document.getElementById('replay-button-victory').addEventListener('click', resetGame);
document.getElementById('replay-button-loss').addEventListener('click', resetGame);

// Reset game function
function resetGame() {
    // Hide victory and loss pages
    document.getElementById('victory-page').style.display = 'none';
    document.getElementById('loss-page').style.display = 'none';
    
    // Show landing page
    document.getElementById('landing-page').style.display = 'block';
    
    // Reset the daily prompt and next day button styling to default values
    const dailyPrompt = document.getElementById('daily-prompt');
    const nextDayButton = document.getElementById('next-day-button');
    
    // Important: Reset display styles but don't show them yet
    dailyPrompt.style.display = 'none';
    dailyPrompt.style.visibility = 'visible'; // Ensure visibility is not hidden
    nextDayButton.style.display = 'inline-block';
    nextDayButton.style.visibility = 'visible'; // Ensure visibility is not hidden
    
    // Also make sure game container is properly reset
    document.getElementById('game-container').style.display = 'none';
    
    // Reset game instance
    game = new Game();
    
    // Expose the new game instance globally for the theme toggle to access
    window.game = game;
}

// Add additional event listener to double-check next-day button visibility
document.getElementById('start-game-button').addEventListener('click', function() {
    // Give time for the game to start and UI to initialize
    setTimeout(function() {
        const dailyPrompt = document.getElementById('daily-prompt');
        const nextDayButton = document.getElementById('next-day-button');
        
        console.log('Checking next-day button visibility');
        
        // If game is running but daily-prompt is not visible, force it to show
        if (game && game.isRunning) {
            console.log('Game is running, ensuring next-day button is visible');
            dailyPrompt.style.display = 'block';
            dailyPrompt.style.visibility = 'visible';
            nextDayButton.style.display = 'inline-block';
            nextDayButton.style.visibility = 'visible';
        }
    }, 500); // Half-second delay to ensure other handlers have run
});