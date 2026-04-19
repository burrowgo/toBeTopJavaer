---
title: "Set Repetition"
---

In Java's `Set` collection framework, there are two primary implementations based on their underlying data structures: `HashSet` and `TreeSet`.

1.  **TreeSet**: Implemented as a binary tree (specifically a Red-Black Tree). Data in a `TreeSet` is automatically sorted. It does not allow `null` values.
2.  **HashSet**: Implemented using a hash table. Data in a `HashSet` is unordered. It allows at most one `null` value. 

Neither implementation allows duplicate values, functioning similarly to a unique constraint in a database.

### HashSet

In `HashSet`, most operations are performed by an underlying `HashMap`. When an element is added to a `HashSet`, its `hashCode()` is calculated. After perturbation and bitwise operations to determine its storage location, the `HashSet` checks if the spot is occupied. If empty, the element is added. If occupied, the `equals()` method is used to compare the new element with the existing one. If they are equal, the addition is skipped; otherwise, the element is stored in the next available bucket.

### TreeSet

`TreeSet` is built upon the `keySet()` of a `TreeMap`. `TreeMap` is implemented as a Red-Black Tree, which is a self-balancing binary search tree. This structure ensures that the height difference between left and right subtrees remains optimized for fast lookups.

`TreeMap` sorts its entries by key. When an element is inserted into a `TreeSet`, the `compareTo()` method is invoked. Therefore, elements stored in a `TreeSet` must implement the `Comparable` interface. Like all `Set` implementations, `TreeSet` prohibits duplicates, using the `compareTo()` method to determine if an element already exists.
