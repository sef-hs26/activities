"""Checks the shipping rule on 1000 random orders.

Run it with:  python3 random_check.py
The rule: shipping costs 9 francs, and it is free from 100 francs on.
The orders are random, and the same ones every time, so that a problem can be repeated.
Set ROUNDS to 1000 to repeat the whole check with 1000 other sets of random orders.
You need not read this file.
"""

import random

from shipping import shipping

ROUNDS = 1
ORDERS = 1000


def rule(total):
    """What the rule says shipping costs."""
    if total >= 100:
        return 0
    return 9


def one_round(seed):
    """Checks ORDERS random orders. Gives the orders that break the rule and the number of orders
    of exactly 100 francs."""
    random.seed(seed)
    problems = []
    exactly_100 = 0
    for i in range(ORDERS):
        total = random.randint(1000, 50000) / 100      # 10.00 to 500.00 francs, to the Rappen
        if total == 100:
            exactly_100 = exactly_100 + 1
        if shipping(total) != rule(total):
            problems.append(total)
    return problems, exactly_100


if ROUNDS == 1:
    problems, exactly_100 = one_round(2026)
    for total in problems:
        print("Problem: an order of", total, "francs pays", shipping(total), "francs shipping.")
    print("Checked", ORDERS, "random orders between 10 and 500 francs:", len(problems), "problems found.")
    print("Orders of exactly 100 francs among them:", exactly_100)
else:
    found = 0
    for r in range(ROUNDS):
        problems, exactly_100 = one_round(2026 + r)
        if problems:
            found = found + 1
    print("Checked", ROUNDS, "rounds of", ORDERS, "random orders each.")
    print("The mistake showed up in", found, "of the", ROUNDS, "rounds.")
