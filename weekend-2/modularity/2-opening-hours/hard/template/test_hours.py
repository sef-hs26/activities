import unittest

import hours
from hours import Shop, website, app


class AlwaysClosed(Shop):
    """A shop that is never open, to check who asks the shop."""

    def is_open(self, day, hour):
        return False


class AlwaysOpen(Shop):
    """A shop that is always open, to check who asks the shop."""

    def is_open(self, day, hour):
        return True


class TestStart(unittest.TestCase):

    def test_open_on_monday_morning(self):
        velo = Shop("Velo Huber")
        self.assertEqual(website(velo, "Monday", 10), "Velo Huber is open.")
        self.assertEqual(app(velo, "Monday", 10), "OPEN")

    def test_closed_on_monday_evening(self):
        velo = Shop("Velo Huber")
        self.assertEqual(website(velo, "Monday", 19), "Velo Huber is closed.")
        self.assertEqual(app(velo, "Monday", 19), "CLOSED")

    def test_closed_on_sunday(self):
        self.assertFalse(Shop("Velo Huber").is_open("Sunday", 10))

    def test_the_app_asks_the_shop(self):
        self.assertEqual(app(AlwaysClosed("Velo Huber"), "Monday", 10), "CLOSED")


class TestLevel1Saturday(unittest.TestCase):

    def test_open_on_saturday_at_15(self):
        self.assertTrue(Shop("Velo Huber").is_open("Saturday", 15))

    def test_closed_on_saturday_at_16(self):
        self.assertFalse(Shop("Velo Huber").is_open("Saturday", 16))

    def test_the_app_agrees_on_saturday_at_17(self):
        self.assertEqual(app(Shop("Velo Huber"), "Saturday", 17), "CLOSED")


class TestLevel2Lunch(unittest.TestCase):

    def test_closed_on_wednesday_at_12(self):
        self.assertFalse(Shop("Velo Huber").is_open("Wednesday", 12))

    def test_open_again_on_wednesday_at_13(self):
        self.assertTrue(Shop("Velo Huber").is_open("Wednesday", 13))

    def test_no_lunch_break_on_saturday(self):
        self.assertTrue(Shop("Velo Huber").is_open("Saturday", 12))


class TestLevel3PhoneBot(unittest.TestCase):

    def test_the_bot_says_yes_when_the_shop_is_open(self):
        self.assertIn("Yes", hours.phone_bot(Shop("Velo Huber"), "Monday", 10))

    def test_the_bot_says_closed_when_the_shop_is_closed(self):
        self.assertIn("closed", hours.phone_bot(Shop("Velo Huber"), "Sunday", 10))

    def test_the_bot_asks_the_shop(self):
        self.assertIn("Yes", hours.phone_bot(AlwaysOpen("Velo Huber"), "Sunday", 10))
        self.assertIn("closed", hours.phone_bot(AlwaysClosed("Velo Huber"), "Monday", 10))
