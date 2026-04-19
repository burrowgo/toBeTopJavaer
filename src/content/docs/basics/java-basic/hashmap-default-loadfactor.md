---
title: "Hashmap Default Loadfactor"
---

In Java basics, collection classes are a critical area of knowledge and are frequently used in daily development. For example, `List` and `Map` are very common in code.

Personally, I believe the JDK engineers have performed many optimizations regarding the implementation of `HashMap`. If you were to ask which class in the JDK source code contains the most "Easter eggs," I think `HashMap` would be at least in the top five.

Because of this, many details are easily overlooked. Today, we will focus on one question:

Why is the load factor of `HashMap` set to 0.75, instead of 1 or 0.5? What considerations are behind this?

Do not underestimate this question, as the load factor is a very important concept in `HashMap` and is a common topic in advanced interviews.

Furthermore, some people misuse this value. For example, in my recent article "Alibaba Java Development Manual recommends setting the initial capacity when creating a HashMap, but how much is appropriate?", a reader responded like this:

![-w356][1]

![-w375][2]

Since some people try to modify the load factor, is changing it to 1 appropriate? Why doesn't `HashMap` use 1 as the default value for the load factor?

### What is loadFactor

First, let's introduce what the load factor (loadFactor) is. If you already know this, you can skip this section.

We know that when a `HashMap` is created for the first time, its capacity is specified (if not explicitly specified, the default is 16; see [Why is the default capacity of HashMap 16?][3]). As we continue to put elements into the `HashMap`, it may exceed its capacity, so an expansion mechanism is needed.

Expansion means increasing the capacity of the `HashMap`:

```java
void addEntry(int hash, K key, V value, int bucketIndex) {
``` 
if ((size >= threshold) && (null != table[bucketIndex])) {
    resize(2 * table.length);
    hash = (null != key) ? hash(key) : 0;
    bucketIndex = indexFor(hash, table.length);        }
createEntry(hash, key, value, bucketIndex);
```
}
```

From the code, we can see that when adding an element to a `HashMap`, if the `number of elements (size)` exceeds the `critical value (threshold)`, it will automatically expand (`resize`). Furthermore, after expansion, the existing elements in the `HashMap` need to be `rehashed`, meaning the elements in the original buckets are redistributed into the new buckets.

In `HashMap`, `critical value (threshold) = load factor (loadFactor) * capacity (capacity)`.

`loadFactor` represents how full the `HashMap` is. The default value is 0.75f, which means that by default, when the number of elements in the `HashMap` reaches 3/4 of its capacity, it will automatically expand. (See [Concepts in HashMap that are easily confused][4])

### Why Resize

Recall that we mentioned earlier that during the expansion process, `HashMap` not only increases its capacity but also performs rehashing! Therefore, this process is very time-consuming, and the more elements in the Map, the more time it takes.

The rehashing process is equivalent to hashing all elements again to recalculate which bucket they should be assigned to.

So, has anyone ever wondered: since it's so troublesome, why expand? Isn't `HashMap` an array of linked lists? Even without expansion, it could store an infinite number of elements. Why expand?

This is actually related to hash collisions.

#### Hash Collision

We know that `HashMap` is fundamentally based on hash functions. However, hash functions have the following basic characteristic: if the hash values calculated by the same hash function are different, the input values must be different. But if the hash values calculated by the same hash function are the same, the input values are not necessarily the same.

The phenomenon where two different input values result in the same hash value using the same hash function is called a collision.

Important indicators of a hash function's quality are the probability of collisions and the solution to collisions.

There are many ways to resolve hash collisions, one of the most common being the chain address method, which is the method used by `HashMap`. See [The most thorough analysis of hash() in Map on the entire internet, there is no other.][5]

`HashMap` combines arrays and linked lists to leverage the advantages of both. We can understand it as an array of linked lists.

![-w648][6]

`HashMap` is implemented based on the data structure of an array of linked lists.

When we put an element into a `HashMap`, we first need to locate which linked list in the array it belongs to and then attach this element to the end of that linked list.

When we get an element from a `HashMap`, we also need to locate which linked list in the array it belongs to and then traverse the elements in the linked list one by one until the required element is found.

Clearly, `HashMap` resolves hash conflicts through the structure of an array of linked lists.

However, if collisions are too high in a `HashMap`, the linked lists in the array will degrade into simple linked lists. At this point, the lookup speed will be significantly reduced.

![-w773][7]

Therefore, to ensure the read speed of `HashMap`, we need to find ways to ensure that collisions in the `HashMap` are not too high.

#### Resize to Avoid Hash Collisions

So, how can we effectively avoid hash collisions?

Let's think in reverse: what conditions do you think would lead to more hash collisions in a `HashMap`?

There are mainly two situations:

1. Capacity is too small. If the capacity is small, the probability of collisions is high. "Many wolves and little meat" will lead to competition.
2. The hash algorithm is not good enough. If the algorithm is unreasonable, elements might all be assigned to one or a few buckets. Uneven distribution will also lead to competition.

Therefore, resolving hash collisions in `HashMap` also starts from these two aspects.

Both points are well reflected in `HashMap`. Combining both methods - **increasing the array capacity at the right time and calculating which array to assign elements to through an appropriate hash algorithm - can significantly reduce the probability of conflicts.** This avoids the problem of low query efficiency.

### Why default loadFactor is 0.75

At this point, we know that `loadFactor` is an important concept in `HashMap`, representing its maximum fullness.

To avoid hash collisions, `HashMap` needs to expand at the right time. That is when the number of elements reaches the critical value, which, as mentioned before, is related to `loadFactor`. In other words, setting a reasonable `loadFactor` can effectively avoid hash conflicts.

So, what is a reasonable value for `loadFactor`?

This value is currently 0.75 in the JDK source code:

```java
/**
 * The load factor used when none specified in constructor.
 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;
```

So, why choose 0.75? What considerations are behind it? Why not 1, or 0.8? Why not 0.5, but 0.75?

The official JDK documentation has the following description:

> As a general rule, the default load factor (.75) offers a good tradeoff between time and space costs. Higher values decrease the space overhead but increase the lookup cost (reflected in most of the operations of the HashMap class, including get and put).

It roughly means: Generally, the default load factor (0.75) provides a good tradeoff between time and space costs. Higher values reduce space overhead but increase lookup costs (reflected in most operations of the `HashMap` class, including `get` and `put`).

Imagine if we set the load factor to 1 and used the default initial capacity of 16. This means a `HashMap` would only expand after it is "full."

In the best-case scenario for `HashMap`, these 16 elements would land in 16 different buckets after the hash algorithm; otherwise, hash collisions would inevitably occur. Moreover, as elements increase, the probability of hash collisions increases, and the lookup speed decreases.

#### Mathematical basis for 0.75

Additionally, we can use a mathematical approach to calculate what value is appropriate.

Let's assume the probability of a bucket being empty or non-empty is 0.5. We use `s` to represent capacity and `n` to represent the number of added elements.

Let `s` be the size of the added keys and `n` be the number of keys. According to the binomial theorem, the probability that a bucket is empty is:

```
P(0) = C(n, 0) * (1/s)^0 * (1 - 1/s)^(n - 0)
```

Therefore, if the number of elements in the bucket is less than the following value, the bucket might be empty:

```
log(2)/log(s/(s - 1))
```

As `s` approaches infinity, if the number of added keys makes `P(0) = 0.5`, then `n/s` quickly approaches `log(2)`:

```
log(2) ~ 0.693...
```

So, a reasonable value is around 0.7.

Of course, this mathematical calculation method is not reflected in official Java documentation, and we have no way of knowing if this consideration exists, just as we don't know what Lu Xun was thinking when he wrote his articles; we can only speculate. This speculation comes from Stack Overflow (https://stackoverflow.com/questions/10901752/what-is-the-significance-of-load-factor-in-hashmap).

#### Inevitable factors for 0.75

Theoretically, we believe the load factor should not be too large, or it will lead to numerous hash conflicts, nor should it be too small, as that would waste space.

Through mathematical reasoning, we have determined that a value around 0.7 is reasonable.

So, why was 0.75 ultimately chosen?

Recall the formula we mentioned earlier: `critical value (threshold) = load factor (loadFactor) * capacity (capacity)`.

In [Why is the default capacity of HashMap 16?][3], we introduced that according to the expansion mechanism of `HashMap`, it ensures the value of `capacity` is always a power of 2.

Therefore, to ensure that the result of `load factor (loadFactor) * capacity (capacity)` is an integer, the value 0.75 (3/4) is quite reasonable, because the product of this number and any power of 2 is an integer.

### Summary

`HashMap` is a K-V structure. To increase its query and insertion speed, the underlying implementation uses an array of linked lists.

However, when calculating the position of an element, a hash algorithm is required, and the hash algorithm used by `HashMap` is the chain address method. This method has two extremes.

If the probability of hash conflicts in `HashMap` is high, then `HashMap` will degrade into a linked list (not literally degrade, but operations will feel like directly operating on a linked list). We know the biggest drawback of linked lists is slow query speed, as they need to be traversed from the head one by one.

Therefore, to avoid a large number of hash conflicts in `HashMap`, it needs to be expanded at the appropriate time.

The condition for expansion is when the number of elements reaches the critical value. The calculation method for the critical value in `HashMap` is:

```
critical value (threshold) = load factor (loadFactor) * capacity (capacity)
```

The load factor represents the maximum fullness an array can reach. This value should not be too large or too small.

If `loadFactor` is too large, such as equal to 1, there will be a high probability of hash conflicts, which will significantly reduce query speed.

If `loadFactor` is too small, such as equal to 0.5, frequent expansion will waste a lot of space.

Therefore, this value needs to be between 0.5 and 1. According to the mathematical formula, this value is reasonable around `log(2)`.

Additionally, to improve expansion efficiency, the capacity of `HashMap` has a fixed requirement: it must be a power of 2.

Thus, if `loadFactor` is 3/4, the product with capacity can be an integer.

In general, we do not recommend modifying the `loadFactor` value unless there is a special reason.

For example, if I clearly know that my Map will only store 5 KVs and will never change, I might consider specifying a `loadFactor`.

However, I don't even recommend using it that way. We can achieve this goal entirely by specifying the `capacity`. See [Why is the default capacity of HashMap 16?][3]

References:

https://stackoverflow.com/questions/10901752/what-is-the-significance-of-load-factor-in-hashmap

https://docs.oracle.com/javase/6/docs/api/java/util/HashMap.html

https://preshing.com/20110504/hash-collision-probabilities/

 [1]: http://www.hollischuang.com/wp-content/uploads/2020/02/15823434481444.jpg
 [2]: http://www.hollischuang.com/wp-content/uploads/2020/02/15823434784570.jpg
 [3]: http://www.hollischuang.com/archives/4320
 [4]: http://www.hollischuang.com/archives/2416
 [5]: http://www.hollischuang.com/archives/2091
 [6]: http://www.hollischuang.com/wp-content/uploads/2020/02/15823447916666.jpg
 [7]: http://www.hollischuang.com/wp-content/uploads/2020/02/15823459128857.jpg
