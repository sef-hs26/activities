"""Two bikes arrive at Bahnhofplatz, which has two docks."""

from station import Bike, Station

bahnhof = Station("Bahnhofplatz", 2)
print("Bike 7 arrives.")
bahnhof.dock(Bike(7, "city bike"))
print("Cargo bike 12 arrives.")
bahnhof.dock(Bike(12, "cargo bike"))
