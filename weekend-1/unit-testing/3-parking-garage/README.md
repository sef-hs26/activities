# The parking garage: two red tests

A parking garage has a few places. Cars drive in and out, and when every place is taken, the
garage refuses the next car. Two of its four tests are red. Find out why each one is red, fix the
cause, and add a test of your own. About 20 minutes, alone or in pairs. The debugger helps here.

## The rules (the specification)

1. A new garage has all its places free.
2. A car that drives in takes a place; a car that drives out frees its place.
3. When every place is taken, the garage refuses the next car: it raises `GarageFull`.

## Open it

In VS Code: **File > Open Folder**, then pick `weekend-1/unit-testing/3-parking-garage/template`
inside your `activities` folder. Open this folder itself, so that the Testing view finds the
tests. If the Testing view offers **Configure Python Tests** instead, leave that button alone and
look at the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

- `garage.py`: the code. A car is its number plate, such as `"ZH 101"`.
- `test_garage.py`: its four tests.

## Your job

1. Run all the tests (the Testing view, or `python3 -m unittest -v` in a terminal). Two are red.
   For each one: failure or error?
2. Read each traceback from the bottom. Does it end in the test, or in the code it tests?
3. Watch each red test in the debugger: a breakpoint on the line the traceback names, then
   **Debug Test**, and look at the Variables.
4. Whose fault is it, the test's or the code's? The rules above decide. Fix the cause; delete
   no test. Run all the tests again: all four pass.
5. Add a test of your own, for example: a car drives out of a full garage, and the next car gets
   its place.

## Stuck? One hint per red test

<details><summary>test_full_garage_refuses_a_car</summary>

A failure: `AssertionError: GarageFull not raised`. The garage has 2 places and lets a third car
in. In the debugger, stop in `drive_in` for the third car: `len(self.cars)` is 2 and
`self.places` is 2. Is the garage full? What does the `if` ask?
</details>

<details><summary>test_a_car_drives_out</summary>

An error: `ValueError: list.remove(x): x not in list`. The trail ends in `garage.py`, in
`drive_out`. Stop there in the debugger and compare `plate` with `self.cars`. Which cars drove
in? A trail that ends in the code can still start with a mistake in the test.
</details>

## The solution

`solution/` holds the fixed files and one more test, `test_a_place_frees_up`. Open them with
**File > Open File** to compare.

The guides write `python3`. If that does not work on your laptop, type `python` instead.
