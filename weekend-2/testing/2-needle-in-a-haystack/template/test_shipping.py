"""Your tests for the shipping rule.

Run them with:  python3 -m unittest -v
"""

import unittest

from shipping import shipping


class TestShipping(unittest.TestCase):

    def test_an_order_of_50_francs_pays_9_francs(self):
        self.assertEqual(shipping(50), 9)

    # Step 2: where does the rule change its answer? One test for an order right there.
