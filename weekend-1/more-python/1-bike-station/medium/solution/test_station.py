import unittest

from station import Bike, Station, StationException


class TestStation(unittest.TestCase):

    def test_finds_a_docked_bike(self):
        station = Station("Bahnhofplatz", 3)
        bike = Bike(7, "city bike")
        station.dock(bike)
        self.assertEqual(station.find_by_id(7), bike)

    def test_finds_the_second_of_three_bikes(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        cargo = Bike(12, "cargo bike")
        station.dock(cargo)
        station.dock(Bike(3, "e-bike"))
        self.assertEqual(station.find_by_id(12), cargo)

    def test_an_unknown_id_raises(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        with self.assertRaises(StationException):
            station.find_by_id(99)

    def test_a_full_station_refuses_the_next_bike(self):
        station = Station("Bahnhofplatz", 2)
        station.dock(Bike(7, "city bike"))
        station.dock(Bike(12, "cargo bike"))
        with self.assertRaises(StationException):
            station.dock(Bike(3, "e-bike"))
