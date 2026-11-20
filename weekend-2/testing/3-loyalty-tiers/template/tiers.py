"""The online shop's loyalty tiers.

A customer's tier depends on the francs they spent this year:
under 500 francs Bronze, from 500 francs Silver, from 2000 francs Gold.
"""


def tier(spent):
    """The tier of a customer who spent `spent` francs this year."""
    if spent >= 2000:
        return "Gold"
    if spent >= 500:
        return "Silver"
    return "Bronze"
