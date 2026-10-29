"""Tests for the coding kata. Run them with: python3 -m unittest -v"""

import unittest

from editor import Editor, EditorException


class TestStart(unittest.TestCase):

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


class TestLevel1Contains(unittest.TestCase):

    def test_a_word_in_an_old_version_is_found(self):
        editor = Editor()
        editor.save("Dear Anna, your car is raedy.")
        editor.save("Dear Anna, your car is ready.")
        self.assertTrue(editor.contains("raedy"))

    def test_a_word_only_in_the_last_of_three_versions_is_found(self):
        editor = Editor()
        editor.save("Dear Anna, your car is raedy.")
        editor.save("Dear Anna, your car is ready.")
        editor.save("Dear Anna, your car is ready. Free upgrade!")
        self.assertTrue(editor.contains("upgrade"))

    def test_an_absent_word_gives_false(self):
        editor = Editor()
        editor.save("Dear Anna, your car is ready.")
        editor.save("Dear Anna, your car is ready. Free upgrade!")
        self.assertFalse(editor.contains("discount"))


class TestLevel2Undo(unittest.TestCase):

    def test_undo_throws_the_newest_version_away(self):
        editor = Editor()
        first = editor.save("Dear Anna, your car is raedy.")
        second = editor.save("Dear Anna, your car is ready.")
        editor.save("Dear Anna, your car is ready. Free upgrade!")
        editor.undo()
        self.assertEqual(editor.get(), [first, second])

    def test_undo_with_nothing_to_undo_raises_editor_exception(self):
        editor = Editor()
        with self.assertRaises(EditorException):
            editor.undo()

    def test_after_an_undo_the_removed_number_raises_editor_exception(self):
        editor = Editor()
        editor.save("Dear Anna, your car is ready.")
        editor.save("Dear Anna, your car is ready. Free upgrade!")
        editor.undo()
        with self.assertRaises(EditorException):
            editor.find_by_id(2)


class TestLevel3Approve(unittest.TestCase):

    def test_a_new_version_is_not_approved(self):
        editor = Editor()
        version = editor.save("Dear Anna, your car is ready.")
        self.assertFalse(version.approved)

    def test_approve_sets_only_that_version(self):
        editor = Editor()
        editor.save("Dear Anna, your car is raedy.")
        editor.save("Dear Anna, your car is ready.")
        editor.approve(2)
        self.assertTrue(editor.find_by_id(2).approved)
        self.assertFalse(editor.find_by_id(1).approved)

    def test_approving_an_unknown_number_raises_editor_exception(self):
        editor = Editor()
        editor.save("Dear Anna, your car is ready.")
        with self.assertRaises(EditorException):
            editor.approve(7)
