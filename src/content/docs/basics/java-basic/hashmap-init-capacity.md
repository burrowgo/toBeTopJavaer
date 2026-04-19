---
title: "Hashmap Init Capacity"
---

Collections are frequently used in daily Java development, and as a typical K-V data structure, HashMap is certainly familiar to Java developers.

Many people have some basic understanding of HashMap, such as the differences between it and HashTable, or between it and ConcurrentHashMap. These are common knowledge points and interview questions about HashMap that everyone likely knows well and can effectively apply in development.

However, during many CodeReviews and interviews, the author found that a key small detail is often overlooked: should we specify the initial capacity when creating a HashMap? If so, what value is appropriate? Why?

### Set an Initial Capacity for HashMap

In "[Those Confusing Concepts in HashMap][1]", we once reached the following conclusion:

> HashMap has an expansion mechanism, which means it expands when the expansion conditions are met. The expansion condition for HashMap is when the number of elements (size) in the HashMap exceeds the threshold. In HashMap, threshold = loadFactor * capacity.

Therefore, if we do not set an initial capacity, the HashMap will undergo multiple expansions as elements increase. The expansion mechanism in HashMap requires rebuilding the hash table each time, which significantly impacts performance.

So, first of all, it is clear that we recommend developers specify an initial capacity when creating a HashMap. This is also recommended in the "Alibaba Java Development Manual":

![][2]

### What Initial Capacity is Appropriate for HashMap

Since it is recommended to specify an initial value when initializing a collection, what value is actually appropriate when creating a HashMap?

Some might naturally think: "I'll just set it to however many elements I plan to put in." For example, if I plan to put in 7 elements, I'll use `new HashMap(7)`.

**However, this is not only incorrect, but the capacity of the Map created this way is also not 7.**

Because when we use `HashMap(int initialCapacity)` to initialize the capacity, HashMap does not directly use the `initialCapacity` we pass in as the initial capacity.

**The JDK will default to calculating a relatively reasonable value as the initial capacity. This "reasonable value" is actually the first power of 2 that is greater than the value passed in by the user.**

That is to say, when we create a HashMap with `new HashMap(7)`, the JDK will calculate and create a Map with a capacity of 8; when we use `new HashMap(9)`, the JDK will create a Map with a capacity of 16.

**But this value only seems reasonable; in reality, it isn't necessarily so. Because when HashMap calculates the default capacity based on the user-supplied capacity, it does not consider the `loadFactor`. It simply mechanically calculates the first power of 2 greater than that number.**

> `loadFactor` is the load factor. When the number of elements in the HashMap (size) exceeds `threshold = loadFactor * capacity`, an expansion occurs.

In other words, if we set the default value to 7, after JDK processing, the HashMap's capacity will be set to 8. However, this HashMap will undergo an expansion when the number of elements reaches `8 * 0.75 = 6`, which is clearly not what we want.

So, what value is actually reasonable to set?

Here we can refer to the implementation of the `putAll` method in JDK 8, which is also adopted in Guava (version 21.0).

The calculation method for this value is:

```java
return (int) ((float) expectedSize / 0.75F + 1.0F);
```

For example, when we plan to put 7 elements into a HashMap, we calculate `expectedSize / 0.75F + 1.0F`, which is `7 / 0.75 + 1 = 10`. After 10 is processed by the JDK, it will be set to 16, which greatly reduces the chance of expansion.

> When the capacity of the hash table maintained internally by HashMap reaches 75% (by default), a rehash is triggered, and the rehash process is quite time-consuming. Therefore, setting the initial capacity to `expectedSize / 0.75 + 1` can effectively reduce collisions and decrease errors. (Think about this sentence in the context of the formula.)

**So, we can consider that when we clearly know the number of elements in the HashMap, setting the default capacity to `expectedSize / 0.75F + 1.0F` is a relatively better choice in terms of performance, though it sacrifices some memory.**

This algorithm is implemented in Guava. During development, you can create a HashMap directly via the `Maps` class:

```java
Map<String, String> map = Maps.newHashMapWithExpectedSize(7);
```

Its code implementation is as follows:

```java
public static <K, V> HashMap<K, V> newHashMapWithExpectedSize(int expectedSize) {
``` 
return new HashMap(capacity(expectedSize));
```
}

static int capacity(int expectedSize) {
``` 
if (expectedSize < 3) {
    CollectPreconditions.checkNonnegative(expectedSize, "expectedSize");
    return expectedSize + 1;
} else {
    return expectedSize < 1073741824 ? (int)((float)expectedSize / 0.75F + 1.0F) : 2147483647;
}
```
}
```

However, **the above operation is a way of trading memory for performance. When actually using it, you should consider the impact on memory.** But in most cases, we consider memory to be a relatively abundant resource.

Then again, sometimes does whether we set the initial value of the HashMap and what value we set it to really have such a big impact? Not necessarily!

But isn't major performance optimization just the stacking of one optimization detail after another?

At the very least, in the future when you write code using the `Maps.newHashMapWithExpectedSize(7);` style, it can make your colleagues and boss's eyes light up.

Or one day when you encounter an interviewer who asks you about some details, you'll have an impression of it, or one day you can even use this to interview others! Hahaha.

 [1]: http://www.hollischuang.com/archives/2416
 [2]: http://www.hollischuang.com/wp-content/uploads/2019/12/15756974111211.jpg
