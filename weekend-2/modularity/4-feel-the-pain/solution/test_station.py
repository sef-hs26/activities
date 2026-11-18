import io
import unittest
from contextlib import redirect_stdout

from station import Bike, Station


def dock_and_read(station, bike):
    """Dock the bike, and return what the station printed."""
    out = io.StringIO()
    with redirect_stdout(out):
        station.dock(bike)
    return out.getvalue()


class TestStation(unittest.TestCase):

    def test_the_screen_shows_the_docks_taken(self):
        bahnhof = Station("Bahnhofplatz", 2)
        self.assertIn("1 of 2", dock_and_read(bahnhof, Bike(7, "city bike")))

    def test_a_full_station_calls_the_truck(self):
        bahnhof = Station("Bahnhofplatz", 2)
        dock_and_read(bahnhof, Bike(7, "city bike"))
        self.assertIn("Truck", dock_and_read(bahnhof, Bike(3, "e-bike")))

    def test_a_cargo_bike_tells_the_bike_club(self):
        bahnhof = Station("Bahnhofplatz", 3)
        printed = dock_and_read(bahnhof, Bike(12, "cargo bike"))
        self.assertIn("bike club", printed.lower())

    def test_a_city_bike_leaves_the_bike_club_alone(self):
        bahnhof = Station("Bahnhofplatz", 3)
        printed = dock_and_read(bahnhof, Bike(7, "city bike"))
        self.assertNotIn("bike club", printed.lower())
