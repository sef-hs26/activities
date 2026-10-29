from dataclasses import dataclass


# The editor's own kind of error, as RentalException is the car rental's.
class EditorException(Exception):
    pass


@dataclass
class Version:
    id: int
    text: str


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
        # TODO: go through self.versions and return the version whose id is this id.
        # TODO: after the loop, no version had it, so
        #       raise EditorException(f"There is no version {id}.")
        pass
