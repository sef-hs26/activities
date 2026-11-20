# Loyalty tiers

The online shop gives its regular customers a tier, by the francs they spent this year:

- under 500 francs: Bronze
- from 500 francs: Silver
- from 2000 francs: Gold

The code in `template/tiers.py` follows these rules. Write tests that would notice if anyone broke
it. A check plays five wrong versions of the code against your tests and tells you how many of
them your tests catch.

You practise: one test for each kind of answer, then tests on both sides of every limit.

## Your files, in `template/`

- `tiers.py`: the code, correct. `tier(700)` gives `"Silver"`. Leave it as it is.
- `test_tiers.py`: your tests. One is there as an example.
- `check_my_tests.py`: our check of your tests. Run it; you need not read it.

## Before you start

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/3-loyalty-tiers/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

Run every command in a terminal (**Terminal > New Terminal**).

## Step 1: one test per tier (5 minutes)

The example checks a Bronze customer. Add a test for a Silver customer and one for a Gold
customer: copy the example, give the copy a new name, then change the francs and the tier. Run your
tests, then the check:

    python3 -m unittest -v
    python3 check_my_tests.py

Your tests are green, and they catch some of the wrong versions. Read which ones they miss.

## Step 2: both sides of every limit (5 minutes)

The tier changes at 500 and at 2000 francs. For each limit, test the last franc below it and the
limit itself. Run the check until it says 5 of 5.

## Questions to talk about

1. Two wrong versions move a limit by one franc. Why does a test at 700 francs miss them?
2. One wrong version checks Silver before Gold, so that nobody is ever Gold. Which of your tests
   caught it?
