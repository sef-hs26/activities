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


@dataclass
class Manager(Employee):
    """An employee who also gets a monthly bonus."""
    bonus: int

    def pay(self):
        # TODO: return the salary, super().pay(), plus the bonus.
        pass


# TODO: write a class Intern, a kind of Employee, whose pay is the salary plus
# 200 francs a month for travel. It adds no field, so it needs no @dataclass line.


def total_pay(staff):
    """Add up what everybody on the staff is paid this month."""
    total = 0
    for person in staff:
        total = total + person.pay()
    return total
