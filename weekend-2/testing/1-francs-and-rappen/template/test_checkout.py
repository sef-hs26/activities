"""The teams' tests, and yours.

Run them with:  python3 -m unittest -v
"""

import unittest

from checkout import cart_total, charge, checkout


class TestShopTeam(unittest.TestCase):

    def test_a_cart_of_1250_and_500_rappen_is_1750_rappen(self):
        self.assertEqual(cart_total([1250, 500]), 1750)


class TestPaymentTeam(unittest.TestCase):

    def test_charging_17_5_francs_to_anna(self):
        self.assertEqual(charge("Anna", 17.5), "Charged 17.5 francs to Anna")


class TestTogether(unittest.TestCase):
    """Step 2: your test of the two parts together goes here."""
