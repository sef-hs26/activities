"""The online shop's shipping: 9 francs, and free from 100 francs on."""


def shipping(total):
    """The shipping cost in francs for an order of `total` francs."""
    if total > 100:
        return 0
    return 9
