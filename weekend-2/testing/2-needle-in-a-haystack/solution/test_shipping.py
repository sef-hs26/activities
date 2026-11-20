"""Your tests for the shipping rule.

Run them with:  python3 -m unittest -v
"""

import unittest

from shipping import shipping


class TestShipping(unittest.TestCase):

    def test_an_order_of_50_francs_pays_9_francs(self):
        self.assertEqual(shipping(50), 9)

    # Step 2: the rule changes its answer at 100 francs.
    def test_an_order_of_exactly_100_francs_ships_free(self):
        self.assertEqual(shipping(100), 0)
