"""The end of the month at the car rental. Run: python3 demo.py"""
from payroll import Clerk, Employee, Freelancer, Intern, Manager, total_pay

staff = [Employee("Anna", 6000), Manager("Bea", 8000, 1000), Intern("Carlo", 2000),
         Clerk("Dan", 4000, 50), Freelancer("Eva", 5000)]
print("It is the end of the month, and the car rental pays its staff.")
insurance = 0
for person in staff:
    print(person.payslip())
    insurance = insurance + person.contributions()
print(f"In all, it pays {total_pay(staff)} francs.")
print(f"On top, it pays {insurance} francs for social insurance.")
