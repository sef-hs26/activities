"""Bikes come and go at two stations, Bahnhofplatz and Bellevue."""

from station import Bike, Station, Screen, Truck, CityDashboard

bahnhof = Station("Bahnhofplatz", 2)
bellevue = Station("Bellevue", 3)
bahnhof.attach(Screen())
# Level 2
bahnhof.attach(Truck())
# Level 3
dashboard = CityDashboard()
bahnhof.attach(dashboard)
bellevue.attach(dashboard)

bike7 = Bike(7, "city bike")
print("Bike 7 arrives at Bahnhofplatz.")
bahnhof.dock(bike7)
print("Bike 12 arrives at Bahnhofplatz.")
bahnhof.dock(Bike(12, "cargo bike"))
print("Bike 7 leaves Bahnhofplatz.")
bahnhof.undock(bike7)
print("Bike 7 arrives at Bellevue.")
bellevue.dock(bike7)
