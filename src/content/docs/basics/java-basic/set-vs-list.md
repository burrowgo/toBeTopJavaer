---
title: "Set Vs List"
---

Both List and Set inherit from the `Collection` interface. Both are used to store a group of elements of the same type.

### List Characteristics:
Elements have an insertion order, and elements can be duplicated.

* **Ordered:** Elements are arranged in the order they are inserted.
* **Repeatable:** Multiple identical elements can be stored.

### Set Characteristics:
Elements have no insertion order, and elements cannot be duplicated.

* **Unordered:** Elements are not necessarily arranged in the order they are inserted.
* **Unique:** Duplicate elements are not allowed; only one copy of the same element is kept in a Set. Therefore, in some scenarios, a Set can be used for deduplication.

Note that when inserting elements into a Set, there must be a method to determine whether an element is a duplicate. This method is very important as it determines which elements can be stored in the Set.
