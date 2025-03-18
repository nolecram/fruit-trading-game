class Fruit:
    def __init__(self, name: str, price: float, quantity: int):
        self.name = name
        self.price = price
        self.quantity = quantity

    def get_name(self) -> str:
        return self.name

    def set_name(self, name: str):
        self.name = name

    def get_price(self) -> float:
        return self.price

    def set_price(self, price: float):
        self.price = price

    def get_quantity(self) -> int:
        return self.quantity

    def set_quantity(self, quantity: int):
        self.quantity = quantity