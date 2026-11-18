class Shop:
    """A bike shop and its opening hours."""

    def __init__(self, name):
        self.name = name

    def is_open(self, day, hour):
        """Return True when the shop is open on this day at this hour."""
        if day == "Sunday":
            return False
        # Level 1
        if day == "Saturday":
            return 8 <= hour < 16
        # Level 2
        if hour == 12:
            return False
        return 8 <= hour < 18


def website(shop, day, hour):
    """What the shop's website says."""
    if shop.is_open(day, hour):
        return f"{shop.name} is open."
    return f"{shop.name} is closed."


def app(shop, day, hour):
    """What the shop's phone app shows."""
    if shop.is_open(day, hour):
        return "OPEN"
    return "CLOSED"


# Level 3
def phone_bot(shop, day, hour):
    """What the phone bot answers to the question "Are you open?"."""
    if shop.is_open(day, hour):
        return "Yes, come by!"
    return "Sorry, we are closed right now."
