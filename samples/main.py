#!/usr/bin/env python3
"""Модуль для проверки подсветки Python."""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass, field
from typing import Any, Iterable

API_URL = "https://api.example.com"
TIMEOUT: float = 2.5
PATTERN = re.compile(r"^(?P<key>\w+)=(?P<value>.+)$")


@dataclass(frozen=True)
class Item:
    """Элемент заказа."""

    id: int
    title: str
    price: float = 0.0
    tags: list[str] = field(default_factory=list)

    @property
    def is_free(self) -> bool:
        return self.price == 0


class Repository:
    count = 0

    def __init__(self, items: Iterable[Item] | None = None) -> None:
        self._items = {item.id: item for item in items or []}
        Repository.count += 1

    def __len__(self) -> int:
        return len(self._items)

    def find(self, *ids: int, **filters: Any) -> list[Item]:
        # Генератор списка с условием
        result = [self._items[i] for i in ids if i in self._items]
        if filters.get("free_only"):
            result = list(filter(lambda it: it.is_free, result))
        return result

    @staticmethod
    def parse(line: str) -> dict[str, str] | None:
        match = PATTERN.match(line)
        return match.groupdict() if match else None


async def fetch(item_id: int, *, retries: int = 3) -> Item:
    for attempt in range(retries):
        try:
            await asyncio.sleep(TIMEOUT * attempt)
            return Item(id=item_id, title=f"Item #{item_id:03d}", price=9.99)
        except (TimeoutError, ConnectionError) as exc:
            print(f"Попытка {attempt + 1} не удалась: {exc!r}")
        finally:
            pass
    raise RuntimeError("no luck")


if __name__ == "__main__":
    repo = Repository([Item(1, "Free", tags=["promo"]), Item(2, "Paid", 10)])
    print(len(repo), repo.find(1, 2, free_only=True), None, True, False, 0x1F, 1e-3)
    asyncio.run(fetch(42))
