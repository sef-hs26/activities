"""Three rides of the day and what they cost."""

from fleet import Bike, CargoBike, EBike, day_total

rides = [Bike("Anna", 2), EBike("Ben", 2), CargoBike("Chiara", 3)]
for ride in rides:
    print(f"{ride.rider} rides {ride.hours} hours and pays {ride.price()} francs.")
print(f"Total of the day: {day_total(rides)} francs.")
