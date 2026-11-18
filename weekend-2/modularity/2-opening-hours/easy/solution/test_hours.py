import unittest

from hours import Shop, website, app


class AlwaysClosed(Shop):
    """A shop that is never open, to check that the app asks the shop."""

    def is_open(self, day, hour):
        return False


class TestOpeningHours(unittest.TestCase):

    def test_open_on_monday_morning(self):
        velo = Shop("Velo Huber")
        self.assertEqual(website(velo, "Monday", 10), "Velo Huber is open.")
        self.assertEqual(app(velo, "Monday", 10), "OPEN")

    def test_closed_on_monday_evening(self):
        velo = Shop("Velo Huber")
        self.assertEqual(website(velo, "Monday", 19), "Velo Huber is closed.")
        self.assertEqual(app(velo, "Monday", 19), "CLOSED")

    def test_the_app_says_closed_on_sunday(self):
        self.assertEqual(app(Shop("Velo Huber"), "Sunday", 10), "CLOSED")

    def test_the_app_asks_the_shop(self):
        self.assertEqual(app(AlwaysClosed("Velo Huber"), "Monday", 10), "CLOSED")
