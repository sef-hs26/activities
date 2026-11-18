# The station reports

On the first weekend you wrote a bike-sharing station. Now others want to hear from it: a screen,
a truck, the city. The station tells everyone who listens, and it never needs to know who they
are.

You practise: the listener pattern. The station is a `Subject`: it keeps a list of listeners, and
`self.notify()` tells each of them. A listener is an `Observer`: it has a method
`update(self, station)`, which the station calls. You will build the same into the car rental.

## Easy: toy kata (about 10 minutes)

Open `easy/template/station.py` and `easy/template/demo.py`, and write where the `# TODO`
comments are:

1. In `dock`, tell everyone who listens: `self.notify()`.
2. A listener called `Screen`, whose `update` prints how many docks are taken, for example
   "Bahnhofplatz: 1 of 2 docks taken".
3. In `demo.py`, attach a `Screen` to the station.

## Hard: coding kata (about 20 minutes)

Start from `hard/template/`, the toy kata solved. Three requests arrive:

1. Taking a bike out updates the screen too.
2. The station calls the truck when it is full: "Truck: Bahnhofplatz is full, please collect
   bikes."
3. The city wants one dashboard for all its stations, which shows how many docks are taken at the
   station that changed: "City dashboard: Bellevue has 1 of 3 docks taken". Attach one dashboard
   to both stations of the demo.

For the truck and the dashboard, write a new listener each, below `Screen`, called `Truck` and
`CityDashboard` (the tests look for these names), and attach it in `demo.py`.

## Your files

In each folder you work in:

- `station.py`: the bikes, the station and its listeners.
- `demo.py`: bikes come and go.
- `test_station.py`: the tests. Run them; you need not read them.
- `patterns/observer.py`: `Subject` and `Observer`, the same file you will add to the car rental.
  You need not open it.

## Run it

In VS Code: **File > Open Folder**, then pick the folder you work in, for example
`weekend-2/modularity/5-station-reports/easy/template` inside your `activities` folder.
Open this folder itself, so that the Testing view finds the tests. If the Testing view offers
**Configure Python Tests** instead, leave that button alone and look at the top of the Explorer:
it names the open folder, which must be `TEMPLATE`.

Then, in a terminal (**Terminal > New Terminal**):

    python3 demo.py
    python3 -m unittest -v

The tests also run in the Testing view: the beaker on the left, then its play button.

## Questions to talk about

1. Which classes did you change for the truck and for the dashboard?
2. The dashboard listens to two stations. How does it know which one changed?
