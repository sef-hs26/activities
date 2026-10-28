# Bike-sharing station

A bike-sharing station has a fixed number of docks. When every dock is taken, the next rider is
turned away, and the app finds any docked bike by its number. Other code reaches the bikes only
through the station's methods.

You practise: a dataclass for one bike, a class that keeps the list of bikes and enforces its
rules, and raising the station's own exception. The car rental keeps its customers and its cars in
the same way.

## Easy: class skeleton (about 10 minutes)

Open `easy/template/station.py`: it holds the skeleton of two classes. Where the `# TODO` comments
are, give a `Bike` its two fields, give the `Station` its name, its number of docks and an empty
list of bikes, and write its two short methods, `get` and `dock`. Once you are done, run the demo
and the tests.

## Medium: toy kata (about 10 minutes)

Open `medium/template/station.py`: the easy kata solved, plus the station's own exception,
`StationException`, which `dock` now raises when the station is full. Write the method
`find_by_id` where the `# TODO` comments are: it returns the docked bike with this id, and raises
`StationException` when no bike has it.

## Hard: coding kata (about 25 minutes)

Start from `hard/template/station.py`, the toy kata solved. The app team sends three requests:

1. The app asks whether a model is at the station: `contains(model)` answers True or False.
2. The same bike can never be docked twice: `dock` refuses a bike whose id is already at the
   station.
3. Every bike counts its rides: a `Bike` gets `rides`, 0 at first, and `undock(id)` takes the bike
   out of the station, adds one ride and returns the bike; an unknown id is refused.

## Run it

Inside the folder you work in, for example `easy/template`:

    python3 demo.py
    python3 -m unittest -v

## Questions to talk about

1. Why does `get()` hand out a copy instead of the list itself?
2. `undock` calls `find_by_id`, so it refuses an unknown bike without any code of its own. What
   would have to change if the station kept its bikes in some other way?
