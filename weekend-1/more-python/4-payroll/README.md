# Payroll

At the end of every month the car rental pays its staff: employees their salary, managers a bonus
on top, interns a travel allowance. One loop adds up the bill, whoever is on the staff.

You practise: subclasses that extend a method with `super()`, and one loop that pays everybody.
In the car rental's code, customers and cars are dataclasses too, and its rules may one day depend
on the type of car, the way pay depends on the kind of employee here.

## Easy: class skeleton (about 10 minutes)

Open `easy/template/payroll.py`: it holds the skeleton of the class `Employee` and of the function
`total_pay`. Where the `# TODO` comments are, give an `Employee` its two fields, `name` and
`salary`, and its method `pay`, which returns the salary; then write `total_pay`, which adds up
what everybody on the staff is paid. Once you are done, run the demo and the tests.

## Medium: toy kata (about 10 minutes)

Open `medium/template/payroll.py`: the easy kata solved, with managers on the staff. Write the
code where the `# TODO` comments are: a manager is paid the salary plus the bonus, and a new kind
of employee, the intern, is paid the salary plus 200 francs a month for travel.

## Hard: coding kata (about 25 minutes)

Work in pairs in `hard/template/`, where the toy kata is solved. One change request at a time:

1. Counter clerks: a `Clerk(name, salary, rentals)` is paid the salary plus 20 francs for every car
   they rented out this month, and `total_pay` keeps working without any change.
2. Payslips: everybody gets a `payslip()` line such as "Anna: 7500 francs", written only once.
3. Social insurance: `contributions()` is 300 francs a month for everybody, and a
   `Freelancer(name, salary)`, who pays their own, has 0.

## Run it

Inside `easy/template`, `medium/template` or `hard/template`:

    python3 demo.py
    python3 -m unittest -v

## Questions to talk about

1. Clerks and freelancers joined the payroll, and `total_pay` stayed the same. What made that
   possible?
2. A freelancer is not an employee, yet `Freelancer` inherits from `Employee`. Does that matter,
   and what would be a better name for the base class?
