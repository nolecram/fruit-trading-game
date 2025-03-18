export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

export function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}