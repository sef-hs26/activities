"""Tests for the toy kata. Run them with: python3 -m unittest -v"""

import unittest

from fleet import Bike, CargoBike, EBike, day_total


class TestToyKata(unittest.TestCase):

    def test_a_normal_bike_costs_2_francs_an_hour(self):
        self.assertEqual(Bike("Anna", 2).price(), 4)

    def test_an_ebike_costs_the_normal_price_plus_3_francs(self):
        self.assertEqual(EBike("Ben", 2).price(), 7)

    def test_a_cargo_bike_costs_5_francs_an_hour(self):
        self.assertEqual(CargoBike("Chiara", 3).price(), 15)

    def test_the_day_total_adds_up_every_kind_of_bike(self):
        rides = [Bike("Anna", 2), EBike("Ben", 2), CargoBike("Chiara", 3)]
        self.assertEqual(day_total(rides), 4 + 7 + 15)
