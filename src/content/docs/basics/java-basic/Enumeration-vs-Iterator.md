---
title: "Enumeration Vs Iterator"
---

### Different Functional Interfaces

- `Enumeration` has only 2 functional interfaces. Through `Enumeration`, we can only read the collection's data and cannot modify it.
- `Iterator` has 3 functional interfaces. In addition to reading the collection's data, `Iterator` can also perform deletion operations.

### Fail-fast Mechanism

`Iterator` supports the fail-fast mechanism, while `Enumeration` does not.

### History and Context

- `Enumeration` is an interface added in JDK 1.0. Functions that use it include classes like `Vector` and `Hashtable`, which were also added in JDK 1.0. The purpose of `Enumeration` was to provide a traversal interface for them. `Enumeration` itself does not support synchronization, but synchronization was added when `Vector` and `Hashtable` implemented `Enumeration`.
- `Iterator` is an interface added in JDK 1.2, also providing a traversal interface for collections like `HashMap` and `ArrayList`. `Iterator` supports the fail-fast mechanism: when multiple threads operate on the content of the same collection, a fail-fast event may occur.

**Note:** The `Enumeration` iterator can only traverse older collections like `Vector` and `Hashtable`. Therefore, you should generally not use it unless you have no other choice in some extreme cases. Otherwise, you should always choose the `Iterator` iterator.