"""Tests for the class skeleton. Run them with: python3 -m unittest -v"""

import unittest

from editor import Editor, Version


class TestSkeleton(unittest.TestCase):

    def test_a_version_has_an_id_and_a_text(self):
        version = Version(1, "Dear Anna, your car is ready.")
        self.assertEqual(version.id, 1)
        self.assertEqual(version.text, "Dear Anna, your car is ready.")

    def test_a_new_editor_has_no_versions(self):
        self.assertEqual(Editor().get(), [])

    def test_save_numbers_the_versions_1_2_3(self):
        editor = Editor()
        editor.save("Dear Anna, your car is raedy.")
        editor.save("Dear Anna, your car is ready.")
        third = editor.save("Dear Anna, your car is ready at 9.")
        self.assertEqual(third, Version(3, "Dear Anna, your car is ready at 9."))

    def test_the_editor_keeps_every_saved_version(self):
        editor = Editor()
        first = editor.save("Dear Anna, your car is raedy.")
        second = editor.save("Dear Anna, your car is ready.")
        self.assertEqual(editor.get(), [first, second])

    def test_get_hands_out_a_copy(self):
        editor = Editor()
        editor.get().append(Version(1, "Dear Anna, your car is ready."))
        self.assertEqual(editor.get(), [])
