"""A parking garage with a few places. When every place is taken, it refuses the next car."""


class GarageFull(Exception):
    pass


class Garage:

    def __init__(self, places):
        self.places = places
        self.cars = []

    def free_places(self):
        return self.places - len(self.cars)

    def drive_in(self, plate):
        if len(self.cars) > self.places:
            raise GarageFull("No free place for " + plate)
        self.cars.append(plate)

    def drive_out(self, plate):
        self.cars.remove(plate)
