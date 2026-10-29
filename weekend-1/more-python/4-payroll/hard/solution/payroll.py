"""Payroll: what the car rental pays its staff at the end of the month."""
from dataclasses import dataclass


@dataclass
class Employee:
    """Someone on the staff, paid a monthly salary in francs."""
    name: str
    salary: int

    def pay(self):
        """Return this month's pay in francs."""
        return self.salary

    # Level 2
    def payslip(self):
        """Return the payslip line, written once for everybody."""
        return f"{self.name}: {self.pay()} francs"

    # Level 3
    def contributions(self):
        """Return what the car rental pays for social insurance this month."""
        return 300


@dataclass
class Manager(Employee):
    """An employee who also gets a monthly bonus."""
    bonus: int

    def pay(self):
        return super().pay() + self.bonus


class Intern(Employee):
    """An employee who also gets 200 francs a month for travel."""

    def pay(self):
        return super().pay() + 200


# Level 1
@dataclass
class Clerk(Employee):
    """A counter clerk, paid 20 francs more for every car rented out this month."""
    rentals: int

    def pay(self):
        return super().pay() + 20 * self.rentals


# Level 3
class Freelancer(Employee):
    """Someone paid like an employee, who pays their own social insurance."""

    def contributions(self):
        return 0


def total_pay(staff):
    """Add up what everybody on the staff is paid this month."""
    total = 0
    for person in staff:
        total = total + person.pay()
    return total
