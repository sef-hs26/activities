# The stamp card: two red tests

A cafe gives its guests a stamp card. Every coffee earns a stamp, every 4th coffee is free, and
then the card starts over. Two of the card's four tests are red. Find out why each one is red,
fix the cause, and add a test of your own. About 15 minutes, alone or in pairs.

## The rules (the specification)

1. A coffee costs 5 francs.
2. Every 4th coffee is free; then the card starts over.
3. The card tells its stamps in a sentence: "You have 2 stamps."

## Open it

In VS Code: **File > Open Folder**, then pick `weekend-1/unit-testing/2-stamp-card/template` inside
your `activities` folder. Open this folder itself, so that the Testing view finds the tests. If
the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

- `stamp_card.py`: the code.
- `test_stamp_card.py`: its four tests.

## Your job

1. Run all the tests (the Testing view, or `python3 -m unittest -v` in a terminal). Two are red.
   For each one: failure or error?
2. Read each traceback from the bottom. Does it end in the test, or in the code it tests?
3. Whose fault is it, the test's or the code's? The rules above decide.
4. Fix the cause, in the code or in the test. Delete no test. Run all the tests again: all four
   pass.
5. Add a test of your own, for example: the 8th coffee is free too.

The five steps from the slides help: failure or error; the traceback from the bottom; the
debugger; guess the cause and check it; fix the cause and keep the test.

## Stuck? One hint per red test

<details><summary>test_message_after_two_coffees</summary>

An error: `AttributeError: 'StampCard' object has no attribute 'stamp'`. The trail ends in
`stamp_card.py`, in `message`. Compare the name there with the one `__init__` gives the card.
</details>

<details><summary>test_third_coffee_is_free</summary>

A failure: `AssertionError: 5 != 0`. The code charged 5 francs for the third coffee. Count again
with rule 2: which coffee is free? The trail ends in the test, and so does the cause.
</details>

## The solution

`solution/` holds the fixed files and one more test, `test_third_coffee_costs_5`. Open them with
**File > Open File** to compare.

The guides write `python3`. If that does not work on your laptop, type `python` instead.
