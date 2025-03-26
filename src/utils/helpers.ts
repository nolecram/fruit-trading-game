/**
 * Formats a number as a currency string (USD format)
 * @param amount - The amount to format
 * @returns The formatted currency string
 */
export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

/**
 * Calculates the total price for a quantity of items
 * @param price - The unit price
 * @param quantity - The quantity of items
 * @returns The total price
 */
export function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}