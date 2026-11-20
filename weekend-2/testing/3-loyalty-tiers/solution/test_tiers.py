"""Our tests for the loyalty tiers.

Run them with:  python3 -m unittest -v
Check them with:  python3 check_my_tests.py
"""

import unittest

from tiers import tier


class TestTiers(unittest.TestCase):

    def test_a_customer_who_spent_100_francs_is_bronze(self):
        self.assertEqual(tier(100), "Bronze")

    # Step 1: one test for each tier.
    def test_a_customer_who_spent_700_francs_is_silver(self):
        self.assertEqual(tier(700), "Silver")

    def test_a_customer_who_spent_3000_francs_is_gold(self):
        self.assertEqual(tier(3000), "Gold")

    # Step 2: both sides of every limit.
    def test_a_customer_who_spent_499_francs_is_bronze(self):
        self.assertEqual(tier(499), "Bronze")

    def test_a_customer_who_spent_500_francs_is_silver(self):
        self.assertEqual(tier(500), "Silver")

    def test_a_customer_who_spent_1999_francs_is_silver(self):
        self.assertEqual(tier(1999), "Silver")

    def test_a_customer_who_spent_2000_francs_is_gold(self):
        self.assertEqual(tier(2000), "Gold")
