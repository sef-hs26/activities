"""Versions of a note to Anna: search, undo and approval at work."""

from editor import Editor

editor = Editor()
editor.save("Dear Anna, your car is raedy.")
newest = editor.save("Dear Anna, your car is ready.")
print("Saved version", newest.id, "with the typo fixed.")
print("The editor keeps", len(editor.get()), "versions.")
print("Looking up version 1:", editor.find_by_id(1))
editor.save("Dear Anna, your car is ready. Free upgrade!")
print("Does any version promise an upgrade?", editor.contains("upgrade"))
editor.undo()
print("After an undo, does any version promise an upgrade?", editor.contains("upgrade"))
editor.approve(2)
print("Is version 2 approved?", editor.find_by_id(2).approved)
