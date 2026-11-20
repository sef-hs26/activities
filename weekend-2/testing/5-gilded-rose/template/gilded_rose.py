"""The Gilded Rose, a small inn that also sells goods. Leave the class Item as it is."""


class Item:
    """One item on the shelf: its name, the days left to sell it (sell_in), its quality."""
    def __init__(self, name, sell_in, quality):
        self.name = name
        self.sell_in = sell_in
        self.quality = quality


class GildedRose:
    """The inn's stock. update_quality runs every night: each item gets one day older."""
    def __init__(self, items):
        self.items = items

    def update_quality(self):
        for item in self.items:
            if item.name != "Sulfuras, Hand of Ragnaros":
                if item.name == "Aged Brie":
                    item.quality = item.quality + 1
                else:
                    item.quality = item.quality - 1
                item.sell_in = item.sell_in - 1
                if item.sell_in < 0:
                    if item.name == "Aged Brie":
                        item.quality = item.quality + 1
                    else:
                        item.quality = item.quality - 1
                if item.quality < 0:
                    item.quality = 0
                if item.quality > 50:
                    item.quality = 50
