"""Two bikes arrive at Bahnhofplatz, and one leaves."""

from station import Bike, Station

bahnhof = Station("Bahnhofplatz", 2)
# TODO 3: attach a Screen to the station: bahnhof.attach(Screen())
#         and add Screen to the import line above.

bike7 = Bike(7, "city bike")
print("Bike 7 arrives.")
bahnhof.dock(bike7)
print("Bike 12 arrives.")
bahnhof.dock(Bike(12, "cargo bike"))
print("Bike 7 leaves.")
bahnhof.undock(bike7)
