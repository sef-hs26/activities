"""Tests for the toy kata. Run them with: python3 -m unittest -v"""

import unittest

from editor import Editor, EditorException


class TestFindById(unittest.TestCase):

    def test_finds_version_1(self):
        editor = Editor()
        first = editor.save("Dear Anna, your car is raedy.")
        editor.save("Dear Anna, your car is ready.")
        self.assertEqual(editor.find_by_id(1), first)

    def test_finds_version_2_of_three(self):
        editor = Editor()
        editor.save("Dear Anna, your car is raedy.")
        second = editor.save("Dear Anna, your car is ready.")
        editor.save("Dear Anna, your car is ready at 9.")
        self.assertEqual(editor.find_by_id(2), second)

    def test_an_unknown_number_raises_editor_exception(self):
        editor = Editor()
        editor.save("Dear Anna, your car is ready.")
        with self.assertRaises(EditorException):
            editor.find_by_id(7)

    def test_an_empty_editor_raises_editor_exception(self):
        editor = Editor()
        with self.assertRaises(EditorException):
            editor.find_by_id(1)
