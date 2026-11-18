# Changes 1 and 4 break the app: they change a method that the app calls.
# Changes 2 and 3 keep it working: the app never uses the list, and a new method takes nothing away.

from dataclasses import dataclass


@dataclass
class Bike:
    id: int
    model: str


class Station:
    """A bike-sharing station. Your team's code."""

    def __init__(self, name):
        self.name = name
        self.parked = []

    def dock(self, bike):
        self.parked.append(bike)

    def count(self):
        """Return how many bikes are docked."""
        return len(self.parked)

    def is_empty(self):
        """Return True when no bike is docked."""
        return len(self.parked) == 0
