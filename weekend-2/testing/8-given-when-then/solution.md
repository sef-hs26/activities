# Given, When, Then: our scenarios

Eight scenarios for car categories, from the promises in the Task 5 text. Yours may be worded
differently or cover other cases. What counts is that someone can check each one without asking
its authors.

1. **A booking for a category, all goes well.**
   Given the category Small with one car, a Fiat 500, free all week,
   when Anna books a small car from Monday to Wednesday, and her rental starts,
   then she gets the Fiat 500.

2. **A booking for a specific car works as before.**
   Given a Mini that is free all week,
   when Ben books the Mini itself from Monday to Wednesday, and his rental starts,
   then he gets the Mini.

3. **A booking names a category or a car, and never both.**
   Given the category Small and a Mini in it,
   when Carla books the category Small and the Mini in one booking,
   then the booking is refused.

4. **A booking names at least one of them.**
   Given any categories and cars,
   when Dan books without naming a category or a car,
   then the booking is refused.

5. **No free car in the category.**
   Given the category Fun with one car, a Lotus Elise, rented out all week,
   when Eva books a fun car for Tuesday, and her rental is to start,
   then the rental is refused, and the Lotus stays with the customer who has it.

6. **Two bookings for one category get two cars.**
   Given the category Large with two cars, both free all week,
   when Finn and Gina each book a large car for the same days, and both rentals start,
   then they get two different cars.

7. **Every car has a category.**
   Given the categories Small and Large,
   when the company adds a new car without naming a category,
   then the car is refused.

8. **Deleting a category.**
   Given the category Fun with two cars, one of them booked for next week,
   when the company deletes the category Fun,
   then the category, its two cars and the booking are gone.
