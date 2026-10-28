# Bike fleet

A bike rental in town rents normal bikes, e-bikes and cargo bikes, each at its own price. At
closing time one function adds up the day's rides, whatever the kind of bike. New kinds of bikes
keep arriving, and that function should never need a change.

You practise: subclasses, `super()`, and one loop that works for every kind of bike. The car
rental's customers and cars are dataclasses too, and its late fees may one day depend on the type
of car, the way they depend on the kind of bike here.

## Easy: class skeleton (about 10 minutes)

Open `easy/template/fleet.py`: it holds the skeleton of the class `Bike` and of the function
`day_total`. Where the `# TODO` comments are, give a `Bike` its two fields, `rider` and `hours`,
and its method `price`, 2 francs an hour; then write `day_total`, which adds up the prices of the
day's rides. Once you are done, run the demo and the tests.

## Medium: toy kata (about 10 minutes)

Open `medium/template/fleet.py`: the easy kata solved, with two new kinds of bikes. Where the
`# TODO` comments are, give each kind its own `price` method:

- `EBike`: the normal bike price, `super().price()`, plus 3 francs for charging.
- `CargoBike`: 5 francs an hour.

## Hard: coding kata (about 25 minutes)

Start from `hard/template/fleet.py`, the toy kata solved. Three change requests arrive, one after
the other:

1. Tandems arrive: a `Tandem` costs twice the price of a normal bike, and `day_total` must count
   tandems without any change.
2. Late returns cost extra: `late_fee(hours_late)` is 5 francs for every hour late, written once
   in `Bike` for every kind of bike.
3. Cargo bikes block the shop when they come back late: their late fee is 10 francs an hour, and
   every other kind of bike keeps 5.

## Run it

In the folder you work in, for example `easy/template`:

    python3 demo.py
    python3 -m unittest -v

## Questions to talk about

1. Why did `day_total` need no change when the tandems arrived?
2. The boss now wants e-bikes to pay 8 francs an hour late. Where does that change go, and what
   stays as it is?
