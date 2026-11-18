from dataclasses import dataclass

from patterns.observer import Subject, Observer


@dataclass
class Bike:
    id: int
    model: str


class Station(Subject):
    """A bike-sharing station that tells its listeners when something changes."""

    def __init__(self, name, docks):
        super().__init__()  # starts the station's list of listeners
        self.name = name
        self.docks = docks
        self.bikes = []

    def get(self):
        """Return a copy of the bikes, so that nobody changes the station's own list."""
        return self.bikes.copy()

    def dock(self, bike):
        self.bikes.append(bike)
        self.notify()

    def undock(self, bike):
        self.bikes.remove(bike)


class Screen(Observer):
    """The station's screen: how many docks are taken."""

    def update(self, station):
        taken = len(station.get())
        print(f"{station.name}: {taken} of {station.docks} docks taken")
