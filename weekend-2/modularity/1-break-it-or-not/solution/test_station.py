import unittest

from station import Bike, Station


class TestWhatTheAppUses(unittest.TestCase):
    """The app team's tests: they check what the app uses, and nothing else."""

    def test_a_station_keeps_its_name(self):
        self.assertEqual(Station("Bahnhofplatz").name, "Bahnhofplatz")

    def test_a_new_station_has_no_bikes(self):
        self.assertEqual(Station("Bahnhofplatz").count(), 0)

    def test_count_gives_the_bikes_docked(self):
        bahnhof = Station("Bahnhofplatz")
        bahnhof.dock(Bike(7, "city bike"))
        bahnhof.dock(Bike(12, "cargo bike"))
        self.assertEqual(bahnhof.count(), 2)
