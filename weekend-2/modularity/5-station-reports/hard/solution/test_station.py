import io
import unittest
from contextlib import redirect_stdout

import station
from patterns.observer import Observer
from station import Bike, Station


class Recorder(Observer):
    """A listener for the tests: it notes every station that told it something."""

    def __init__(self):
        self.heard = []

    def update(self, subject):
        self.heard.append(subject)


def printed_by(listener, subject):
    """Return what the listener prints when the subject tells it something."""
    out = io.StringIO()
    with redirect_stdout(out):
        listener.update(subject)
    return out.getvalue()


class TestStart(unittest.TestCase):

    def test_docking_tells_every_listener(self):
        bahnhof = Station("Bahnhofplatz", 2)
        first = Recorder()
        second = Recorder()
        bahnhof.attach(first)
        bahnhof.attach(second)
        bahnhof.dock(Bike(7, "city bike"))
        self.assertEqual(first.heard, [bahnhof])
        self.assertEqual(second.heard, [bahnhof])

    def test_the_screen_shows_the_docks_taken(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bahnhof.dock(Bike(7, "city bike"))
        text = printed_by(station.Screen(), bahnhof)
        self.assertIn("Bahnhofplatz", text)
        self.assertIn("1 of 2", text)


class TestLevel1Undock(unittest.TestCase):

    def test_undocking_tells_every_listener(self):
        bahnhof = Station("Bahnhofplatz", 2)
        recorder = Recorder()
        bahnhof.attach(recorder)
        bike = Bike(7, "city bike")
        bahnhof.dock(bike)
        bahnhof.undock(bike)
        self.assertEqual(recorder.heard, [bahnhof, bahnhof])

    def test_the_screen_shows_the_freed_dock(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bahnhof.attach(station.Screen())
        bike = Bike(7, "city bike")
        out = io.StringIO()
        with redirect_stdout(out):
            bahnhof.dock(bike)
            bahnhof.undock(bike)
        self.assertIn("0 of 2", out.getvalue())


class TestLevel2Truck(unittest.TestCase):

    def test_the_truck_comes_when_the_station_is_full(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bahnhof.dock(Bike(7, "city bike"))
        bahnhof.dock(Bike(12, "cargo bike"))
        text = printed_by(station.Truck(), bahnhof)
        self.assertIn("truck", text.lower())
        self.assertIn("Bahnhofplatz", text)

    def test_the_truck_stays_away_while_a_dock_is_free(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bahnhof.dock(Bike(7, "city bike"))
        self.assertEqual(printed_by(station.Truck(), bahnhof), "")


class TestLevel3Dashboard(unittest.TestCase):

    def test_one_dashboard_hears_two_stations(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bellevue = Station("Bellevue", 3)
        dashboard = station.CityDashboard()
        bahnhof.attach(dashboard)
        bellevue.attach(dashboard)
        out = io.StringIO()
        with redirect_stdout(out):
            bahnhof.dock(Bike(7, "city bike"))
            bellevue.dock(Bike(12, "cargo bike"))
        self.assertIn("Bahnhofplatz", out.getvalue())
        self.assertIn("Bellevue", out.getvalue())

    def test_the_dashboard_shows_the_docks_taken(self):
        bellevue = Station("Bellevue", 3)
        bellevue.dock(Bike(7, "city bike"))
        text = printed_by(station.CityDashboard(), bellevue)
        self.assertIn("dashboard", text.lower())
        self.assertIn("1 of 3", text)
