"""The end of the month at the car rental. Run: python3 demo.py"""
from payroll import Employee, Intern, Manager, total_pay

staff = [Employee("Anna", 6000), Manager("Bea", 8000, 1000), Intern("Carlo", 2000)]
print("It is the end of the month, and the car rental pays its staff.")
for person in staff:
    print(f"{person.name} is paid {person.pay()} francs.")
print(f"In all, it pays {total_pay(staff)} francs.")
