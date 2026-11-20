"""Ask the code what one night does to an item. It prints the answer as a test, too.

Run it with:  python3 try_it.py
You need not read this file.
"""

import re
import sys

KINDS = ["Elixir of the Mongoose", "Aged Brie", "Sulfuras, Hand of Ragnaros", "Conjured Mana Cake"]


def ask(question):
    """One answer, typed in the terminal."""
    try:
        return input(question).strip()
    except (EOFError, KeyboardInterrupt):
        print()
        print("try_it stopped.")
        sys.exit(1)


def ask_name():
    print("Which item? Type its number, or another name.")
    for number, name in enumerate(KINDS, start=1):
        print("  " + str(number) + "  " + name)
    while True:
        answer = ask("Item: ")
        if answer.isdigit():
            if 1 <= int(answer) <= len(KINDS):
                return KINDS[int(answer) - 1]
            print("Please type a number from 1 to " + str(len(KINDS)) + ", or a name.")
        elif answer:
            return answer


def ask_number(question):
    while True:
        answer = ask(question)
        if re.fullmatch(r"-?[0-9]+", answer):
            return int(answer)
        print("Please type a whole number, for example 10 or -1.")


def test_name(name, sell_in, quality):
    """A name for the test, from the item and its numbers: test_aged_brie_sell_in_0_quality_10."""
    words = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_") or "item"
    numbers = [str(n) if n >= 0 else "minus_" + str(-n) for n in (sell_in, quality)]
    return "test_" + words + "_sell_in_" + numbers[0] + "_quality_" + numbers[1]


def quoted(text):
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main():
    try:
        from gilded_rose import GildedRose, Item
    except SyntaxError as error:
        print("Python cannot read gilded_rose.py: line", error.lineno, "-", error.msg)
        return 1
    except Exception as error:
        print("gilded_rose.py does not run:", type(error).__name__ + ":", error)
        return 1

    name = ask_name()
    sell_in = ask_number("sell_in today: ")
    quality = ask_number("quality today: ")
    item = Item(name, sell_in, quality)
    try:
        GildedRose([item]).update_quality()
    except Exception as error:
        print("update_quality stops with an error:", type(error).__name__ + ":", error)
        return 1

    print()
    print(name)
    print("  today:            sell_in " + str(sell_in) + ", quality " + str(quality))
    print("  after one night:  sell_in " + str(item.sell_in) + ", quality " + str(item.quality))
    print()
    print("The same as a test, to copy into test_gilded_rose.py:")
    print()
    print("    def " + test_name(name, sell_in, quality) + "(self):")
    print("        item = Item(" + quoted(name) + ", " + str(sell_in) + ", " + str(quality) + ")")
    print("        GildedRose([item]).update_quality()")
    print("        self.assertEqual(item.sell_in, " + str(item.sell_in) + ")")
    print("        self.assertEqual(item.quality, " + str(item.quality) + ")")
    return 0


if __name__ == "__main__":
    sys.exit(main())
