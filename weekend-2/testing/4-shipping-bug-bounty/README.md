# Shipping: a bug bounty

The online shop's shipping rules:

1. An order must be at least 10 francs. Smaller orders are refused, for members too.
2. Shipping costs 9 francs.
3. From 100 francs on, shipping is free.
4. Members always ship free.

The code in `template/shipping.py` follows these rules, and the intern wrote four tests for it.
Everything is green. Your job: tests that would notice if anyone ever broke the code. A check
plays eight wrong versions of the code against your tests and tells you how many of them your tests
catch.

You practise the strategies of the slides: one test for each answer the shop can give, tests on
both sides of every limit, and tests where two rules meet. On the way you see which lines of the
code your tests run.

## Your files, in `template/`

- `shipping.py`: the code, correct. `shipping(50, False)` is the shipping cost of a 50-franc order
  by a customer who is no member. Leave it as it is.
- `test_shipping.py`: the intern's four tests, and a place for yours.
- `check_my_tests.py`: our check of your tests. Run it; you need not read it.
- `show_coverage.py`: shows which lines of `shipping.py` your tests ran. Run it; you need not read
  it.

## Before you start

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/4-shipping-bug-bounty/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

Run every command in a terminal (**Terminal > New Terminal**). Run the tests and the two helpers once:

    python3 -m unittest -v
    python3 check_my_tests.py
    python3 show_coverage.py

The intern's tests are green, and they catch only 2 of the 8 wrong versions.

## Level 1: repair the intern's tests (10 minutes)

Three of the intern's four tests can never turn red. Find out why, and repair them. Then run the
three commands again: every line of `shipping.py` runs now, and the check says 5 of 8.

## Level 2: the limits (10 minutes)

Rules 1 and 3 change their answer at a limit, 10 francs and 100 francs. In `MyTests`, test both
sides of each limit: the last price below the limit, and the limit itself. The check should say 7
of 8.

## Level 3: where two rules meet (5 minutes)

Rules 1 and 4 meet when a member orders for less than 10 francs. What do the rules say? Test it.
The check should say 8 of 8.

## Questions to talk about

1. After level 1 every line of `shipping.py` ran, and three wrong versions still slipped through.
   What does "every line ran" tell you, then?
2. Only your test of level 3 caught one of the wrong versions. Who decides what should happen
   where two rules meet?

## Hints, only if you are stuck

- A test can never turn red when it checks nothing, when it compares the code with itself, or
  when unittest never runs it.
- A test that the shop refuses an order looks like this:

      def test_an_order_of_5_francs_is_refused(self):
          with self.assertRaises(ValueError):
              shipping(5, False)

- Prices go in steps of 5 Rappen, so the last order below 10 francs is 9.95 francs.

## Optional: the coverage view of VS Code

VS Code can mark the lines in the editor too. Install the coverage package once
(`python3 -m pip install coverage`), open the `template` folder on its own (File > Open Folder),
and in the Testing view choose "Run Tests with Coverage".
