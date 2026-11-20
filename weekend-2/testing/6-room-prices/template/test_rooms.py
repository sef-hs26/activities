"""Tests for the room prices, each written before its code.

Run them with:  python3 -m unittest -v
"""

import unittest

from rooms import stay_price


class RoomPrices(unittest.TestCase):
    """Allison's price list: two tests at each limit, each before its code."""

    # Cycle 1: a night costs 80 francs.

    # Cycle 2: six nights cost 480 francs.

    # Cycle 3: from 7 nights on, a night costs 70 francs.

    # Cycle 4: a third guest pays 20 francs more a night.

    # Cycle 5: a room takes at most 4 guests.

    # Last: four guests pay 120 francs a night.
