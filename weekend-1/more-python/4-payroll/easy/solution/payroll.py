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


def total_pay(staff):
    """Add up what everybody on the staff is paid this month."""
    total = 0
    for person in staff:
        total = total + person.pay()
    return total
