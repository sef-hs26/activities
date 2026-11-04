"""Tests for the stamp card. Run them with: python3 -m unittest -v"""

import unittest

from stamp_card import StampCard


class StampCardTests(unittest.TestCase):

    def test_first_coffee_costs_5(self):
        card = StampCard()
        self.assertEqual(card.buy_coffee(), 5)

    def test_third_coffee_is_free(self):
        card = StampCard()
        card.buy_coffee()
        card.buy_coffee()
        self.assertEqual(card.buy_coffee(), 0)

    def test_card_starts_over(self):
        card = StampCard()
        card.buy_coffee()
        card.buy_coffee()
        card.buy_coffee()
        card.buy_coffee()
        self.assertEqual(card.buy_coffee(), 5)

    def test_message_after_two_coffees(self):
        card = StampCard()
        card.buy_coffee()
        card.buy_coffee()
        self.assertEqual(card.message(), "You have 2 stamps.")
