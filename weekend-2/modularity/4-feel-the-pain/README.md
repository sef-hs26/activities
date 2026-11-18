# Feel the pain

The bike station at Bahnhofplatz has a screen that shows how many docks are taken, and it calls a
truck when it is full. Both are written into the station's method `dock`. Now the bike club has a
wish too.

You practise: noticing what it costs when one class does everybody's job. The next kata shows
another way.

## Your files, in `template/`

- `station.py`: the station. Every wish so far went into `dock`.
- `demo.py`: two bikes arrive.
- `test_station.py`: the tests. Run them; you need not read them.

## What to do (about 10 minutes)

1. Run the demo and read what the station prints.
2. The bike club wants to know whenever a cargo bike arrives. Telling the club is just printing a
   message, as the screen and the truck do: "Bike club: a cargo bike is at Bahnhofplatz." Add the
   two lines to `dock`, where the `# TODO` is (an `if` and a `print`), then run the demo and the
   tests again.
3. Next, two more wishes arrive: the city wants a dashboard of all its stations, and an
   insurance company wants a note of every e-bike that arrives. Where would their lines go?
   Think it over, alone or with your neighbour.

## Run it

In VS Code: **File > Open Folder**, then pick the folder
`weekend-2/modularity/4-feel-the-pain/template` inside your `activities` folder. Open this folder
itself, so that the Testing view finds the tests. If the Testing view offers
**Configure Python Tests** instead, leave that button alone and look at the top of the Explorer:
it names the open folder, which must be `TEMPLATE`.

Then, in a terminal (**Terminal > New Terminal**):

    python3 demo.py
    python3 -m unittest -v

The tests also run in the Testing view: the beaker on the left, then its play button.

## Questions to talk about

1. Every wish so far changed `dock`. Who has to check the whole station again after each new wish?
2. The screen, the truck and the bike club belong to three different teams. Who owns `dock` now?
