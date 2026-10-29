# Undo editor

A tiny editor writes notes to customers. Every save keeps a numbered version, the way Git keeps a
commit for every change. Other code reaches the versions only through the editor's methods.

You practise: a dataclass for one version, a class that keeps the list of versions, and raising
the editor's own exception.
The car rental keeps its customers and its cars in the same way.

## Easy: class skeleton (about 10 minutes)

Open `easy/template/editor.py`: it holds the skeleton of two classes. Where the `# TODO` comments
are, give a `Version` its two fields, give the `Editor` an empty list of versions, and write its
two methods: `get`, and `save`, which numbers the versions 1, 2, 3. Once you are done, run the
demo and the tests.

## Medium: toy kata (about 10 minutes)

Open `medium/template/editor.py`: the easy kata solved, plus the editor's own exception,
`EditorException`. Write the method `find_by_id(id)` where the `# TODO` comments are: it returns
the version with this number, and raises `EditorException` when no version has it.

## Hard: coding kata (about 25 minutes)

Open `hard/template/editor.py`: it is the toy kata, solved. Then the team asks for more:

1. Search: `contains(word)` answers True when any saved version contains the word, and False
   otherwise.
2. Undo: `undo()` throws the newest version away, and raises `EditorException` when there is
   nothing to undo.
3. Approval: the team lead approves each note before it goes out, so a `Version` gets `approved`
   (False at first), and `approve(id)` sets it to True and refuses an unknown number.

## Run it

Inside a variant folder, for example `easy/template`:

    python3 demo.py
    python3 -m unittest -v

## Questions to talk about

1. `get()` hands out a copy of the list. What could go wrong if it handed out the list itself?
2. `approve` calls `find_by_id`, so it refuses an unknown number without any code of its own.
   Where else could the editor use `find_by_id`?
