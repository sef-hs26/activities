"""A bike rental: every kind of bike has its own price."""

from dataclasses import dataclass


@dataclass
class Bike:
    """A normal bike, rented by the hour: 2 francs an hour."""
    # TODO: give a bike two fields: rider, a text (str), and hours, a whole number (int).

    # TODO: write the method price(self). It returns 2 francs times the hours.


def day_total(rides):
    """Add up the prices of the day's rides, whatever the kind of bike."""
    # TODO: start with a total of 0, add the price of every ride to it, and return the total.
    pass
