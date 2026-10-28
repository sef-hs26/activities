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
    def price(self):
        return super().price() + 3


class CargoBike(Bike):
    """A cargo bike: 5 francs an hour."""
    def price(self):
        return 5 * self.hours


def day_total(rides):
    """Add up the prices of the day's rides, whatever the kind of bike."""
    total = 0
    for ride in rides:
        total = total + ride.price()
    return total
