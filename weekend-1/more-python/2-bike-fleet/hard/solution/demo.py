"""Four rides of the day, what they cost, and two late returns."""

from fleet import Bike, CargoBike, EBike, Tandem, day_total

ebike = EBike("Ben", 2)
cargo = CargoBike("Chiara", 3)
rides = [Bike("Anna", 2), ebike, cargo, Tandem("Dario", 2)]
for ride in rides:
    print(f"{ride.rider} rides {ride.hours} hours and pays {ride.price()} francs.")
print(f"Total of the day: {day_total(rides)} francs.")
print(f"{ebike.rider} is 2 hours late with the e-bike: {ebike.late_fee(2)} francs extra.")
print(f"{cargo.rider} is 2 hours late with the cargo bike: {cargo.late_fee(2)} francs extra.")
