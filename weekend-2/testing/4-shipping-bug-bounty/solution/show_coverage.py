"""Shows which lines of shipping.py your tests ran.

Run it with:  python3 show_coverage.py
It runs your tests in test_shipping.py and marks every line of shipping.py that none of them ran.
It needs no install. VS Code shows the same in the editor with "Run Tests with Coverage", once the
coverage package is installed (python3 -m pip install coverage).
You need not read this file.
"""

import os
import sys
import trace
import unittest

CODE_FILE = "shipping.py"
TEST_MODULE = "test_shipping"


def lines_that_can_run(path):
    """The numbers of the lines of a file that hold code Python runs."""
    with open(path) as f:
        module = compile(f.read(), path, "exec")
    lines = set()
    todo = [module]
    while todo:
        code = todo.pop()
        for _, _, line in code.co_lines():
            if line is not None:
                lines.add(line)
        for const in code.co_consts:
            if hasattr(const, "co_lines"):
                todo.append(const)
    return lines


def run_tests():
    """Runs the tests. Gives the reason when the test file cannot be loaded, else None."""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromName(TEST_MODULE)
    if loader.errors:
        return loader.errors[-1].strip().splitlines()[-1]
    with open(os.devnull, "w") as quiet:
        unittest.TextTestRunner(stream=quiet).run(suite)
    return None


def main():
    try:
        with open(TEST_MODULE + ".py") as f:
            compile(f.read(), TEST_MODULE + ".py", "exec")
    except SyntaxError as error:
        print("Python cannot read " + TEST_MODULE + ".py: line", error.lineno, "-", error.msg)
        return 1
    tracer = trace.Trace(count=1, trace=0)
    try:
        problem = tracer.runfunc(run_tests)
    except Exception as error:
        problem = type(error).__name__ + ": " + str(error)
    if problem:
        print(TEST_MODULE + ".py does not run:", problem)
        return 1
    path = os.path.abspath(CODE_FILE)
    ran = set()
    for name, line in tracer.results().counts:
        if os.path.abspath(name) == path:
            ran.add(line)
    can_run = lines_that_can_run(CODE_FILE)
    with open(CODE_FILE) as f:
        source = f.read().splitlines()

    print("The lines of " + CODE_FILE + " that your tests never ran are marked.")
    print()
    missed = 0
    for number, text in enumerate(source, start=1):
        if number in can_run and number not in ran:
            print("never run ->  " + text)
            missed = missed + 1
        else:
            print("              " + text)
    print()
    if missed == 0:
        print("Your tests ran every line of " + CODE_FILE + ".")
    elif missed == 1:
        print("Your tests never ran 1 line of " + CODE_FILE + ".")
    else:
        print("Your tests never ran", missed, "lines of " + CODE_FILE + ".")
    return 0


if __name__ == "__main__":
    sys.exit(main())
