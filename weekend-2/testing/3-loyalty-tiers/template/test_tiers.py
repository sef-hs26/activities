"""Your tests for the loyalty tiers.

Run them with:  python3 -m unittest -v
Check them with:  python3 check_my_tests.py
"""

import unittest

from tiers import tier


class TestTiers(unittest.TestCase):

    def test_a_customer_who_spent_100_francs_is_bronze(self):
        self.assertEqual(tier(100), "Bronze")

    # Step 1: copy the test above twice, for a Silver and for a Gold customer.
    # Give each copy a new name, then change the francs and the tier.
    #
    # Step 2: test both sides of every limit in the rules.
