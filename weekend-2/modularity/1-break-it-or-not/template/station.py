from dataclasses import dataclass


@dataclass
class Bike:
    id: int
    model: str


class Station:
    """A bike-sharing station. Your team's code."""

    def __init__(self, name):
        self.name = name
        self.bikes = []

    def dock(self, bike):
        self.bikes.append(bike)

    def count(self):
        """Return how many bikes are docked."""
        return len(self.bikes)
