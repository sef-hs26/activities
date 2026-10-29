"""The end of the month at the car rental. Run it once your class is written."""
from payroll import Employee, total_pay

staff = [Employee("Anna", 6000), Employee("Bea", 8000)]
print("It is the end of the month, and the car rental pays its staff.")
for person in staff:
    print(f"{person.name} is paid {person.pay()} francs.")
print(f"In all, it pays {total_pay(staff)} francs.")
