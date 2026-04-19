---
title: "Concurrentskiplistmap"
---

`ConcurrentSkipListMap` is a Map that internally uses a Skip List and supports sorting and concurrency. It is thread-safe. It is rarely used and is considered a niche data structure.

### Introduction to Skip List

A Skip List is a data structure that allows for fast queries within an ordered sequence.

In an ordinary ordered linked list, searching for an element requires traversing each node one by one starting from the head of the list until the node is found (as shown in Figure 1).

A Skip List can resolve this issue of long search times. Its element traversal is illustrated in Figure 2. A Skip List is a type of linked list that uses the concept of "trading space for time" to improve query efficiency.

### Main Differences between ConcurrentSkipListMap and ConcurrentHashMap:

a. **Underlying implementation differs:** `ConcurrentSkipListMap` is based on a Skip List, while `ConcurrentHashMap` is based on Hash buckets and Red-Black Trees.

b. **Sorting support:** `ConcurrentHashMap` does not support sorting, whereas `ConcurrentSkipListMap` does.