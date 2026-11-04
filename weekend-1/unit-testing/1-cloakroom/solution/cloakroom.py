"""A cloakroom: hang a coat, get a ticket; show the ticket, get the coat back."""

from dataclasses import dataclass


class CloakroomError(Exception):
    pass


@dataclass
class Hook:
    ticket: int
    coat: str


class Cloakroom:

    def __init__(self):
        self.hooks = []

    def hang(self, coat):
        ticket = len(self.hooks) + 1
        self.hooks.append(Hook(ticket, coat))
        return ticket

    def collect(self, ticket):
        for hook in self.hooks:
            if hook.ticket == ticket:
                return hook.coat
        raise CloakroomError("No coat for ticket " + str(ticket))
