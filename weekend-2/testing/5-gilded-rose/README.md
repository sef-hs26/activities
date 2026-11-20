# The Gilded Rose: a safety net

The Gilded Rose is a small inn that also sells goods. Every night a program updates the stock: each
item gets one day older, and its quality goes up or down. Leeroy, who wrote the program, has moved
on. Now Allison, the innkeeper, wants to sell a new kind of item. Before you change code that
someone else wrote, you pin down what it does today, with tests: a safety net.

You practise: tests that say what code you did not write does today; then a change, with those
tests watching. Task 5 asks the same of your car rental.

## The rules, as Allison tells them

1. Every item has a sell date and a quality. `sell_in` is the number of days left to sell the item.
   Every night, both go down by 1.
2. Once the sell date has passed, quality goes down twice as fast.
3. Aged Brie gets better with age: its quality goes up.
4. Quality is never below 0 and never above 50.
5. Sulfuras, Hand of Ragnaros, is legendary: it never has to be sold, and its quality, 80, never
   changes.

The rules leave some questions open. The code answers every one of them, and what it does today is
what the inn's customers know.

## Your files, in `template/`

- `gilded_rose.py`: the program. `update_quality` runs every night. You change it only in level 3.
  Leave the class `Item` as it is: other programs of the inn use it.
- `test_gilded_rose.py`: your tests. The class `SafetyNet` holds one example test. Your tests of
  levels 1 and 2 go there, those of level 3 into the class `ConjuredItems`.
- `try_it.py`: asks the code what one night does to an item, and prints the answer as a test. Run
  it; you need not read it.
- `check_my_tests.py`: the check you know from kata 4. It makes 8 careless edits, each in a copy of
  the code, and counts how many of them your safety net catches. Run it; you need not read it.

## Run it

In VS Code: **File > Open Folder**, then pick the folder `weekend-2/testing/5-gilded-rose/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the tests.
If the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

Then, in a terminal (**Terminal > New Terminal**):

    python3 -m unittest -v
    python3 try_it.py
    python3 check_my_tests.py

The example test is green, and it catches 1 of the 8 careless edits.

`try_it.py` asks three questions: the item (type 2 for Aged Brie), its `sell_in` and its `quality`.
Then it says what the code did in one night, and prints the same as a test:

    def test_aged_brie_sell_in_2_quality_0(self):
        item = Item("Aged Brie", 2, 0)
        GildedRose([item]).update_quality()
        self.assertEqual(item.sell_in, 1)
        self.assertEqual(item.quality, 1)

Copy it into the class `SafetyNet`, below the example test, indented like it.

## Level 1: one test per kind of item (about 10 minutes)

With `try_it.py`, ask the code about Aged Brie (`sell_in` 2, `quality` 0) and about Sulfuras, Hand
of Ragnaros (`sell_in` 5, `quality` 80). Copy both tests into `SafetyNet`. Run the tests and the
check: 3 of 8.

## Level 2: the edges (about 10 minutes)

The rules change their answer at the sell date, at quality 0 and at quality 50. Ask the code at each
edge, copy each test, and run the check again, until it says 8 of 8:

- an item on the night its sell date passes (`sell_in` 0), and on the night before (`sell_in` 1);
- Aged Brie on the night its sell date passes;
- an item at quality 0;
- Aged Brie at quality 50.

Did the code surprise you anywhere?

## Level 3: Conjured items (about 10 minutes)

Allison's new rule: Conjured items lose quality twice as fast as normal items, 2 a night, and 4 once
the sell date has passed.

1. Ask `try_it.py` about a Conjured Mana Cake (`sell_in` 3, `quality` 6). Today's code knows no
   Conjured items and treats the cake like any other item. Copy the test into the class
   `ConjuredItems`, and change its expected quality to what the new rule says.
2. Do the same for `sell_in` 0 and `quality` 10.
3. Run the tests: your two new tests are red. Change `update_quality` in `gilded_rose.py` until
   every test is green, those of `SafetyNet` too.

## Level 4, optional: tidy up

Rewrite `update_quality` so that each rule sits in one place. Run the tests after every change: as
long as they all stay green, the inn sees no difference.

## Questions to talk about

1. Once its sell date has passed, Aged Brie gains 2 a night. The rules never said so. Is it a
   mistake? Who decides, and what should your tests say until then?
2. In level 3, in how many places did you change the code? What would have told you if you had
   missed one?

## Hints, only if you are stuck

- On the night the sell date passes, `sell_in` goes from 0 to -1.
- `item.name.startswith("Conjured")` is `True` for every name that begins with Conjured.
- Level 3: the code changes the quality in two places, once every night and once more after the
  sell date. Conjured items need both.
- Level 4: work out the change once (Aged Brie +1, Conjured -2, any other item -1), double it once
  the sell date has passed, then keep the quality between 0 and 50.

## Where this kata comes from

The Gilded Rose kata was created by Terry Hughes. This version follows Emily Bache's collection,
https://github.com/emilybache/GildedRose-Refactoring-Kata, published under the MIT licence in
`LICENSE.txt`. Cut down for SEF to three kinds of items and the Conjured ones, after the Python
version that Omar Hammoud wrote for SEF HS25.
