"""Tests for the class skeleton. Run: python3 -m unittest -v"""
import unittest

import payroll


class TestSkeleton(unittest.TestCase):

    def test_an_employee_has_a_name_and_a_salary(self):
        anna = payroll.Employee("Anna", 6000)
        self.assertEqual(anna.name, "Anna")
        self.assertEqual(anna.salary, 6000)

    def test_an_employee_is_paid_the_salary(self):
        self.assertEqual(payroll.Employee("Anna", 6000).pay(), 6000)

    def test_total_pay_adds_up_the_whole_staff(self):
        staff = [payroll.Employee("Anna", 6000), payroll.Employee("Bea", 8000),
                 payroll.Employee("Carlo", 2000)]
        self.assertEqual(payroll.total_pay(staff), 16000)

    def test_nobody_on_the_staff_costs_nothing(self):
        self.assertEqual(payroll.total_pay([]), 0)
