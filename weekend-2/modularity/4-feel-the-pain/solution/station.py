from dataclasses import dataclass


@dataclass
class Bike:
    id: int
    model: str


class Station:
    """A bike-sharing station that does every job by itself."""

    def __init__(self, name, docks):
        self.name = name
        self.docks = docks
        self.bikes = []

    def dock(self, bike):
        self.bikes.append(bike)
        # The screen
        print(f"{self.name}: {len(self.bikes)} of {self.docks} docks taken")
        # The truck
        if len(self.bikes) == self.docks:
            print(f"Truck: {self.name} is full, please collect bikes.")
        # The bike club
        if bike.model == "cargo bike":
            print(f"Bike club: a cargo bike is at {self.name}.")
