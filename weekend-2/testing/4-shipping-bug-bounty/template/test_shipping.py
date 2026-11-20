"""The intern's tests for the shipping rules, and yours.

Run them with:  python3 -m unittest -v
Check them with:  python3 check_my_tests.py
"""

import unittest

from shipping import shipping


class InternTests(unittest.TestCase):
    """The intern's four tests. Everything is green. How many mistakes can they catch?"""

    def test_an_order_of_50_francs_pays_9_francs(self):
        self.assertEqual(shipping(50, False), 9)

    def test_a_member_pays_nothing(self):
        shipping(50, True)

    def test_a_big_order_ships_free(self):
        self.assertEqual(shipping(150, False), shipping(150, False))

    def small_orders_are_refused(self):
        with self.assertRaises(ValueError):
            shipping(5, False)


class MyTests(unittest.TestCase):
    """Your tests, from level 2 on."""

    # Level 2: test both sides of every limit in the rules.
    # Level 3: test what happens where two rules meet.
