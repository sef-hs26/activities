"""What the website, the app and the phone bot say at four moments of the week."""

from hours import Shop, website, app, phone_bot

velo = Shop("Velo Huber")


def show(day, hour):
    site = website(velo, day, hour)
    badge = app(velo, day, hour)
    print(f"{day} at {hour}:00. Website: {site} App: {badge}")
    # Level 3
    print(f"    Phone bot: {phone_bot(velo, day, hour)}")


show("Monday", 10)
show("Monday", 12)
show("Saturday", 17)
show("Sunday", 10)
