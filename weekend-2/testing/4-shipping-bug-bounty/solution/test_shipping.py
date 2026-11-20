"""The intern's tests for the shipping rules, repaired, and ours.

Run them with:  python3 -m unittest -v
Check them with:  python3 check_my_tests.py
"""

import unittest

from shipping import shipping


class InternTests(unittest.TestCase):
    """Level 1: the intern's four tests, repaired. One test for each answer the shop can give."""

    def test_an_order_of_50_francs_pays_9_francs(self):
        self.assertEqual(shipping(50, False), 9)

    def test_a_member_pays_nothing(self):
        self.assertEqual(shipping(50, True), 0)          # it checked nothing

    def test_a_big_order_ships_free(self):
        self.assertEqual(shipping(150, False), 0)        # it compared the code with itself

    def test_small_orders_are_refused(self):             # without test_ it never ran
        with self.assertRaises(ValueError):
            shipping(5, False)


class MyTests(unittest.TestCase):
    """Levels 2 and 3."""

    # Level 2: both sides of every limit in the rules.
    def test_an_order_of_9_francs_95_is_refused(self):
        with self.assertRaises(ValueError):
            shipping(9.95, False)

    def test_an_order_of_exactly_10_francs_pays_9_francs(self):
        self.assertEqual(shipping(10, False), 9)

    def test_an_order_of_99_francs_95_pays_9_francs(self):
        self.assertEqual(shipping(99.95, False), 9)

    def test_an_order_of_exactly_100_francs_ships_free(self):
        self.assertEqual(shipping(100, False), 0)

    # Level 3: where two rules meet.
    def test_a_member_who_orders_for_5_francs_is_refused(self):
        with self.assertRaises(ValueError):
            shipping(5, True)
