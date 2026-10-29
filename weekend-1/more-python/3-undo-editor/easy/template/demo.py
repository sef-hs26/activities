"""Two versions of a note to Anna. Run it once your classes are written."""

from editor import Editor

editor = Editor()
editor.save("Dear Anna, your car is raedy.")
newest = editor.save("Dear Anna, your car is ready.")
print("Saved version", newest.id, "with the typo fixed.")
print("The editor keeps", len(editor.get()), "versions:")
for version in editor.get():
    print(version.id, version.text)
