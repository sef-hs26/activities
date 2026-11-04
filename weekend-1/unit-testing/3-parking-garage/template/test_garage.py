"""Tests for the parking garage. Run them with: python3 -m unittest -v"""

import unittest

from garage import Garage, GarageFull


class GarageTests(unittest.TestCase):

    def test_new_garage_is_empty(self):
        garage = Garage(3)
        self.assertEqual(garage.free_places(), 3)

    def test_a_car_takes_a_place(self):
        garage = Garage(3)
        garage.drive_in("ZH 101")
        self.assertEqual(garage.free_places(), 2)

    def test_full_garage_refuses_a_car(self):
        garage = Garage(2)
        garage.drive_in("ZH 101")
        garage.drive_in("BE 202")
        with self.assertRaises(GarageFull):
            garage.drive_in("LU 303")

    def test_a_car_drives_out(self):
        garage = Garage(3)
        garage.drive_in("ZH 101")
        garage.drive_in("BE 202")
        garage.drive_out("BE 220")
        self.assertEqual(garage.free_places(), 2)
