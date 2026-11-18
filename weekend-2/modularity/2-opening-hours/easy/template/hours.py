# TODO: last Sunday at 10:00 the app said OPEN, while the website said closed.
#       Find out why, and fix it so that it can never happen again (one line).


class Shop:
    """A bike shop and its opening hours."""

    def __init__(self, name):
        self.name = name

    def is_open(self, day, hour):
        """Return True when the shop is open on this day at this hour."""
        if day == "Sunday":
            return False
        return 8 <= hour < 18


def website(shop, day, hour):
    """What the shop's website says."""
    if shop.is_open(day, hour):
        return f"{shop.name} is open."
    return f"{shop.name} is closed."


def app(shop, day, hour):
    """What the shop's phone app shows."""
    if 8 <= hour < 18:
        return "OPEN"
    return "CLOSED"
