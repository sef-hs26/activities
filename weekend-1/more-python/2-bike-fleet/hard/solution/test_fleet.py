"""Tests for the coding kata. Run them with: python3 -m unittest -v"""

import unittest

import fleet


class TestStart(unittest.TestCase):
    """The starting code: these tests pass from the start."""

    def test_a_normal_bike_costs_2_francs_an_hour(self):
        self.assertEqual(fleet.Bike("Anna", 2).price(), 4)

    def test_an_ebike_costs_the_normal_price_plus_3_francs(self):
        self.assertEqual(fleet.EBike("Ben", 2).price(), 7)

    def test_a_cargo_bike_costs_5_francs_an_hour(self):
        self.assertEqual(fleet.CargoBike("Chiara", 3).price(), 15)

    def test_the_day_total_adds_up_every_kind_of_bike(self):
        rides = [fleet.Bike("Anna", 2), fleet.EBike("Ben", 2), fleet.CargoBike("Chiara", 3)]
        self.assertEqual(fleet.day_total(rides), 4 + 7 + 15)


class TestLevel1Tandem(unittest.TestCase):

    def test_a_tandem_costs_twice_the_price_of_a_normal_bike(self):
        self.assertEqual(fleet.Tandem("Dario", 2).price(), 8)

    def test_the_day_total_counts_tandems_without_any_change(self):
        rides = [fleet.Bike("Anna", 2), fleet.Tandem("Dario", 2)]
        self.assertEqual(fleet.day_total(rides), 4 + 8)


class TestLevel2LateFee(unittest.TestCase):

    def test_a_normal_bike_pays_5_francs_for_every_hour_late(self):
        self.assertEqual(fleet.Bike("Anna", 2).late_fee(3), 15)

    def test_an_ebike_pays_5_francs_for_every_hour_late(self):
        self.assertEqual(fleet.EBike("Ben", 2).late_fee(3), 15)

    def test_back_on_time_costs_nothing(self):
        self.assertEqual(fleet.Bike("Anna", 2).late_fee(0), 0)


class TestLevel3CargoLateFee(unittest.TestCase):

    def test_a_cargo_bike_pays_10_francs_for_every_hour_late(self):
        self.assertEqual(fleet.CargoBike("Chiara", 3).late_fee(2), 20)

    def test_ebikes_and_tandems_keep_5_francs_for_every_hour_late(self):
        self.assertEqual(fleet.EBike("Ben", 2).late_fee(3), 15)
        self.assertEqual(fleet.Tandem("Dario", 2).late_fee(3), 15)
