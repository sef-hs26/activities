from dataclasses import dataclass


# The station's own kind of error, as RentalException is the car rental's.
class StationException(Exception):
    pass


@dataclass
class Bike:
    id: int
    model: str
    # Level 3
    rides: int = 0


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
        # Level 2
        for docked in self.bikes:
            if docked.id == bike.id:
                raise StationException(f"Bike {bike.id} is already at {self.name}.")
        if len(self.bikes) == self.docks:
            raise StationException("The station is full.")
        self.bikes.append(bike)

    def find_by_id(self, id):
        for bike in self.bikes:
            if bike.id == id:
                return bike
        raise StationException(f"Bike {id} is not at {self.name}.")

    # Level 1
    def contains(self, model):
        for bike in self.bikes:
            if bike.model == model:
                return True
        return False

    # Level 3
    def undock(self, id):
        bike = self.find_by_id(id)
        self.bikes.remove(bike)
        bike.rides = bike.rides + 1
        return bike
