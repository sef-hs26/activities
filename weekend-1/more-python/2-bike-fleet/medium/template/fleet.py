"""A bike rental: every kind of bike has its own price."""

from dataclasses import dataclass


@dataclass
class Bike:
    """A normal bike, rented by the hour: 2 francs an hour."""
    rider: str
    hours: int

    def price(self):
        return 2 * self.hours


class EBike(Bike):
    """An e-bike: the normal bike price plus 3 francs for charging."""
    # TODO: write the method price(self). Until you do, an e-bike costs what a normal bike costs.
    #       It returns the normal bike price, super().price(), plus 3 francs for charging.


class CargoBike(Bike):
    """A cargo bike: 5 francs an hour."""
    # TODO: write the method price(self).
    #       It returns 5 francs times the hours.


def day_total(rides):
    """Add up the prices of the day's rides, whatever the kind of bike."""
    total = 0
    for ride in rides:
        total = total + ride.price()
    return total
