"""Two bikes arrive at Bahnhofplatz, and one leaves."""

from station import Bike, Station, Screen

bahnhof = Station("Bahnhofplatz", 2)
bahnhof.attach(Screen())

bike7 = Bike(7, "city bike")
print("Bike 7 arrives.")
bahnhof.dock(bike7)
print("Bike 12 arrives.")
bahnhof.dock(Bike(12, "cargo bike"))
print("Bike 7 leaves.")
bahnhof.undock(bike7)
