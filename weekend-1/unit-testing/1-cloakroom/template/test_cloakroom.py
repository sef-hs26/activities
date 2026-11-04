"""Tests for the cloakroom. Run them with: python3 -m unittest -v"""

import unittest

from cloakroom import Cloakroom, CloakroomError


class CloakroomTests(unittest.TestCase):

    def test_first_coat(self):
        room = Cloakroom()
        room.hang("yellow coat")
        room.hang("black coat")
        self.assertEqual(room.collect(1), "yellow coat")

    def test_second_coat(self):
        room = Cloakroom()
        room.hang("yellow coat")
        room.hang("black coat")
        self.assertEqual(room.collect(2), "black coat")

    def test_unknown_ticket(self):
        room = Cloakroom()
        room.hang("yellow coat")
        with self.assertRaises(CloakroomError):
            room.collect(7)

    def test_empty_cloakroom(self):
        room = Cloakroom()
        with self.assertRaises(CloakroomError):
            room.collect(1)
