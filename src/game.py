import time
from services.trading_service import TradingService

class Game:
    def __init__(self):
        self.is_running = False
        self.days_left = 30  # Game lasts 30 days
        self.money = 100.0  # Starting money
        self.trading_service = TradingService()

    def start(self):
        self.is_running = True
        print(f"Game started! You have ${self.money}.")
        self.game_loop()

    def game_loop(self):
        while self.is_running and self.days_left > 0:
            print(f"Day {31 - self.days_left}:")
            self.trigger_special_event()
            self.update_fruit_prices()
            self.display_status()
            self.display_ascii_art()
            self.days_left -= 1
            time.sleep(1)  # Simulate a delay for the next day

        print("Game over!")
        self.stop()

    def trigger_special_event(self):
        events = [
            {"description": "A storm destroyed some crops! Prices increase.", "effect": 1.5},
            {"description": "A bumper harvest! Prices decrease.", "effect": 0.5},
            {"description": "No special events today.", "effect": 1.0},
            {"description": "You won the lottery! Money increased by 15%.", "money_effect": 1.15},
            {"description": "You had to pay unexpected taxes. Money decreased by 15%.", "money_effect": 0.85},
        ]
        random_event = events[int(time.time()) % len(events)]  # Simulate randomness
        print(random_event["description"])

        if "effect" in random_event:
            for fruit in self.trading_service.get_inventory().values():
                fruit["price"] = round(fruit["price"] * random_event["effect"], 2)

        if "money_effect" in random_event:
            self.money = round(self.money * random_event["money_effect"], 2)

    def update_fruit_prices(self):
        for fruit in self.trading_service.get_inventory().values():
            fruit["price"] = round(fruit["price"] * (0.8 + (time.time() % 0.4)), 2)

    def display_status(self):
        print(f"Money: ${self.money}")
        print(f"Days Left: {self.days_left}")
        print("Inventory:")
        for name, fruit in self.trading_service.get_inventory().items():
            print(f"  {name}: ${fruit['price']} ({fruit['quantity']} in stock)")

    def display_ascii_art(self):
        art = """
        ==============================
        |         Fruit Market       |
        ==============================
        |  🍎 Apple   🍌 Banana   🍊 Orange |
        |  Trade wisely to maximize  |
        |       your profits!        |
        ==============================
        """
        print(art)

    def stop(self):
        self.is_running = False
        print(f"Game stopped. You ended with ${self.money}.")
        if self.money > 100:
            print(f"Congratulations! You made a profit of ${self.money - 100}.")
        else:
            print(f"Better luck next time! You lost ${100 - self.money}.")

if __name__ == "__main__":
    game = Game()
    game.start()