from dataclasses import dataclass


# The editor's own kind of error, as RentalException is the car rental's.
class EditorException(Exception):
    pass


@dataclass
class Version:
    id: int
    text: str
    approved: bool = False  # Level 3


class Editor:
    """Keeps every saved version, the way Git keeps a commit for every change."""

    def __init__(self):
        self.versions = []

    def get(self):
        """Return a copy of the versions, so that nobody changes the editor's own list."""
        return self.versions.copy()

    def save(self, text):
        """Keep the text as a new version: versions are numbered 1, 2, 3."""
        version = Version(len(self.versions) + 1, text)
        self.versions.append(version)
        return version

    def find_by_id(self, id):
        for version in self.versions:
            if version.id == id:
                return version
        raise EditorException(f"There is no version {id}.")

    # Level 1
    def contains(self, word):
        for version in self.versions:
            if word in version.text:
                return True
        return False

    # Level 2
    def undo(self):
        """Throw the newest version away."""
        if self.versions == []:
            raise EditorException("Nothing to undo.")
        self.versions.pop()

    # Level 3
    def approve(self, id):
        version = self.find_by_id(id)  # refuses an unknown number
        version.approved = True
