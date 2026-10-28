import unittest

from station import Bike, Station, StationException


class TestStart(unittest.TestCase):

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


class TestLevel1Contains(unittest.TestCase):

    def test_finds_a_model_that_is_not_first(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        station.dock(Bike(12, "cargo bike"))
        self.assertTrue(station.contains("cargo bike"))

    def test_a_missing_model_gives_false(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        self.assertFalse(station.contains("e-bike"))


class TestLevel2NoBikeTwice(unittest.TestCase):

    def test_the_same_bike_again_raises(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        station.dock(Bike(12, "cargo bike"))
        with self.assertRaises(StationException):
            station.dock(Bike(12, "cargo bike"))

    def test_the_station_still_has_the_bike_once(self):
        station = Station("Bahnhofplatz", 3)
        bike = Bike(7, "city bike")
        station.dock(bike)
        with self.assertRaises(StationException):
            station.dock(bike)
        self.assertEqual(station.get(), [bike])

    def test_a_different_bike_of_the_same_model_is_accepted(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        station.dock(Bike(12, "city bike"))
        self.assertEqual(len(station.get()), 2)


class TestLevel3Rides(unittest.TestCase):

    def test_a_new_bike_has_no_rides(self):
        self.assertEqual(Bike(7, "city bike").rides, 0)

    def test_undock_hands_out_the_bike_with_one_ride(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        cargo = Bike(12, "cargo bike")
        station.dock(cargo)
        bike = station.undock(7)
        self.assertEqual(bike.id, 7)
        self.assertEqual(bike.rides, 1)
        self.assertEqual(station.get(), [cargo])

    def test_docking_again_and_undocking_counts_two_rides(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        bike = station.undock(7)
        station.dock(bike)
        bike = station.undock(7)
        self.assertEqual(bike.rides, 2)

    def test_undocking_an_unknown_id_raises(self):
        station = Station("Bahnhofplatz", 3)
        station.dock(Bike(7, "city bike"))
        with self.assertRaises(StationException):
            station.undock(99)
