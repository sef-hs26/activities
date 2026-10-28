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

## What is inside

    weekend-1/                one folder per weekend
      more-python/            one folder per session
        1-example-kata/       one folder per kata or activity, numbered in the order we use them
          README.md           the guide: start here
          template/           the code you start from: work here
          solution/           a finished version: open it once you are done

Some katas come in an easy and a hard version, each with its own `template/` and `solution/`.

## How to work on a kata

1. Read its `README.md`. In VS Code, right-click the file and choose **Open Preview**.
2. Work in `template/`. The guide says how to run the code and its tests. To get a terminal in the
   right folder, right-click the folder and choose **Open in Integrated Terminal**.
3. Look at `solution/` once you think you are done. To compare your file with the solution, select
   both in the Explorer (hold Ctrl, or Cmd on a Mac), right-click and choose **Compare Selected**.

The guides write `python3`. If that does not work on your laptop, type `python` instead.

Your changes stay on your laptop. Commit and push only in your team's project repository on
GitLab. If `git pull` ever refuses to run because of your changes, ask a TA.
