"""Three rides of the day and what they cost. Run it once your class is written."""

from fleet import Bike, day_total

rides = [Bike("Anna", 2), Bike("Ben", 4), Bike("Chiara", 3)]
for ride in rides:
    print(f"{ride.rider} rides {ride.hours} hours and pays {ride.price()} francs.")
print(f"Total of the day: {day_total(rides)} francs.")
