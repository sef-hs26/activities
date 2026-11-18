# Opening hours

Velo Huber, a bike shop, shows its customers whether it is open: on its website and in its phone
app. Last Sunday at 10:00 the app said OPEN and the website said closed; a customer trusted the
app and found the shop closed. The shop's opening hours are in `hours.py`, together with the code
of the website and of the app.

You practise: keeping one rule in one place, and letting everything else ask that place. The car
rental does the same with its bookings: the web app calls `company.bookings.add(...)`, and the
rules for a booking belong inside it.

## Easy: toy kata (about 10 minutes)

Open `easy/template/hours.py`. Find out why the app said OPEN last Sunday, and fix it so that it
can never happen again: whenever the opening hours change, the website and the app must both
follow. The fix is one line.

## Hard: coding kata (about 20 minutes)

Start from `hard/template/hours.py`, the toy kata solved. The shop sends three requests:

1. On Saturdays, we close at 16:00.
2. From Monday to Friday, we close for lunch from 12:00 to 13:00.
3. A phone bot answers the question "Are you open?": write a function
   `phone_bot(shop, day, hour)` that returns "Yes, come by!" or "Sorry, we are closed right now."

## Run it

In VS Code: **File > Open Folder**, then pick the folder you work in, for example
`weekend-2/modularity/2-opening-hours/easy/template` inside your `activities` folder.
Open this folder itself, so that the Testing view finds the tests. If the Testing view offers
**Configure Python Tests** instead, leave that button alone and look at the top of the Explorer:
it names the open folder, which must be `TEMPLATE`.

Then, in a terminal (**Terminal > New Terminal**):

    python3 demo.py
    python3 -m unittest -v

The tests also run in the Testing view: the beaker on the left, then its play button.

## Questions to talk about

1. Where in your company does one rule live in two places? Who notices when only one of them
   changes?
2. The phone bot needed no change to `Shop`. Why?
