# The taproom: tests first

The Gilded Rose also has a taproom. Allison, the innkeeper, wants a small program that says what an
order of drinks costs, and when the taproom must refuse it. Nobody has written it yet. Write it the
way you wrote the room prices in kata 6: for each rule, the test first.

You practise: the limits and their tests, as in kata 6; red, green, refactor, on your own this
time; a rule with an exception.

## Allison's rules for the taproom

1. A glass of beer costs 6 francs, a glass of lemonade 4.
2. From 6 glasses on, one glass of the order is free.
3. No beer for guests under 18: the taproom refuses the order. Lemonade is fine at any age.
4. At most 10 glasses an order: the taproom refuses a bigger order.

## The specification

`taproom.py` holds the specification of `order_price`, in its docstring: how it is called and what
it gives back. Its code is still empty: for now it says 0 francs for every order.

    def order_price(drink, glasses, age):
        """What an order costs, in francs.
        drink: "beer" or "lemonade".
        glasses: how many glasses the guest orders.
        age: the guest's age, in years.
        Refused order: raises ValueError.
        Example: order_price("beer", 2, 30) is 12.
        """
        return 0

So `order_price("beer", 2, 30)` is the price of 2 glasses of beer for a guest aged 30: 12 francs.

## Your files, in `template/`

- `taproom.py`: the specification of `order_price`; its code says 0 francs for every order. You
  write it, one test at a time.
- `test_taproom.py`: your tests. None yet: a comment marks where each level's tests go, and another
  shows how to test that the taproom refuses an order.
- `check_my_tests.py`: the check you know from katas 4 and 5. It runs your tests on ten wrong
  versions of the code, hidden in it, and counts how many your tests catch. Run it; you need not
  read it.

## Run it

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/7-taproom/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

Then, in a terminal (**Terminal > New Terminal**):

    python3 -m unittest -v
    python3 check_my_tests.py

## For every test: red, green, refactor

1. **Red.** Write one new test. Run the tests: the new one fails.
2. **Green.** Change `order_price` as little as you can, until every test passes.
3. **Refactor.** Tidy the code up if you can. Run the tests: still all green.

## First: the limits, two tests at each (about 5 minutes)

On paper, as kata 6 did for the room prices:

1. Draw each input: the two drinks; a line for the glasses; a line for the age, once for beer and
   once for lemonade.
2. Mark the limits: where another rule takes over.
3. At each limit, note two tests, one on each side. Each drink gets a test of its price.

That is your list of tests. Then write them one at a time, red first, level by level.

## Level 1: rules 1 and 2, the prices (about 10 minutes)

Below the comment of level 1, write a test that two beers, for a guest aged 30, cost 12 francs:

    def test_two_beers_cost_12(self):
        self.assertEqual(order_price("beer", 2, 30), 12)

Red, then green. Then one test each, red first: three lemonades cost 12 francs; six beers cost 30
francs, since one is free. Then five beers: 30 francs too, green at once. Keep it. Run the check:
your tests catch 4 of the 10 wrong versions.

## Level 2: rule 3, no beer under 18 (about 5 minutes)

Test both sides of the limit, each test red first unless it says otherwise:

1. A guest aged 17 gets no beer. Then a guest aged 18 gets one: green at once. Keep it.
2. A guest aged 15 gets a lemonade, for 4 francs. What does your code say?

Run the check: 8 of 10.

## Level 3: rule 4, at most 10 glasses (about 5 minutes)

An order of 11 glasses is refused. Then 10 beers cost 54 francs: green at once. Run the check
until it says 10 of 10.

## Level 4, optional: tidy up

Tidy `order_price` so that each rule sits in one place. Run the tests after every change: as long
as they all stay green, the taproom sees no difference.

## Questions to talk about

1. Which limits did you find? Which two tests sit at each?
2. What does your code charge for -1 glasses? Did Allison's rules say? Who decides, and what is
   your next test once she has?
3. Which of your tests were green at once? Why keep them?
4. Five beers cost 30 francs, and six beers cost 30 francs too. Is that what Allison wants?

## Hints, only if you are stuck

- Level 1: `return glasses * 6` makes the first test green. For lemonade, start with `price = 6`,
  and below it `if drink == "lemonade":` and, indented, `price = 4`. For the free glass, before the
  `return`: `if glasses >= 6:` and, indented, `glasses = glasses - 1`.
- Level 2: at the top, `if age < 18:` and below it, indented,
  `raise ValueError("No beer under 18.")`. The lemonade of the 15-year-old asks for more:
  `if drink == "beer" and age < 18:`.
- Level 3: the same shape as level 2, for `glasses > 10`.
- The check names each wrong version your tests miss. Find an order on which that version gives
  another answer, and write its test.

## The solution

`solution/` holds the code and the nine tests of levels 1 to 3. Open `solution/taproom.py` with
**File > Open File** to compare.

The guides write `python3`. If that does not work on your laptop, type `python` instead.
