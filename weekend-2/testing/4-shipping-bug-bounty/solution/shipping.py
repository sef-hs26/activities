"""The online shop's shipping rules.

1. An order must be at least 10 francs. Smaller orders are refused, for members too.
2. Shipping costs 9 francs.
3. From 100 francs on, shipping is free.
4. Members always ship free.
"""


def shipping(total, member):
    """The shipping cost in francs for an order of `total` francs. `member` is True or False."""
    if total < 10:
        raise ValueError("Orders start at 10 francs.")
    if member:
        return 0
    if total >= 100:
        return 0
    return 9
