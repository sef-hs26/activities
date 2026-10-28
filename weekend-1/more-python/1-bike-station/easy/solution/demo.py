"""A station with three docks and two bikes. Run it once your classes are written."""

from station import Bike, Station

station = Station("Bahnhofplatz", 3)
station.dock(Bike(7, "city bike"))
station.dock(Bike(12, "cargo bike"))
print(f"{station.name} has {station.docks} docks.")
print(f"{len(station.get())} bikes are docked:")
for bike in station.get():
    print(f"bike {bike.id}, a {bike.model}")
