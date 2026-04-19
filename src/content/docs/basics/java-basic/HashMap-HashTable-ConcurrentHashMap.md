---
title: "Hashmap Hashtable Concurrenthashmap"
---

### What are the differences between HashMap and HashTable?

**Thread Safety:**
`HashTable` methods are synchronized, making it thread-safe. `HashMap` methods are non-synchronized by default. In a multi-threaded concurrent environment, `HashTable` can be used directly, whereas `HashMap` requires external synchronization.

**Inheritance:**
`HashTable` inherits from the legacy `Dictionary` class.
`HashMap` inherits from the `AbstractMap` abstract class, which implements the `Map` interface.

**Null Values:**
In `HashTable`, neither the key nor the value can be `null`; otherwise, a `NullPointerException` will be thrown.
In `HashMap`, `null` can be used as a key (only one such key is allowed), and one or more keys can have `null` as their value.

**Default Initial Capacity and Expansion Mechanism:**
The initial size of the hash array in `HashTable` is 11, and it expands using the formula `old * 2 + 1`. The default initial size of the hash array in `HashMap` is 16, and it must always be a power of 2.

**Hash Value Usage:**
`HashTable` directly uses the object's `hashCode()`.
`HashMap` recalculates (re-hashes) the hash value.

**Internal Traversal Implementation:**
Both `HashTable` and `HashMap` use `Iterator`. Due to historical reasons, `HashTable` also supports `Enumeration`.
`HashMap` implements `Iterator` with fast-fail support. `HashTable`'s `Iterator` also supports fast-fail, but its `Enumeration` does not.

### What are the differences between HashMap and ConcurrentHashMap?

`ConcurrentHashMap` and `HashMap` have different implementations. Although both use bucket arrays, `ConcurrentHashMap` segments the bucket array (in older versions) or uses more granular locking, whereas `HashMap` does not.

`ConcurrentHashMap` protects each segment with a lock. `HashMap` has no locking mechanism. Therefore, the former is thread-safe, while the latter is not.

Note: The above differences are based on versions prior to JDK 1.8.