# The cloakroom: when a test goes red

Hang a coat, get a ticket. Show the ticket, get your coat back. This morning a colleague changed
the cloakroom's code, and now Ben cannot get his coat back. Two of its four tests are red. Find
out why with the five steps, fix the cause, and keep the tests.

We run this kata together in class: the slides show every step, and you do it on your laptop.
About 15 minutes.

## The rules (the specification)

1. Each coat gets the next ticket: 1, 2, 3, and so on.
2. Show a ticket: get its coat back.
3. A ticket with no coat is refused: the cloakroom raises `CloakroomError`.

## Open it

In VS Code: **File > Open Folder**, then pick `weekend-1/unit-testing/1-cloakroom/template` inside
your `activities` folder. Open this folder itself, so that the Testing view finds the tests. If
the Testing view offers **Configure Python Tests** instead, leave that button alone and look at
the top of the Explorer: it names the open folder, which must be `TEMPLATE`.

- `cloakroom.py`: the code under test.
- `test_cloakroom.py`: its four tests.

## The five steps

1. **Failure or error?** Open the Testing view (the beaker on the left) and click its play
   button to run all the tests. Or, in a terminal (**Terminal > New Terminal**):
   `python3 -m unittest -v`. Two tests are red. Which one is a failure (a check said no) and
   which one an error (something crashed before the check)?
2. **Read the traceback from the bottom.** Look at the error's message. The last line says what
   went wrong, the line above it where. Does the trail end in the test, or in the code it tests?
3. **Watch it in the debugger.** In `test_cloakroom.py`, click left of line 20: a red dot
   appears, the breakpoint. Right-click the small icon left of `def test_second_coat` (after a run,
   a red cross), or the test in the Testing view, and choose **Debug Test**. When it stops at the
   dot, press **Step Into** (the arrow down to a dot), then **Step Over**, and watch `ticket` and
   `hook` under Variables.
4. **Guess the cause, then check.** Say what you think goes wrong. Predict what one more Step
   Over will show, then press it. Does your guess also explain the failure?
5. **Fix the cause, keep the test.** Change one line of `cloakroom.py`. Run all the tests again:
   all four pass. Delete no test.

Then add a test of your own to `test_cloakroom.py`, for example: three coats, then ticket 3.

## Stuck? One hint per step

<details><summary>Step 1</summary>

`test_empty_cloakroom` is a failure: `AssertionError: CloakroomError not raised`. An empty
cloakroom should refuse ticket 1, and it refused nothing. `test_second_coat` is an error:
`cloakroom.CloakroomError: No coat for ticket 2`.
</details>

<details><summary>Step 2</summary>

The error's trail ends in `cloakroom.py`, line 30, in `collect`: the code under test. The test
called it at line 20 of `test_cloakroom.py`.
</details>

<details><summary>Step 3</summary>

At line 28, `ticket` is 2, and `hook` is `Hook(ticket=1, coat='yellow coat')`: the loop is at
the first hook.
</details>

<details><summary>Step 4</summary>

One more Step Over goes straight to line 30, the `raise`: the loop gives up after the first
hook. With no coats at all, the loop never runs, so nothing is raised: that is the failure.
</details>

<details><summary>Step 5</summary>

Move the `raise` line one step to the left, out of the `for` loop: then it runs only when no
hook matched.
</details>

## The solution

`solution/` holds the fixed `cloakroom.py` and the tests with one more, `test_third_coat`. Open
`solution/cloakroom.py` with **File > Open File** to compare.

The guides write `python3`. If that does not work on your laptop, type `python` instead.
