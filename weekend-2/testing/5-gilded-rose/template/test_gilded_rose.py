"""Tests for the Gilded Rose.

Run them with:  python3 -m unittest -v
Ask the code with:  python3 try_it.py
Check your safety net with:  python3 check_my_tests.py
"""

import unittest

from gilded_rose import GildedRose, Item


class SafetyNet(unittest.TestCase):
    """What the code does today. Levels 1 and 2."""

    def test_elixir_of_the_mongoose_sell_in_10_quality_20(self):
        item = Item("Elixir of the Mongoose", 10, 20)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 9)
        self.assertEqual(item.quality, 19)

    # Level 1: a test like this one for Aged Brie, and one for Sulfuras, Hand of Ragnaros.
    # Level 2: the edges: the sell date, quality 0, quality 50.


class ConjuredItems(unittest.TestCase):
    """The innkeeper's new rule. Level 3."""

    # Level 3: Conjured items lose quality twice as fast as normal items.
    # Write these tests first, then change update_quality.
