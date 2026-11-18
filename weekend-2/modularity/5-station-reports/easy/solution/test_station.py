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


class TestStation(unittest.TestCase):

    def test_undock_takes_the_bike_out(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bike = Bike(7, "city bike")
        bahnhof.dock(bike)
        bahnhof.undock(bike)
        self.assertEqual(bahnhof.get(), [])

    def test_docking_tells_every_listener(self):
        bahnhof = Station("Bahnhofplatz", 2)
        first = Recorder()
        second = Recorder()
        bahnhof.attach(first)
        bahnhof.attach(second)
        bahnhof.dock(Bike(7, "city bike"))
        self.assertEqual(first.heard, [bahnhof])
        self.assertEqual(second.heard, [bahnhof])


class TestScreen(unittest.TestCase):

    def test_the_screen_shows_one_of_two_docks_taken(self):
        bahnhof = Station("Bahnhofplatz", 2)
        bahnhof.dock(Bike(7, "city bike"))
        text = printed_by(station.Screen(), bahnhof)
        self.assertIn("Bahnhofplatz", text)
        self.assertIn("1 of 2", text)

    def test_the_screen_shows_two_of_three_docks_taken(self):
        bellevue = Station("Bellevue", 3)
        bellevue.dock(Bike(7, "city bike"))
        bellevue.dock(Bike(12, "cargo bike"))
        text = printed_by(station.Screen(), bellevue)
        self.assertIn("Bellevue", text)
        self.assertIn("2 of 3", text)
