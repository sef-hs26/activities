from dataclasses import dataclass


@dataclass
class Version:
    # TODO: give a version two fields: id, a whole number (int), and text, a text (str).
    pass


class Editor:
    """Keeps every saved version, the way Git keeps a commit for every change."""

    def __init__(self):
        # TODO: start with an empty list of versions, self.versions.
        pass

    # TODO: write the method get(self). It returns a copy of the versions, self.versions.copy(),
    #       so that nobody changes the editor's own list.

    # TODO: write the method save(self, text). It makes a new version numbered one more than
    #       the versions so far, Version(len(self.versions) + 1, text), appends it to
    #       self.versions and returns it.
