"""The Gilded Rose's rooms: what a stay costs."""


def stay_price(nights, guests):
    """What a stay costs, in francs.
    nights: how many nights the guests stay.
    guests: how many guests share the room.
    Refused stay: raises ValueError.
    Example: stay_price(3, 2) is 240.
    """
    if guests > 4:
        raise ValueError("At most 4 guests.")
    per_night = 80
    if nights >= 7:
        per_night = 70
    if guests > 2:
        per_night = per_night + 20 * (guests - 2)
    return nights * per_night
