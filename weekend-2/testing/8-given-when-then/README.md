# Given, When, Then

Before a team builds a feature, it agrees with the customer on what "done" means. Acceptance tests
say it in the customer's words:

    Given  a situation,
    When   someone does something,
    Then   this is what happens.

Your next task, Task 5, brings car categories to the car rental:

https://lec.inf.ethz.ch/infk/se_cas_ais/2026_as/docs/tasks/task-5/task-5/

Write its acceptance tests first, before any code.

You practise: acceptance tests, the tests a customer can read.

## What management promised (from the Task 5 text)

- There can be any number of categories.
- Every car belongs to exactly one category.
- A booking names either a category or a specific car.
- When the rental starts, a booking for a category gets any available car of that category. A
  booking for a specific car works as before.

## Your turn (15 minutes)

1. Write five scenarios in the form above, in plain words, on paper or in a text file: at least one
   where everything goes well, and at least two where something goes wrong.
2. Swap with someone else, a neighbour in class or your Task 5 partner. Is every scenario clear
   enough that they could check it without asking you?
3. In Task 5, open the intern's pull request and read its tests. Which of your scenarios do they
   test? Which did the intern forget?

## An example

    Given  the category Small with one car, a Fiat 500, free all week,
    When   Anna books a small car from Monday to Wednesday, and her rental starts,
    Then   she gets the Fiat 500.

Our scenarios are in `solution.md`. Read them once you have written yours.
