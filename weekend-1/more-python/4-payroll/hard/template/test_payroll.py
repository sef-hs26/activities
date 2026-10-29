"""Tests for the coding kata. Run: python3 -m unittest -v"""
import unittest

import payroll


def team():
    """Anna, Bea and Carlo, the staff of the toy kata."""
    return [payroll.Employee("Anna", 6000), payroll.Manager("Bea", 8000, 1000),
            payroll.Intern("Carlo", 2000)]


class TestStart(unittest.TestCase):

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
        self.assertEqual(payroll.total_pay(team()), 17200)


class TestLevel1Clerk(unittest.TestCase):

    def test_a_clerk_is_paid_the_salary_plus_20_francs_per_rental(self):
        dan = payroll.Clerk("Dan", 4000, 50)
        self.assertEqual(dan.pay(), 5000)

    def test_total_pay_counts_clerks_too(self):
        staff = team()
        staff.append(payroll.Clerk("Dan", 4000, 50))
        self.assertEqual(payroll.total_pay(staff), 22200)


class TestLevel2Payslip(unittest.TestCase):

    def test_an_employee_gets_a_payslip_line(self):
        anna = payroll.Employee("Anna", 7500)
        self.assertEqual(anna.payslip(), "Anna: 7500 francs")

    def test_a_manager_gets_a_payslip_line_with_the_bonus(self):
        bea = payroll.Manager("Bea", 8000, 1000)
        self.assertEqual(bea.payslip(), "Bea: 9000 francs")

    def test_a_clerk_gets_a_payslip_line_with_the_rentals(self):
        dan = payroll.Clerk("Dan", 4000, 50)
        self.assertEqual(dan.payslip(), "Dan: 5000 francs")


class TestLevel3Contributions(unittest.TestCase):

    def test_an_employee_has_300_francs_of_contributions(self):
        anna = payroll.Employee("Anna", 6000)
        self.assertEqual(anna.contributions(), 300)

    def test_a_manager_has_300_francs_of_contributions(self):
        bea = payroll.Manager("Bea", 8000, 1000)
        self.assertEqual(bea.contributions(), 300)

    def test_a_freelancer_has_no_contributions(self):
        eva = payroll.Freelancer("Eva", 5000)
        self.assertEqual(eva.contributions(), 0)

    def test_a_freelancer_is_paid_the_salary(self):
        eva = payroll.Freelancer("Eva", 5000)
        self.assertEqual(eva.pay(), 5000)
