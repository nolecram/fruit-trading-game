export interface Fruit {
    name: string;
    price: number;
    quantity: number;
}

export interface Trade {
    fruit: Fruit;
    quantity: number;
    totalPrice: number;
}