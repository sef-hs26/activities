from dataclasses import dataclass


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
