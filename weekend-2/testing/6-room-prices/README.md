# Room prices: tests first, together

The Gilded Rose also rents rooms. Allison, the innkeeper, wants a small program that says what a
stay costs. Nobody has written it yet. This time the tests come first: for each rule you write its
test, see it fail, then write just enough code to make it pass. That is test-driven development.

We run this kata together in class: the slides show every step, and you do it on your laptop.
About 15 minutes.

## Allison's price list

1. A night costs 80 francs.
2. From 7 nights on, a night costs 70 francs.
3. A room sleeps two. A third and a fourth guest pay 20 francs more a night each, for an extra
   bed.
4. A room takes at most 4 guests.

## The specification

`rooms.py` holds the specification of `stay_price`, in its docstring: how it is called and what it
gives back. Its code is still empty: for now it says 0 francs for every stay.

    def stay_price(nights, guests):
        """What a stay costs, in francs.
        nights: how many nights the guests stay.
        guests: how many guests share the room.
        Refused stay: raises ValueError.
        Example: stay_price(3, 2) is 240.
        """
        return 0

So `stay_price(3, 2)` is the price of 3 nights for 2 guests: 240 francs.

## Which tests? Two at each limit

Draw each input as a line, and mark where another rule takes over: those are the limits.

    nights:  1 2 3 4 5 6 | 7 8 9 ...
             80 a night  | 70 a night

    guests:  1 2      | 3 4                  | 5 6 ...
             no extra | 20 more a night each | refused

Three limits. At each, one test on each side:

| Limit | Left of it | Right of it |
|---|---|---|
| 6 or 7 nights (rule 2) | 6 nights, 2 guests: 480 francs | 7 nights, 2 guests: 490 francs |
| 2 or 3 guests (rule 3) | one night, 2 guests: 80 francs | one night, 3 guests: 100 francs |
| 4 or 5 guests (rule 4) | one night, 4 guests: 120 francs | one night, 5 guests: refused |

Six tests. You write them one at a time, in the cycles below.

## Open it

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/6-room-prices/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

- `rooms.py`: the specification of `stay_price`; its code says 0 francs for every stay.
- `test_rooms.py`: your tests. None yet: a comment marks where each one goes.

Run the tests in a terminal (**Terminal > New Terminal**), or with the play button of the Testing
view:

    python3 -m unittest -v

As handed out, it ran 0 tests.

## The cycle: red, green, refactor

1. **Red.** Write one new test. Run the tests: the new one fails, since the code does not do it
   yet.
2. **Green.** Change the code as little as you can, until every test passes.
3. **Refactor.** Tidy the code up without changing what it does. Run the tests: still all green.

## Cycle 1: a night costs 80 francs

Red. In `test_rooms.py`, below the comment of cycle 1, type the test, indented like the comment:

    def test_one_night_costs_80(self):
        self.assertEqual(stay_price(1, 2), 80)

Run the tests: red, `AssertionError: 0 != 80`. The code says 0.

Green. In `rooms.py`, replace `return 0` with:

    return 80

Run the tests: green. Too simple? A test checks only what it asks. The next test asks more.

## Cycle 2: six nights cost 480 francs

Red. Below the comment of cycle 2:

    def test_six_nights_cost_480(self):
        self.assertEqual(stay_price(6, 2), 480)

Run the tests: red, `AssertionError: 80 != 480`.

Green. Replace `return 80` with:

    return nights * 80

Run the tests: both green.

## Cycle 3: from 7 nights on, 70 francs a night

Red. Below the comment of cycle 3:

    def test_seven_nights_cost_490(self):
        self.assertEqual(stay_price(7, 2), 490)

Run the tests: red, `AssertionError: 560 != 490`.

Green. Above `return nights * 80`, add:

    if nights >= 7:
        return nights * 70

Run the tests: all three green.

## Refactor: make the next rule easy

The code multiplies in two places, and the next rule adds to the price of a night. Replace the
three lines of cycle 3 with:

    per_night = 80
    if nights >= 7:
        per_night = 70
    return nights * per_night

Run the tests: still all green. The code does the same, and the price of a night has a name.

## Cycle 4: a third guest pays 20 francs more a night

Red. Below the comment of cycle 4:

    def test_a_third_guest_pays_20_more(self):
        self.assertEqual(stay_price(1, 3), 100)

Run the tests: red, `AssertionError: 80 != 100`.

Green. Above `return nights * per_night`, add, indented like it:

    if guests > 2:
        per_night = per_night + 20 * (guests - 2)

Run the tests: all four green.

## Cycle 5: a room takes at most 4 guests

Red. Below the comment of cycle 5:

    def test_five_guests_are_refused(self):
        with self.assertRaises(ValueError):
            stay_price(1, 5)

`assertRaises` passes only if the call raises a `ValueError`. Run the tests: red,
`AssertionError: ValueError not raised`. The inn took five guests.

Green. In `stay_price`, below its docstring, the lines in quotes, add:

    if guests > 4:
        raise ValueError("At most 4 guests.")

Run the tests: all five green.

## Last: four guests pay 120 francs a night

The sixth test. Below the last comment:

    def test_four_guests_pay_120_a_night(self):
        self.assertEqual(stay_price(1, 4), 120)

Run the tests: all six green at once, since the code already does it. Keep the test anyway: if
someone charges a flat 20 francs for the extra beds, it turns red. So does the test of six nights,
if someone changes the 7 into a 6.

## Questions to talk about

1. After cycle 1 the code said 80 for every stay, and the test was green. What made it change?
2. Why did the refactoring come before cycle 4?
3. Read the names of your tests, one after the other. What do they read like?

## The solution

`solution/` holds the code after cycle 5 and the six tests. Open `solution/rooms.py` with
**File > Open File** to compare.

The guides write `python3`. If that does not work on your laptop, type `python` instead.
