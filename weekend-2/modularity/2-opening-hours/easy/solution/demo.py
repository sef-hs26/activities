"""What the website and the app show at three moments of the week."""

from hours import Shop, website, app

velo = Shop("Velo Huber")


def show(day, hour):
    site = website(velo, day, hour)
    badge = app(velo, day, hour)
    print(f"{day} at {hour}:00. Website: {site} App: {badge}")


show("Monday", 10)
show("Monday", 19)
show("Sunday", 10)
