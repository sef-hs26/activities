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
        # TODO 1: tell everyone who listens: self.notify()

    def undock(self, bike):
        self.bikes.remove(bike)


# TODO 2: write a listener called Screen:
#             class Screen(Observer):
#         Its method update(self, station) prints how many docks are taken,
#         for example "Bahnhofplatz: 1 of 2 docks taken".
#         len(station.get()) is the number of bikes docked, station.docks the number of docks.
