"""The online shop's checkout, written by two teams."""


# The shop team keeps every price in Rappen: 12.50 francs is 1250 Rappen.
def cart_total(prices):
    """The total of a cart, in Rappen."""
    total = 0
    for price in prices:
        total = total + price
    return total


# The payment team works in francs.
def charge(card, francs):
    """Charges an amount in francs to a card."""
    return "Charged " + str(francs) + " francs to " + card


# Today the two parts work together for the first time.
def checkout(card, prices):
    """Charges the total of the cart to the card."""
    return charge(card, cart_total(prices) / 100)    # Rappen to francs
