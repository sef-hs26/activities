"""Check your safety net: the tests in the class SafetyNet of test_gilded_rose.py.

Your tests run on today's code and on eight copies of it, hidden in this file, each with one
careless edit. A good safety net passes on today's code and catches every edit: on each copy, at
least one test turns red. The tests of the class ConjuredItems are not checked here.

Run it with:  python3 check_my_tests.py
You need not read this file.
"""

import importlib
import sys
import types
import unittest

CODE_MODULE = "gilded_rose"
TEST_MODULE = "test_gilded_rose"
NET = "SafetyNet"

CORRECT = '''
class Item:
    def __init__(self, name, sell_in, quality):
        self.name = name
        self.sell_in = sell_in
        self.quality = quality


class GildedRose:
    def __init__(self, items):
        self.items = items

    def update_quality(self):
        for item in self.items:
            if item.name != "Sulfuras, Hand of Ragnaros":
                if item.name == "Aged Brie":
                    item.quality = item.quality + 1
                else:
                    item.quality = item.quality - 1
                item.sell_in = item.sell_in - 1
                if item.sell_in < 0:
                    if item.name == "Aged Brie":
                        item.quality = item.quality + 1
                    else:
                        item.quality = item.quality - 1
                if item.quality < 0:
                    item.quality = 0
                if item.quality > 50:
                    item.quality = 50
'''

AFTER_THE_SELL_DATE = '''                if item.sell_in < 0:
                    if item.name == "Aged Brie":
                        item.quality = item.quality + 1
                    else:
                        item.quality = item.quality - 1
'''
ONLY_AGED_BRIE = '''                if item.sell_in < 0:
                    if item.name == "Aged Brie":
                        item.quality = item.quality + 1
'''
ONLY_THE_OTHERS = '''                if item.sell_in < 0:
                    if item.name != "Aged Brie":
                        item.quality = item.quality - 1
'''
NEVER_BELOW_0 = '''                if item.quality < 0:
                    item.quality = 0
'''
NEVER_ABOVE_50 = '''                if item.quality > 50:
                    item.quality = 50
'''

# Each careless edit is today's code with one small change: what it does, old text, new text.
WRONG_VERSIONS = [
    ("lets Aged Brie gain 2 a night", "item.quality = item.quality + 1", "item.quality = item.quality + 2"),
    ("lets items past their sell date lose only 1 a night", AFTER_THE_SELL_DATE, ONLY_AGED_BRIE),
    ("lets Aged Brie past its sell date gain only 1 a night", AFTER_THE_SELL_DATE, ONLY_THE_OTHERS),
    ("doubles the loss one night too early", "item.sell_in < 0", "item.sell_in <= 0"),
    ("lets quality drop below 0", NEVER_BELOW_0, ""),
    ("lets Aged Brie pass 50", NEVER_ABOVE_50, ""),
    ("treats Sulfuras like a normal item", '"Sulfuras, Hand of Ragnaros"', '"Sulfuras"'),
    ("forgets to count down sell_in", "                item.sell_in = item.sell_in - 1\n", ""),
]

SPECIAL = ("setUp", "tearDown", "setUpClass", "tearDownClass")


class NoNet(Exception):
    """The test file has no class SafetyNet."""


def code_version(old=None, new=None):
    """Today's code, or today's code with one careless edit, as a module."""
    source = CORRECT
    if old is not None:
        if old not in source:
            raise RuntimeError("check_my_tests.py is broken: a careless edit does not apply")
        source = source.replace(old, new, 1)
    module = types.ModuleType(CODE_MODULE)
    exec(source, module.__dict__)
    return module


def run_tests(module):
    """Run the safety net on one version of the code.

    Gives the tests' module, the number of tests that ran, and the names of those that turned red.
    """
    sys.modules[CODE_MODULE] = module
    sys.modules.pop(TEST_MODULE, None)
    tests = importlib.import_module(TEST_MODULE)
    net = getattr(tests, NET, None)
    if not (isinstance(net, type) and issubclass(net, unittest.TestCase)):
        raise NoNet()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(net)
    result = unittest.TestResult()
    suite.run(result)
    red = set()
    for test, _ in result.failures + result.errors:
        red.add(test.id().split(".")[-1])
    return tests, result.testsRun, red


def never_run(tests):
    """Methods of the test classes that unittest never runs: their names do not start with test."""
    names = []
    for value in list(vars(tests).values()):
        if isinstance(value, type) and issubclass(value, unittest.TestCase) \
                and value.__module__ == TEST_MODULE:
            for name, member in vars(value).items():
                if callable(member) and not name.startswith("test") \
                        and not name.startswith("_") and name not in SPECIAL:
                    names.append(name)
    return sorted(names)


def main():
    try:
        tests, count, wrong_tests = run_tests(code_version())
    except NoNet:
        print(TEST_MODULE + ".py has no class " + NET + ". Your tests of levels 1 and 2 go there.")
        return 1
    except SyntaxError as error:
        print("Python cannot read " + TEST_MODULE + ".py: line", error.lineno, "-", error.msg)
        return 1
    except Exception as error:
        print(TEST_MODULE + ".py does not run:", type(error).__name__ + ":", error)
        return 1

    print("Checking your safety net: the tests in the class " + NET + " ...")
    print()
    if count == 0:
        print("There are no tests in the class " + NET + " yet.")
        return 0
    if wrong_tests:
        print("Careful:", len(wrong_tests), "of your", count, "tests fail on today's code.")
        print("A safety net says what the code does today. Ask the code with try_it.py, then fix:")
        for name in sorted(wrong_tests):
            print("   ", name)
        if any("conjured" in name.lower() for name in wrong_tests):
            print("Tests of the new rule for Conjured items go into the class ConjuredItems.")
    elif count == 1:
        print("Your test passes on today's code. Good: it says what the code does.")
    else:
        print("All", count, "of your tests pass on today's code. Good: they say what it does.")
    for name in never_run(tests):
        print("Note:", name, "never runs. unittest runs only methods whose names start with test_.")
    print()

    caught = 0
    lines = []
    for text, old, new in WRONG_VERSIONS:
        _, _, red = run_tests(code_version(old, new))
        if red - wrong_tests:
            caught = caught + 1
            lines.append("  caught:     the edit that " + text)
        else:
            lines.append("  NOT caught: the edit that " + text)
    print("We made", len(WRONG_VERSIONS), "careless edits, each in a copy of the code.")
    print("Your safety net catches", caught, "of them:")
    for line in lines:
        print(line)
    print()
    if caught < len(WRONG_VERSIONS):
        print("For each edit that is NOT caught, find an item whose answer the edit would change,")
        print("ask the code with try_it.py, and copy the test into " + NET + ". Then check again.")
    elif wrong_tests:
        print("Fix the tests that fail on today's code, then run this check again.")
    else:
        print("Your safety net catches every careless edit. Well done!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
