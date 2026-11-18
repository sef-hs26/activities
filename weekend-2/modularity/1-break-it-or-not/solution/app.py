"""The phone app, written by another team. Leave it as it is."""

from station import Bike, Station

bahnhof = Station("Bahnhofplatz")
bahnhof.dock(Bike(7, "city bike"))
bahnhof.dock(Bike(12, "cargo bike"))
print(f"The app shows: {bahnhof.name} has {bahnhof.count()} bikes.")
