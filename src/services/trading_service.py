class TradingService:
    def __init__(self):
        # Initialize inventory with some fruits
        self.inventory = {
            'apple': {'price': 1.0, 'quantity': 100},
            'banana': {'price': 0.5, 'quantity': 150},
            'orange': {'price': 0.75, 'quantity': 120}
        }

    def buy_fruit(self, fruit_name: str, quantity: int) -> str:
        fruit = self.inventory.get(fruit_name)
        if not fruit:
            return f"Fruit {fruit_name} does not exist."
        if fruit['quantity'] < quantity:
            return f"Not enough {fruit_name} in stock. Available: {fruit['quantity']}"
        fruit['quantity'] -= quantity
        return f"Bought {quantity} {fruit_name}(s). Remaining stock: {fruit['quantity']}"

    def sell_fruit(self, fruit_name: str, quantity: int) -> str:
        fruit = self.inventory.get(fruit_name)
        if not fruit:
            return f"Fruit {fruit_name} does not exist."
        fruit['quantity'] += quantity
        return f"Sold {quantity} {fruit_name}(s). New stock: {fruit['quantity']}"

    def get_inventory(self) -> dict:
        return self.inventory