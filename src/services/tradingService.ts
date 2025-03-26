import { Fruit } from '../types';

export class TradingService {
    private inventory: Map<string, { price: number; quantity: number }> = new Map();

    constructor() {
        // Initialize inventory with some fruits
        this.initializeInventory();
    }

    private initializeInventory(): void {
        this.inventory.set('apple', { price: 1, quantity: 100 });
        this.inventory.set('banana', { price: 0.5, quantity: 150 });
        this.inventory.set('orange', { price: 0.75, quantity: 120 });
    }

    public buyFruit(fruitName: string, quantity: number): string {
        const fruit = this.inventory.get(fruitName);
        if (!fruit) {
            return `Fruit ${fruitName} does not exist.`;
        }
        if (fruit.quantity < quantity) {
            return `Not enough ${fruitName} in stock. Available: ${fruit.quantity}`;
        }
        fruit.quantity -= quantity;
        return `Bought ${quantity} ${fruitName}(s). Remaining stock: ${fruit.quantity}`;
    }

    public sellFruit(fruitName: string, quantity: number): string {
        const fruit = this.inventory.get(fruitName);
        if (!fruit) {
            return `Fruit ${fruitName} does not exist.`;
        }
        fruit.quantity += quantity;
        return `Sold ${quantity} ${fruitName}(s). New stock: ${fruit.quantity}`;
    }

    public getInventory(): Map<string, { price: number; quantity: number }> {
        return this.inventory;
    }
}