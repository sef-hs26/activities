"""Tests for the toy kata. Run: python3 -m unittest -v"""
import unittest

import payroll


class TestPayroll(unittest.TestCase):

    def test_an_employee_is_paid_the_salary(self):
        anna = payroll.Employee("Anna", 6000)
        self.assertEqual(anna.pay(), 6000)

    def test_a_manager_is_paid_the_salary_plus_the_bonus(self):
        bea = payroll.Manager("Bea", 8000, 1000)
        self.assertEqual(bea.pay(), 9000)

    def test_an_intern_is_paid_the_salary_plus_200_francs(self):
        carlo = payroll.Intern("Carlo", 2000)
        self.assertEqual(carlo.pay(), 2200)

    def test_total_pay_adds_up_the_whole_staff(self):
        staff = [payroll.Employee("Anna", 6000), payroll.Manager("Bea", 8000, 1000),
                 payroll.Intern("Carlo", 2000)]
        self.assertEqual(payroll.total_pay(staff), 17200)
