"""Two versions of a note to Anna: the editor keeps both."""

from editor import Editor

editor = Editor()
editor.save("Dear Anna, your car is raedy.")
newest = editor.save("Dear Anna, your car is ready.")
print("Saved version", newest.id, "with the typo fixed.")
print("The editor keeps", len(editor.get()), "versions.")
print("Looking up version 1:", editor.find_by_id(1))
