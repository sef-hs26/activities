from dataclasses import dataclass


# The station's own kind of error, as RentalException is the car rental's.
class StationException(Exception):
    pass


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
        if len(self.bikes) == self.docks:
            raise StationException("The station is full.")
        self.bikes.append(bike)

    def find_by_id(self, id):
        for bike in self.bikes:
            if bike.id == id:
                return bike
        raise StationException(f"Bike {id} is not at {self.name}.")
