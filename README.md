# Software Engineering Fundamentals: activities

Katas and activities for the CAS module Software Engineering Fundamentals, ETH Zurich, autumn
semester 2026. New material appears here before each weekend.

## Get the activities (once)

1. Open VS Code. On the Welcome page, click **Clone Git Repository** (if the Welcome page is
   closed, open it with **Help > Welcome**).
2. Paste this address and press Enter:

       https://github.com/sef-hs26/activities

3. Choose a folder on your laptop, then click **Open** when VS Code asks.

To open the activities again later: **File > Open Folder**, then pick the `activities` folder.

No GitHub account is needed. Without Git, click the green **Code** button on this page and choose
**Download ZIP**.

## Update them (before each session)

In VS Code, open the Source Control view, click its **...** menu and choose **Pull**. In a
terminal, inside the `activities` folder, the same is:

    git pull

Your changes stay on your laptop. Commit and push only in your team's project repository on
GitLab. If `git pull` ever refuses to run because of your changes, ask a TA.

## What is inside

    weekend-1/                one folder per weekend
      more-python/            one folder per session
        1-bike-station/       one folder per kata or activity, numbered in the order we use them
          README.md           the guide: start here
          template/           the code you start from: work here
          solution/           the same files, finished: open them once you are done

Some katas come in levels, `easy/`, `medium/` and `hard/`, each with its own `template/` and
`solution/`. Start with the easy one. An activity without code has its guide, `README.md`, and our
answer, `solution.md`. An animation has its guide, `README.md`, and a page, `index.html`, that
opens in your browser.

## How to work on a kata

1. **Read the guide**, the kata's `README.md`, in your browser: open
   https://github.com/sef-hs26/activities and click through the folders.
2. **Open the folder you work in.** In VS Code: **File > Open Folder**, then the kata's `template`
   folder (in a kata with levels, `easy/template` and so on). The top of the Explorer now reads
   `TEMPLATE`.
3. **Run the code and its tests.** Open a terminal with **Terminal > New Terminal** and type the
   commands of the guide, for example:

       python3 demo.py
       python3 -m unittest -v

   The tests also run in the Testing view: the beaker on the left, then its play button. A green
   test passed, a red one did not.
4. **Change the code** as the guide asks, often where a `# TODO` comment is. Run the tests again.
5. **Compare with the solution** once you are done. `solution/` has the same files: open one with
   **File > Open File** (on a Mac, **File > Open...**).

If `python3` does not work on your laptop, type `python` instead.

If the Testing view offers **Configure Python Tests**, leave that button alone. Check that the top
of the Explorer reads `TEMPLATE`, or run the tests in the terminal.
