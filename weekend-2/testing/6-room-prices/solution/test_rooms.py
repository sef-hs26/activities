"""Tests for the room prices, each written before its code.

Run them with:  python3 -m unittest -v
"""

import unittest

from rooms import stay_price


class RoomPrices(unittest.TestCase):
    """Allison's price list: two tests at each limit, each before its code."""

    # Cycle 1: a night costs 80 francs.
    def test_one_night_costs_80(self):
        self.assertEqual(stay_price(1, 2), 80)

    # Cycle 2: six nights cost 480 francs.
    def test_six_nights_cost_480(self):
        self.assertEqual(stay_price(6, 2), 480)

    # Cycle 3: from 7 nights on, a night costs 70 francs.
    def test_seven_nights_cost_490(self):
        self.assertEqual(stay_price(7, 2), 490)

    # Cycle 4: a third guest pays 20 francs more a night.
    def test_a_third_guest_pays_20_more(self):
        self.assertEqual(stay_price(1, 3), 100)

    # Cycle 5: a room takes at most 4 guests.
    def test_five_guests_are_refused(self):
        with self.assertRaises(ValueError):
            stay_price(1, 5)

    # Last: four guests pay 120 francs a night.
    def test_four_guests_pay_120_a_night(self):
        self.assertEqual(stay_price(1, 4), 120)
