"""Your tests for the taproom, each written before its code.

Run them with:  python3 -m unittest -v
Check them with:  python3 check_my_tests.py
"""

import unittest

from taproom import order_price


class Taproom(unittest.TestCase):
    """Allison's taproom rules: two tests at each limit, each before its code."""

    # Level 1: rules 1 and 2, the prices.
    def test_two_beers_cost_12(self):
        self.assertEqual(order_price("beer", 2, 30), 12)

    def test_three_lemonades_cost_12(self):
        self.assertEqual(order_price("lemonade", 3, 30), 12)

    def test_six_beers_cost_30(self):
        self.assertEqual(order_price("beer", 6, 30), 30)

    def test_five_beers_cost_30(self):
        self.assertEqual(order_price("beer", 5, 30), 30)

    # Level 2: rule 3, no beer under 18.
    def test_a_17_year_old_gets_no_beer(self):
        with self.assertRaises(ValueError):
            order_price("beer", 1, 17)

    def test_an_18_year_old_gets_a_beer(self):
        self.assertEqual(order_price("beer", 1, 18), 6)

    def test_a_15_year_old_gets_a_lemonade(self):
        self.assertEqual(order_price("lemonade", 1, 15), 4)

    # Level 3: rule 4, at most 10 glasses.
    def test_11_glasses_are_refused(self):
        with self.assertRaises(ValueError):
            order_price("beer", 11, 30)

    def test_10_beers_cost_54(self):
        self.assertEqual(order_price("beer", 10, 30), 54)
