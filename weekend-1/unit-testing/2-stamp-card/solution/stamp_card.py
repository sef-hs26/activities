"""A cafe's stamp card: a coffee costs 5 francs, and every 4th coffee is free."""


class StampCard:

    def __init__(self):
        self.stamps = 0

    def buy_coffee(self):
        """Give one stamp and return the price of this coffee, in francs."""
        self.stamps = self.stamps + 1
        if self.stamps == 4:
            self.stamps = 0
            return 0
        return 5

    def message(self):
        return "You have " + str(self.stamps) + " stamps."
