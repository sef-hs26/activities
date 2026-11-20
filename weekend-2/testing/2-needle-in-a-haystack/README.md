# Needle in a haystack

The online shop's rule: shipping costs 9 francs, and it is free from 100 francs on. The code in
`template/shipping.py` has one mistake. A script tries 1000 random orders. Does it find the
mistake?

You practise: random testing, and the one test a person thinks of.

## Your files, in `template/`

- `shipping.py`: the code, with one mistake. `shipping(50)` is the shipping cost of a 50-franc
  order.
- `random_check.py`: checks the rule on 1000 random orders between 10 and 500 francs. Run it; you
  need not read it.
- `test_shipping.py`: your tests. One is there as an example.

## Before you start

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/2-needle-in-a-haystack/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

Run every command in a terminal (**Terminal > New Terminal**).

## Step 1: let chance look for the mistake

    python3 random_check.py

## Step 2: give chance more tries

Open `random_check.py`, set `ROUNDS = 1000` near the top, and run it again: it now repeats the
check with 1000 other sets of 1000 random orders, which takes a few seconds. In how many rounds
does chance find the mistake?

## Step 3: think like a tester (3 minutes)

Where does the rule change its answer? Write one test for an order right there, and run your
tests:

    python3 -m unittest -v

## Step 4: fix the code (1 minute)

Change `shipping.py` until your test is green.

## Questions to talk about

1. How many of the random orders were exactly 100 francs? (`random_check.py` with `ROUNDS = 1`
   tells you.)
2. Random testing still has its uses. When would you let chance try a million orders?
