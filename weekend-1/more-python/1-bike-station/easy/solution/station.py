from dataclasses import dataclass


@dataclass
class Bike:
    id: int
    model: str


class Station:
    """A bike-sharing station with a fixed number of docks."""

    def __init__(self, name, docks):
        self.name = name
        self.docks = docks
        self.bikes = []

    def get(self):
        """Return a copy of the bikes, so that nobody changes the station's own list."""
        return self.bikes.copy()

    def dock(self, bike):
        self.bikes.append(bike)
