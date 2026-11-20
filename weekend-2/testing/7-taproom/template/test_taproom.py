"""Your tests for the taproom, each written before its code.

Run them with:  python3 -m unittest -v
Check them with:  python3 check_my_tests.py
"""

import unittest

from taproom import order_price


class Taproom(unittest.TestCase):
    """Allison's taproom rules: two tests at each limit, each before its code."""

    # Level 1: rules 1 and 2, the prices.

    # Level 2: rule 3, no beer under 18.

    # Level 3: rule 4, at most 10 glasses.

    # A test that the taproom refuses an order looks like this, without the # signs:
    # def test_a_16_year_old_gets_no_beer(self):
    #     with self.assertRaises(ValueError):
    #         order_price("beer", 1, 16)
