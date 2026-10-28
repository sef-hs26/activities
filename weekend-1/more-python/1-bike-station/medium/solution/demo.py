from station import Bike, Station

station = Station("Bahnhofplatz", 3)
station.dock(Bike(7, "city bike"))
station.dock(Bike(12, "cargo bike"))
print(f"{station.name} has {station.docks} docks.")
print(f"{len(station.get())} bikes are docked.")
print("Looking up bike 12:", station.find_by_id(12))
