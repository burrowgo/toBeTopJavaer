---
title: "Arraylist Vs Linkedlist Vs Vector"
---

The `List` interface primarily has several implementations: `ArrayList`, `LinkedList`, and `Vector`.

All three implement the `List` interface and are used in very similar ways. The main differences lie in their underlying implementations, which result in different efficiencies for various operations.

`ArrayList` is a resizable array. As more elements are added to an `ArrayList`, its size grows dynamically. Elements inside can be accessed directly via `get` and `set` methods because an `ArrayList` is essentially an array.

`LinkedList` is a doubly linked list. it offers better performance than `ArrayList` when adding or removing elements but is weaker in `get` and `set` operations.

Of course, these comparisons are relevant only when the amount of data is large or operations are frequent. If the data and computation volume are small, the comparison loses its significance.

`Vector` is similar to `ArrayList` but is a strongly synchronized class. If your program itself is thread-safe (i.e., you are not sharing the same collection/object among multiple threads), then `ArrayList` is a better choice.

Both `Vector` and `ArrayList` request more space as more elements are added. `Vector` requests double its current size each time, while `ArrayList` increases its size by 50%.

Additionally, `LinkedList` also implements the `Queue` interface, which provides more methods than `List`, including `offer()`, `peek()`, and `poll()`.

Note: By default, the initial capacity of an `ArrayList` is very small. Therefore, if you can estimate the amount of data, it is a best practice to allocate a larger initial value to reduce the overhead of resizing.