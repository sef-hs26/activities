"""Tests for the class skeleton. Run them with: python3 -m unittest -v"""

import unittest

from station import Bike, Station


class TestSkeleton(unittest.TestCase):

    def test_a_bike_has_an_id_and_a_model(self):
        bike = Bike(7, "city bike")
        self.assertEqual(bike.id, 7)
        self.assertEqual(bike.model, "city bike")

    def test_a_station_keeps_its_name_and_docks(self):
        station = Station("Bahnhofplatz", 3)
        self.assertEqual(station.name, "Bahnhofplatz")
        self.assertEqual(station.docks, 3)

    def test_a_new_station_has_no_bikes(self):
        station = Station("Bahnhofplatz", 3)
        self.assertEqual(station.get(), [])

    def test_docked_bikes_are_at_the_station(self):
        station = Station("Bahnhofplatz", 3)
        city = Bike(7, "city bike")
        cargo = Bike(12, "cargo bike")
        station.dock(city)
        station.dock(cargo)
        self.assertEqual(station.get(), [city, cargo])

    def test_get_hands_out_a_copy(self):
        station = Station("Bahnhofplatz", 3)
        station.get().append(Bike(7, "city bike"))
        self.assertEqual(station.get(), [])
