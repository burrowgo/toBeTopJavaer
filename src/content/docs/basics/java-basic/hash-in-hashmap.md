---
title: "Hash In Hashmap"
---

Do you know the specific implementation of the `hash` method in `HashMap`? Do you know the implementation and reasons for the `hash` method in `HashTable` and `ConcurrentHashMap`? Do you know why it is implemented this way? Do you know the differences in the `hash` method implementation between JDK 7 and JDK 8? If you cannot answer these questions well, then you need to read this article carefully. This article involves a lot of code and underlying computer principles. It is definitely packed with valuable insights. No other place on the entire internet analyzes `hash()` so thoroughly.

### Hash

**Hash is generally translated as "Scatter", or directly transliterated as "Hash". It involves transforming input of any length into an output of fixed length through a hashing algorithm, and this output is the hash value.** This conversion is a compression mapping; that is, the space of hash values is usually much smaller than the input space. Different inputs may hash to the same output, so it is impossible to uniquely determine the input value from the hash value. Simply put, it is a function that compresses a message of any length into a message digest of a fixed length.

All hash functions have a basic property: **If the hash values calculated based on the same hash function are different, then the input values must also be different. However, if the hash values calculated based on the same hash function are the same, the input values are not necessarily the same.**

**The phenomenon where two different input values calculate to the same hash value according to the same hash function is called a collision.**

Common hash functions include:

> Direct Addressing: Directly use the key `k` or `k` plus some constant (`k+c`) as the hash address.
> 
> Digital Analysis: Extract digits that are relatively uniformly distributed in the key as the hash address.
> 
> Division Remainder Method: Divide the key `k` by a number `p` not greater than the hash table length `m`, and use the remainder as the hash table address.
> 
> Segmented Superposition Method: Divide the key into several parts with equal digits according to the number of hash table address digits, where the last part can be shorter. Then add these parts together, and the result after discarding the highest carry is the hash address of the key.
> 
> Mid-Square Method: If the distribution of various parts of the key is not uniform, you can first find its square value and then take several middle digits as the hash address according to requirements.
> 
> Pseudo-Random Number Method: Use a pseudo-random number as the hash function.

Collisions were introduced above. An important indicator of the quality of a hash function is the probability of collisions and the solution for collisions. Almost any hash function cannot completely avoid collisions. Common methods to solve collisions include:

*   Open Addressing Method: 
    *   Open addressing means that once a conflict occurs, it looks for the next empty hash address. As long as the hash table is large enough, an empty hash address can always be found and the record stored.
*   Chain Addressing Method: 
    *   Treat each unit of the hash table as the head node of a linked list. All elements with a hash address of `i` form a synonym linked list. That is, when a conflict occurs, the key is linked to the tail of the linked list with that unit as the head node.
*   Re-hashing Method: 
    *   When a hash address conflict occurs, use other functions to calculate another hash function address until the conflict no longer arises.
*   Establishment of Public Overflow Area: 
    *   Divide the hash table into two parts: the basic table and the overflow table. Elements that conflict are all put into the overflow table.

### Data Structure of HashMap

In Java, there are two relatively simple data structures for saving data: arrays and linked lists. **The characteristics of arrays are: easy addressing, difficult insertion and deletion; while the characteristics of linked lists are: difficult addressing, easy insertion and deletion.** As mentioned above, one of the common collision resolution methods for hash functions is the chain addressing method, which actually combines the array and the linked list to leverage the advantages of both. We can understand it as an array of linked lists.

[<img src="http://www.hollischuang.com/wp-content/uploads/2018/03/640.png" alt="640" width="861" height="396" class="aligncenter size-full wp-image-2093" />][1]

We can see from the figure above that the left side is clearly an array, and each member of the array is a linked list. All elements accommodated by this data structure contain a pointer for linking between elements. We distribute elements into different linked lists based on their own characteristics, and conversely, it is through these characteristics that we find the correct linked list and then find the correct element from the linked list. Among them, the method of calculating the array index of an element based on its characteristics is the hash algorithm, which is the protagonist of this article, the `hash()` function (and of course, including the `indexFor()` function).

### hash Method

Taking the HashMap in JDK 1.7 as an example, a `final int hash(Object k)` method is defined, which is mainly referenced by the following methods.

[<img src="http://www.hollischuang.com/wp-content/uploads/2018/03/hash-use.png" alt="hash-use" width="406" height="226" class="aligncenter size-full wp-image-2095" />][2]

The above methods are mainly addition and deletion methods. This is not hard to understand: when we want to add or delete an element in a linked list array, we first need to know where it should be saved in this linked list array, i.e., its index in this array. The function of the `hash()` method is to locate its position in the HashMap based on the Key. The same applies to `HashTable` and `ConcurrentHashMap`.

### Source Code Analysis

First, in the same version of JDK, the implementations of the `hash` method in `HashMap`, `HashTable`, and `ConcurrentHashMap` are different. There are also differences in different versions of JDK (Java 7 and Java 8). I will try to introduce them all. I believe that after reading this article, you will thoroughly understand the `hash` method.

Before going into the code, let's do a simple analysis. We know that the function of the `hash` method is to locate the position of this K-V pair in the linked list array based on the Key. That is, the input of the `hash` method should be an Object type Key, and the output should be an int type array index. If you were to design this method, how would you do it?

Actually, it's simple: we just need to call the `hashCode()` method of the Object, which returns an integer, and then use this number to perform a modulo operation on the capacity of `HashMap` or `HashTable`. Yes, the basic principle is this, but in the specific implementation, it is achieved by two methods `int hash(Object k)` and `int indexFor(int h, int length)`. However, considering efficiency and other issues, the implementation of `HashMap` will be slightly more complicated.

> `hash`: This method mainly converts an Object into an integer.
> 
> `indexFor`: This method mainly converts the integer generated by `hash` into an index in the linked list array.

#### HashMap In Java 7

```java
final int hash(Object k) {
``` 
int h = hashSeed;
if (0 != h && k instanceof String) {
    return sun.misc.Hashing.stringHash32((String) k);
}

h ^= k.hashCode();
h ^= (h >>> 20) ^ (h >>> 12);
return h ^ (h >>> 7) ^ (h >>> 4);
```
}

static int indexFor(int h, int length) {
``` 
return h & (length-1);
```
}
```

As I said before, the `indexFor` method mainly converts the integer generated by `hash` into an index in the linked list array. So what does `return h & (length-1);` mean? Actually, it is a modulo operation. The main reason Java uses bitwise operations (&) instead of modulo operations (%) is efficiency. **The efficiency of bitwise operations (&) is much higher than that of modulo operations (%) because bitwise operations directly operate on memory data and do not need to be converted to decimal, so the processing speed is very fast.**

So, why can bitwise operations (&) be used to implement modulo operations (%)? The implementation principle is as follows:

> X % 2^n = X & (2^n - 1)
> 
> 2^n represents the n-th power of 2. That is, a number modulo 2^n == a number bitwise ANDed with (2^n - 1).
> 
> Suppose n is 3, then 2^3 = 8, which is 1000 in binary. 2^3 - 1 = 7, which is 0111.
> 
> At this time, X & (2^3 - 1) is equivalent to taking the last three digits of the binary representation of X.
> 
> From a binary perspective, X / 8 is equivalent to X >> 3, which is shifting X to the right by 3 bits. This gives the quotient of X / 8, and the part that was shifted away (the last three digits) is X % 8, which is the remainder.

I don't know if you understood the above explanation. If not, it doesn't matter; you just need to remember this trick. Or you can try a few examples.

> 6 % 8 = 6, 6 & 7 = 6
> 
> 10 & 8 = 2, 10 & 7 = 2

[<img src="http://www.hollischuang.com/wp-content/uploads/2018/03/640-1.png" alt="640 (1)" width="421" height="177" class="aligncenter size-full wp-image-2096" />][3]

Therefore, `return h & (length-1);` can implement the modulo operation as long as the length is ensured to be `2^n`. The length in `HashMap` is indeed a multiple of 2, starting with an initial value of 16 and doubling each time thereafter.

After analyzing the `indexFor` method, we next prepare to analyze the specific principle and implementation of the `hash` method. Before deep analysis, let's summarize.

HashMap data is stored in an array of linked lists. When performing operations like insertion/deletion on `HashMap`, it is necessary to locate which index in the array the K-V pair should be saved in based on the key value. This operation of seeking the index through the key value is called hashing. The `HashMap` array has a length, and Java stipulates that this length can only be a multiple of 2, with an initial value of 16. A simple approach is to first obtain the hashcode of the key value, and then take the int value obtained by the hashcode modulo the array length. For performance considerations, Java always uses bitwise AND operations to implement modulo operations.

Next, we will find that neither modulo operations nor bitwise operations can directly solve the problem of large conflicts. For example: `CA11 0000` and `0001 0000` have equal values after bitwise ANDing with `0000 1111`.
[<img src="http://www.hollischuang.com/wp-content/uploads/2018/03/640-2.png" alt="640 (2)" width="422" height="148" class="aligncenter size-full wp-image-2097" />][4]

Two different key values result in the same value after bitwise ANDing with the array length. Doesn't this cause a conflict? So how to solve this conflict? Let's see how Java does it.

The main code part is as follows:

```java
h ^= k.hashCode();
h ^= (h >>> 20) ^ (h >>> 12);
return h ^ (h >>> 7) ^ (h >>> 4);
```

This code is to perform perturbation calculations on the `hashCode` of the key to prevent hash conflicts caused by different high bits but the same low bits of different hashCodes. Simply put, it is to combine the characteristics of high bits and low bits to reduce the probability of hash conflicts. That is, try to ensure that a change in any bit can affect the final result.

For example, we now want to put a K-V pair into a `HashMap` with a Key of "hollischuang". After simple retrieval of the hashcode, the value obtained is "1011000110101110011111010011011". If the current size of the HashTable is 16, that is, without perturbation calculation, the final index result obtained is 11. Since the binary of 15 extended to 32 bits is "00000000000000000000000000001111", when a number is bitwise ANDed with it, no matter what the first 28 bits are, the calculation result is the same (because the result of ANDing 0 with any number is 0), as shown in the figure below.

[<img src="http://www.hollischuang.com/wp-content/uploads/2018/03/640-3.png" alt="640 (3)" width="611" height="281" class="aligncenter size-full wp-image-2098" />][5]

It can be seen that the index value obtained after bitwise operation for the latter two hashcodes is also 11. Although we don't know which keys have those hashcodes, such keys definitely exist, which creates a conflict.

Next, let's see what the final calculation result will be after the perturbation algorithm.

[<img src="http://www.hollischuang.com/wp-content/uploads/2018/03/640-4.png" alt="640 (4)" width="836" height="443" class="aligncenter size-full wp-image-2099" />][6]

As seen from the figure above, the two hashcodes that would previously conflict now have different index values after perturbation calculation, which avoids conflicts well.

> In fact, using bitwise operations instead of modulo operations has another benefit besides performance: it can solve the problem of negative numbers well. Because we know the result of hashcode is of type int, and the range of int is -2^31 ~ 2^31 - 1, i.e., [-2147483648, 2147483647]. This includes negative numbers. We know that modulo operation for a negative number is somewhat troublesome. If bitwise operations are used, this problem can be avoided well. First, regardless of whether the value of the hashcode is positive or negative, the value `length-1` must be a positive number. Then its first binary bit must be 0 (signed numbers use the highest bit as the sign bit, "0" represents "+", "1" represents "-"). In this way, after bitwise ANDing the two numbers, the first bit must be 0, which means the result obtained must be a positive number.

### HashTable In Java 7

The above is the implementation of the `hash` method and `indexOf` method in `HashMap` in Java 7. Next, let's see how the thread-safe `HashTable` is implemented, how it differs from `HashMap`, and try to analyze the reasons for the differences. Below is the implementation of the `hash` method in `HashTable` in Java 7.

```java
private int hash(Object k) {
``` 
// hashSeed will be zero if alternative hashing is disabled.
return hashSeed ^ k.hashCode();
```
}
```

We can find it's very simple, equivalent to just doing a simple hash on `k` and taking its `hashCode`. And `HashTable` does not have an `indexOf` method; it is replaced by this code: `int index = (hash & 0x7FFFFFFF) % tab.length;`. In other words, `HashMap` and `HashTable` adopt two methods for calculating the array index. `HashMap` uses bitwise operations, while `HashTable` uses direct modulo.

> Why perform a bitwise AND operation between the hash value and `0x7FFFFFFF`? Mainly to ensure that the first bit of the obtained index is 0, which is to get a positive number. Because for signed numbers, the first bit 0 represents a positive number and 1 represents a negative number.

We said before that the reason `HashMap` does not use modulo is to improve efficiency. Some people think that since `HashTable` is a thread-safe class and is inherently slow, Java did not consider the efficiency issue and directly used the modulo algorithm. But it's not entirely so; Java's design still has certain considerations, although the efficiency is indeed slower than `HashMap`.

Actually, `HashTable`'s use of simple modulo has certain considerations. This involves the constructor and expansion function of `HashTable`. Due to space limitations, the code is not posted here, and the conclusion is given directly:

> `HashTable` has a default initial size of 11, and doubles as `2n+1` each time thereafter.
> 
> That is to say, the default size of the linked list array of `HashTable` is a prime number and an odd number. Each subsequent expansion result is also an odd number.
> 
> Since `HashTable` will try to use prime numbers and odd numbers as the capacity size. When the size of the hash table is a prime number, the result of simple modulo hashing will be more uniform. (This can be proven. Since it is not the focus of this article, it will not be introduced in detail for now. Refer to: http://zhaox.github.io/algorithm/2015/06/29/hash)

So far, we have looked at the implementations of hashing in `HashMap` and `HashTable` in Java 7. Let's make a simple summary.

*   `HashMap` has a default initial size of 16 and doubles each time thereafter.
*   `HashTable` has a default initial size of 11 and expands as `2n+1` each time thereafter.
*   When the size of the hash table is a prime number, the result of simple modulo hashing will be more uniform. So from this point alone, the choice of hash table size for `HashTable` seems more ingenious because the more dispersed the hash results, the better the effect.
*   In modulo calculation, if the modulus is a power of 2, we can directly use bitwise operations to get the result, and the efficiency is much higher than doing division. So from the perspective of hash calculation efficiency, `HashMap` is superior.
*   However, in order to improve efficiency, `HashMap` uses bitwise operations instead of hashing, which introduces the problem of non-uniform hash distribution. So to solve this problem, `HashMap` made some improvements to the hash algorithm and performed perturbation calculations.

### ConcurrentHashMap In Java 7

```java
private int hash(Object k) {
``` 
int h = hashSeed;

if ((0 != h) && (k instanceof String)) {
    return sun.misc.Hashing.stringHash32((String) k);
}

h ^= k.hashCode();

// Spread bits to regularize both segment and index locations,
// using variant of single-word Wang/Jenkins hash.
h += (h <<  15) ^ 0xffffcd7d;
h ^= (h >>> 10);
h += (h <<   3);
h ^= (h >>>  6);
h += (h <<   2) + (h << 14);
return h ^ (h >>> 16);
```
}

int j = (hash >>> segmentShift) & segmentMask;
```

The above implementation of hash for `ConcurrentHashMap` is actually similar to `HashMap`. Both use bitwise operations instead of modulo, and then perturb the hashcode. The difference is that `ConcurrentHashMap` uses a variant of the Wang/Jenkins hash algorithm, the main purpose of which is also to combine high and low bits together to avoid collisions. As for why it doesn't use the same algorithm for perturbation as `HashMap`, I guess it's just the choice of the programmer's free will. At least I have no way to prove which one is better currently.

### HashMap In Java 8

Prior to Java 8, `HashMap` and other map-based classes resolved conflicts through the chain addressing method, using singly linked lists to store elements with the same index value. In the worst case, this approach would reduce the performance of the `get` method of `HashMap` from `O(1)` to `O(n)`. To solve the problem of reduced performance of hashmap during frequent conflicts, Java 8 uses balanced trees instead of linked lists to store conflicting elements. This means we can improve the worst-case performance from `O(n)` to `O(logn)`. Regarding the optimization of `HashMap` in Java 8, I will have more articles to deeply introduce later.

If a malicious program knows that we use a hash algorithm, in the case of pure linked lists, it can send a large number of requests resulting in hash collisions, and then continuously access these keys, causing `HashMap` to be busy with linear searches and eventually paralyzed, forming a Denial of Service (DoS) attack.

Regarding the hash function in Java 8, the principle is basically similar to that in Java 7. This step is optimized in Java 8, doing only one 16-bit right-shift XOR mix instead of four, but the principle remains unchanged.

```java
static final int hash(Object key) {
``` 
int h;
return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
```
}
```

In the implementation of JDK 1.8, the high-bit operation algorithm is optimized, achieved through the high 16 bits of `hashCode()` XORed with the low 16 bits: `(h = k.hashCode()) ^ (h >>> 16)`, mainly considering speed, efficacy, and quality. The int hash value obtained by the above method is then used to get the position saved in the data through `h & (table.length -1)`.

#### HashTable In Java 8

In the `HashTable` of Java 8, there is no longer a `hash` method. But the hashing operation is still there, for example, in the `put` method there is the following implementation:

```java
int hash = key.hashCode();
int index = (hash & 0x7FFFFFFF) % tab.length;
```

This is actually almost no different from the implementation in Java 7, so it won't be introduced too much.

### ConcurrentHashMap In Java 8

The method for seeking hash in Java 8's `ConcurrentHashMap` has been changed from `hash` to `spread`. The implementation is as follows:

```java
static final int spread(int h) {
``` 
return (h ^ (h >>> 16)) & HASH_BITS;
```
}
```

`ConcurrentHashMap` in Java 8 also determines the index of the key in the array by the hash value of the Key modulo the array length. Also, to avoid poorly designed `hashCode` of the Key, it calculates the final hash value of the Key through the following method. The difference is that the author of `ConcurrentHashMap` in Java 8 believes that after the introduction of red-black trees, even if the hash conflict is serious, the addressing efficiency is high enough. Therefore, the author did not design too much on the calculation of the hash value, but simply XORed the `hashCode` value of the Key with its high 16 bits and ensured that the highest bit is 0 (thereby ensuring the final result is a positive integer).

### Summary

So far, we have analyzed the implementations of `HashMap`, `HashTable`, and `ConcurrentHashMap` in JDK 1.7 and JDK 1.8. we can find that in order to ensure that the hash results can be dispersed and to improve the efficiency of hashing, JDK has many considerations and has done many things on a small `hash` method. Of course, I hope we can not only deeply understand the principles behind it but also learn this attitude of striving for excellence in code.

Every line of the JDK source code is very interesting and worth spending time to study and ponder.

[Construction Methods and Collision Resolution of Hash Table (HashTable)][7]

[Data Structure of HashMap][8]

[What exactly is the difference between HashMap and HashTable?][9]

Answers by @Er Da Wang and @Anra in the [Zhihu question][10]

 [1]: http://www.hollischuang.com/wp-content/uploads/2018/03/640.png
 [2]: http://www.hollischuang.com/wp-content/uploads/2018/03/hash-use.png
 [3]: http://www.hollischuang.com/wp-content/uploads/2018/03/640-1.png
 [4]: http://www.hollischuang.com/wp-content/uploads/2018/03/640-2.png
 [5]: http://www.hollischuang.com/wp-content/uploads/2018/03/640-3.png
 [6]: http://www.hollischuang.com/wp-content/uploads/2018/03/640-4.png
 [7]: https://www.jianshu.com/p/7e7f52a49ffc
 [8]: http://blog.csdn.net/justloveyou_/article/details/62893086
 [9]: http://zhaox.github.io/2016/07/05/hashmap-vs-hashtable
 [10]: https://www.zhihu.com/question/51784530
