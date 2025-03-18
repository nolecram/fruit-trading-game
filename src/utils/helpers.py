def format_currency(amount: float) -> str:
    return f"${amount:.2f}"

def calculate_total(price: float, quantity: int) -> float:
    return price * quantity