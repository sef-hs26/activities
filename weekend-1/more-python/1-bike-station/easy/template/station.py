from dataclasses import dataclass


@dataclass
class Bike:
    # TODO: give a bike two fields: id, a whole number (int), and model, a text (str).
    pass


class Station:
    """A bike-sharing station with a fixed number of docks."""

    def __init__(self, name, docks):
        # TODO: keep the name and the number of docks, and start with an empty list of bikes:
        #       self.name, self.docks and self.bikes.
        pass

    # TODO: write the method get(self). It returns a copy of the bikes, self.bikes.copy(),
    #       so that nobody changes the station's own list.

    # TODO: write the method dock(self, bike). It appends the bike to self.bikes.
