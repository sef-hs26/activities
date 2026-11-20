# Francs and Rappen

The shop team and the payment team each wrote one part of the online shop's checkout, and each
part passes its own test. Today the two parts work together for the first time.

You practise: an integration test, a test of two parts together.

## Your files, in `template/`

- `checkout.py`: the shop team's part, the payment team's part, and the line that wires them
  together.
- `test_checkout.py`: the two teams' tests, and a place for yours.

## Before you start

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/1-francs-and-rappen/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

Run every command in a terminal (**Terminal > New Terminal**).

## Step 1: run the teams' tests

    python3 -m unittest -v

Both are green.

## Step 2: test the two parts together (5 minutes)

Anna buys a book for 12.50 francs and a pen for 5 francs. The shop keeps prices in Rappen, so her
cart is `[1250, 500]`, and she should be charged 17.50 francs, which Python writes as 17.5. In
`TestTogether`, write a test: `checkout("Anna", [1250, 500])` should give
`"Charged 17.5 francs to Anna"`. Run the tests. How much does the payment service charge her?

## Step 3: fix it (2 minutes)

Find the line where the two parts meet, and make it hand over francs. Run the tests until all
three are green.

## Questions to talk about

1. Both teams' tests were green. Whose mistake was it, and which test could have found it?
2. In 1999 NASA lost the Mars Climate Orbiter: one team's software gave the thrust in pound-force
   seconds, and the other team's software expected newton-seconds. Each part worked. What went
   wrong?

## Hint, only if you are stuck

A test of the two parts together looks like this:

    def test_a_cart_of_12_50_and_5_francs_is_charged_17_5_francs(self):
        self.assertEqual(checkout("Anna", [1250, 500]), "Charged 17.5 francs to Anna")
