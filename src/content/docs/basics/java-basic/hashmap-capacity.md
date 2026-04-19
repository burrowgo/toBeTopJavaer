---
title: "Hashmap Capacity"
---

Many people learn Java by reading source code, which is an excellent approach, and the JDK source code is the best place to start. Among the various classes in the JDK, I believe `HashMap` and its related classes are exceptionally well-designed. However, many who read the `HashMap` code might feel - as I did - that there are too many capacity-related parameters, making it easy to get confused.

This article covers relatively simple concepts, but a solid understanding of `HashMap` principles is required. I'm writing this specifically because my upcoming articles on `HashMap` source analysis will be difficult to follow if you aren't familiar with these concepts.

First, let's look at the main member variables defined in `HashMap`.

![Parameters in HashMap](http://www.hollischuang.com/wp-content/uploads/2018/05/paramInMap.png)

The image above shows the primary member variables. In this article, we focus on: `size`, `loadFactor`, `threshold`, `DEFAULT_LOAD_FACTOR`, and `DEFAULT_INITIAL_CAPACITY`.

### Definitions

- **`transient int size`**: Records the number of key-value (KV) pairs currently in the Map.
- **`loadFactor`**: The load factor, which measures how "full" the `HashMap` is. The default value is 0.75f (`static final float DEFAULT_LOAD_FACTOR = 0.75f;`).
- **`int threshold`**: The threshold. When the number of KV pairs exceeds this value, the `HashMap` expands its capacity. `threshold = capacity * loadFactor`.
- **`capacity`**: While not a member variable itself (it's the length of the internal array), it is a crucial concept. If not specified, the default capacity is 16 (`static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;`).

### size vs. capacity

The difference between `size` and `capacity` is straightforward. Think of `HashMap` as a "bucket." `capacity` is how many items the bucket can *currently* hold, while `size` is how many items are *actually* inside it.

```java
Map<String, String> map = new HashMap<String, String>();
map.put("hollis", "hollischuang");

Class<?> mapType = map.getClass();
Method capacity = mapType.getDeclaredMethod("capacity");
capacity.setAccessible(true);
System.out.println("capacity : " + capacity.invoke(map));

Field size = mapType.getDeclaredField("size");
size.setAccessible(true);
System.out.println("size : " + size.get(map));
```

After putting one element into a new `HashMap`, the output is: **capacity: 16, size: 1**.

By default, the capacity is 16. Setting it to a power of 2 allows the use of bitwise AND instead of the modulo operator to improve hashing efficiency.

Why did I say `capacity` is what the bucket can "currently" hold? Because `HashMap` has an expansion mechanism. It starts at 16 and, when necessary, expands to 32, then 64, and so on.

You can specify an `initialCapacity` in the constructor. Let's see what happens:

```java
// Setting initialCapacity to 1, 7, and 9 respectively
// Results: capacity : 1, capacity : 8, capacity : 16
```

Even if you specify a number, `HashMap` will choose the smallest power of 2 that is greater than or equal to that number.

> **Advice:** It is best practice to specify the size when initializing a `HashMap`, especially if you know how many elements it will hold (as recommended in the *Alibaba Java Development Guidelines*).

### loadFactor and threshold

The expansion condition is simple: `HashMap` expands when its `size` exceeds the `threshold`.

As mentioned, `threshold = loadFactor * capacity`.

The `loadFactor` defaults to 0.75. This value is ideal because 0.75 is 3/4, and since `capacity` is a power of 2, the product (`threshold`) is always an integer.

For a default `HashMap`, expansion is triggered when `size` exceeds 12 (16 * 0.75).

```java
// Testing with size 12 and then adding a 13th element
// Result before 13th: capacity 16, size 12, threshold 12
// Result after 13th: capacity 32, size 13, threshold 24
```

When the 13th element is added, the capacity doubles from 16 to 32.

While you can initialize both `initialCapacity` and `loadFactor`, it is generally not recommended to change the `loadFactor`.

### Summary

- **`size`**: Number of KV pairs currently stored.
- **`capacity`**: Current number of buckets (defaults to 16, doubles on expansion).
- **`loadFactor`**: Determines the fill ratio before expansion (defaults to 0.75).
- **`threshold`**: The specific trigger point for expansion (`capacity * loadFactor`).

Note: This analysis is based on JDK 1.8.0_73.