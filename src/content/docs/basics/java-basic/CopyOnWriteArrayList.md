---
title: "Copyonwritearraylist"
---

```java
Copy-On-Write, referred to as COW, is an optimization strategy used in programming. Its basic idea is that everyone shares the same content from the beginning. Only when someone wants to modify the content is it truly copied out to form a new piece of content and then modified. This is a delayed lazy strategy. Starting from JDK 1.5, the Java concurrency package has provided two concurrent containers implemented using the CopyOnWrite mechanism: `CopyOnWriteArrayList` and `CopyOnWriteArraySet`. CopyOnWrite containers are very useful and can be used in many concurrent scenarios.
```

`CopyOnWriteArrayList` is equivalent to a thread-safe `ArrayList`. `CopyOnWriteArrayList` uses a method called write-on-copy. When a new element is added to `CopyOnWriteArrayList`, it first copies the original array, then performs the write operation in the new array, and finally points the original array reference to the new array.

The advantage of this is that we can perform concurrent reads on the CopyOnWrite container without locking because the current container will not have any elements added to it. Therefore, the CopyOnWrite container is also an idea of read-write separation, where reading and writing happen on different containers.

Note: The entire `add` operation of `CopyOnWriteArrayList` is performed under the protection of a lock. That is to say, the `add` method is thread-safe.

CopyOnWrite concurrent containers are used for concurrent scenarios with many reads and few writes. For example, access and update scenarios for white lists, black lists, and product categories.

Unlike `ArrayList`, it has the following characteristics:
* Supports high-efficiency concurrency and is thread-safe.
* Because the entire underlying array usually needs to be copied, mutable operations (`add()`, `set()`, `remove()`, etc.) are expensive.
* Iterators support immutable operations like `hasNext()` and `next()`, but do not support mutable operations like `remove()`.
* Traversal using an iterator is very fast and will not conflict with other threads. When constructing an iterator, it relies on an immutable snapshot of the array.
