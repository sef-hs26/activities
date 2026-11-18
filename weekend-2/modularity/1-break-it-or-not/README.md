# Break it or not?

Your team looks after the bike station's code, in `station.py`. Another team wrote the phone app,
in `app.py`, which shows how many bikes a station has. Before you change your class, you want to
know which of your changes the app team will notice.

You practise: telling the methods that other code calls, which are a promise, from everything
behind them, which you may change. The car rental's web app works the same way: it calls methods
such as `company.bookings.add(...)` and `company.customers.find_by_id(...)`.

## Your files, in `template/`

- `station.py`: your team's code.
- `app.py`: the app team's code. Leave it as it is.
- `test_station.py`: the app team's tests. Run them; you need not read them.

## Step 1: predict (3 minutes)

Four changes to `station.py` are proposed. For each one, write down "breaks the app" or "the app
still works".

1. Rename the method `count` to `number_of_bikes`.
2. Rename the list `self.bikes` to `self.parked`, everywhere inside the class.
3. Add a method `is_empty()` that returns True when no bike is docked.
4. Make `dock` ask for a dock number too: `def dock(self, bike, dock_number):`.

## Step 2: try (7 minutes)

Make the changes one at a time. After each one, run the app and the tests. Undo a change that
breaks the app (Ctrl+Z, or Cmd+Z on a Mac) before you try the next one.

## Run it

In VS Code: **File > Open Folder**, then pick the folder
`weekend-2/modularity/1-break-it-or-not/template` inside your `activities` folder. Open this folder
itself, so that the Testing view finds the tests. If the Testing view offers
**Configure Python Tests** instead, leave that button alone and look at the top of the Explorer:
it names the open folder, which must be `TEMPLATE`.

Then, in a terminal (**Terminal > New Terminal**):

    python3 app.py
    python3 -m unittest -v

The tests also run in the Testing view: the beaker on the left, then its play button.

## Questions to talk about

1. Which changes broke the app, and what do they have in common?
2. The app reads `bahnhof.name` directly. Could your team rename it to `self.title` without asking
   the app team?
