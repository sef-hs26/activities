"""Tests for the class skeleton. Run them with: python3 -m unittest -v"""

import unittest

from fleet import Bike, day_total


class TestSkeleton(unittest.TestCase):

    def test_a_ride_has_a_rider_and_hours(self):
        ride = Bike("Anna", 2)
        self.assertEqual(ride.rider, "Anna")
        self.assertEqual(ride.hours, 2)

    def test_a_bike_costs_2_francs_an_hour(self):
        self.assertEqual(Bike("Anna", 2).price(), 4)
        self.assertEqual(Bike("Ben", 4).price(), 8)

    def test_the_day_total_adds_up_every_ride(self):
        rides = [Bike("Anna", 2), Bike("Ben", 4), Bike("Chiara", 3)]
        self.assertEqual(day_total(rides), 4 + 8 + 6)

    def test_a_day_without_rides_totals_0(self):
        self.assertEqual(day_total([]), 0)
