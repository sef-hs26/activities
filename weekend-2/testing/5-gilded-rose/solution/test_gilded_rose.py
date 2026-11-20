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

    # Level 1: one test per kind of item.

    def test_aged_brie_sell_in_2_quality_0(self):
        item = Item("Aged Brie", 2, 0)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 1)
        self.assertEqual(item.quality, 1)

    def test_sulfuras_hand_of_ragnaros_sell_in_5_quality_80(self):
        item = Item("Sulfuras, Hand of Ragnaros", 5, 80)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 5)
        self.assertEqual(item.quality, 80)

    # Level 2: the edges. The sell date passes tonight, and the night before.

    def test_elixir_of_the_mongoose_sell_in_0_quality_10(self):
        item = Item("Elixir of the Mongoose", 0, 10)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, -1)
        self.assertEqual(item.quality, 8)

    def test_elixir_of_the_mongoose_sell_in_1_quality_10(self):
        item = Item("Elixir of the Mongoose", 1, 10)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 0)
        self.assertEqual(item.quality, 9)

    def test_aged_brie_sell_in_0_quality_10(self):
        item = Item("Aged Brie", 0, 10)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, -1)
        self.assertEqual(item.quality, 12)

    # Level 2: quality 0 and quality 50.

    def test_elixir_of_the_mongoose_sell_in_5_quality_0(self):
        item = Item("Elixir of the Mongoose", 5, 0)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 4)
        self.assertEqual(item.quality, 0)

    def test_aged_brie_sell_in_5_quality_50(self):
        item = Item("Aged Brie", 5, 50)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 4)
        self.assertEqual(item.quality, 50)


class ConjuredItems(unittest.TestCase):
    """The innkeeper's new rule. Level 3."""

    # Copied from try_it.py, with the quality the new rule expects: 2 a night, 4 after the sell date.

    def test_conjured_mana_cake_sell_in_3_quality_6(self):
        item = Item("Conjured Mana Cake", 3, 6)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 2)
        self.assertEqual(item.quality, 4)

    def test_conjured_mana_cake_sell_in_0_quality_10(self):
        item = Item("Conjured Mana Cake", 0, 10)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, -1)
        self.assertEqual(item.quality, 6)

    def test_conjured_mana_cake_sell_in_3_quality_1(self):
        item = Item("Conjured Mana Cake", 3, 1)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 2)
        self.assertEqual(item.quality, 0)
