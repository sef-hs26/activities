"""Check your tests in test_tiers.py.

Your tests run on the correct rules and on five wrong versions hidden in this file. Good tests
pass on the correct rules and catch every wrong version: on each one, at least one test turns red.

Run it with:  python3 check_my_tests.py
You need not read this file.
"""

import importlib
import sys
import types
import unittest

CODE_MODULE = "tiers"
TEST_MODULE = "test_tiers"

CORRECT = '''
def tier(spent):
    if spent >= 2000:
        return "Gold"
    if spent >= 500:
        return "Silver"
    return "Bronze"
'''

GOLD = '''    if spent >= 2000:
        return "Gold"
'''
SILVER = '''    if spent >= 500:
        return "Silver"
'''

# Each wrong version is the correct code with one small change: what it does, old text, new text.
WRONG_VERSIONS = [
    ("makes a customer Silver only from 501 francs", "spent >= 500", "spent > 500"),
    ("makes a customer Gold only from 2001 francs", "spent >= 2000", "spent > 2000"),
    ("checks Silver before Gold, so that nobody is ever Gold", GOLD + SILVER, SILVER + GOLD),
    ("makes a customer Silver only from 1000 francs", "spent >= 500", "spent >= 1000"),
    ("makes everyone Bronze", "def tier(spent):\n", "def tier(spent):\n    return \"Bronze\"\n"),
]

SPECIAL = ("setUp", "tearDown", "setUpClass", "tearDownClass")


def code_version(old=None, new=None):
    """The correct code, or the correct code with one change, as a module."""
    source = CORRECT
    if old is not None:
        if old not in source:
            raise RuntimeError("check_my_tests.py is broken: a wrong version does not apply")
        source = source.replace(old, new, 1)
    module = types.ModuleType(CODE_MODULE)
    exec(source, module.__dict__)
    return module


def run_tests(module):
    """Run the tests on one version of the code.

    Gives the tests' module, the number of tests that ran, and the names of those that turned red.
    """
    sys.modules[CODE_MODULE] = module
    sys.modules.pop(TEST_MODULE, None)
    tests = importlib.import_module(TEST_MODULE)
    suite = unittest.defaultTestLoader.loadTestsFromModule(tests)
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
    except SyntaxError as error:
        print("Python cannot read " + TEST_MODULE + ".py: line", error.lineno, "-", error.msg)
        return 1
    except Exception as error:
        print(TEST_MODULE + ".py does not run:", type(error).__name__ + ":", error)
        return 1

    print("Checking your tests in " + TEST_MODULE + ".py ...")
    print()
    if count == 0:
        print("There are no tests in " + TEST_MODULE + ".py yet.")
        return 0
    if wrong_tests:
        print("Careful:", len(wrong_tests), "of your", count, "tests fail on the correct rules.")
        print("So these tests are wrong themselves. Read the rules again and fix them:")
        for name in sorted(wrong_tests):
            print("   ", name)
    else:
        print("All", count, "of your tests pass on the correct rules. Good: they agree with the rules.")
    for name in never_run(tests):
        print("Note:", name, "never runs. unittest runs only methods whose names start with test_.")
    print()

    caught = 0
    lines = []
    for text, old, new in WRONG_VERSIONS:
        _, _, red = run_tests(code_version(old, new))
        if red - wrong_tests:
            caught = caught + 1
            lines.append("  caught:     the version that " + text)
        else:
            lines.append("  NOT caught: the version that " + text)
    print("We hid", len(WRONG_VERSIONS), "wrong versions of the code. Your tests catch", caught, "of them:")
    for line in lines:
        print(line)
    print()
    if caught < len(WRONG_VERSIONS):
        print("For each version that is NOT caught, write a test that this version would fail.")
        print("Then run your tests and this check again.")
    elif wrong_tests:
        print("Fix the tests that are wrong, then run this check again.")
    else:
        print("Your tests catch every wrong version. Well done!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
