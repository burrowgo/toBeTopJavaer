---
title: "Final String"
---

String is very commonly used in Java, and we often assign values and change its value in our code. However, why do we say that strings are immutable?

First, we need to know what an immutable object is.

An immutable object is an object whose internal state remains unchanged after it is completely created. This means that once the object is assigned to a variable, we can neither update the reference nor change the internal state in any way.

However, some people may be confused: Why is String immutable when I often change the value of a String in my code, like this:

```java
String s = "abcd";
s = s.concat("ef");
```

Doesn't this operation change the original "abcd" string to "abcdef"?

But, although the string content seems to change from "abcd" to "abcdef", in reality, we have obtained a new string.

![][1]

As shown in the figure above, a new "abcdef" string is created in the heap, and it is not the same object as "abcd".

Therefore, once a string object is created in memory (heap), it cannot be modified. Moreover, all methods of the String class do not change the value of the string itself; they all return a new object.

If we want a modifiable string, we can choose `StringBuffer` or `StringBuilder` to replace `String`.

### Why String is Designed to be Immutable

Knowing that "String is immutable", everyone must be very confused: Why design String to be immutable? What are the benefits?

This question has troubled many people, and some have even asked the founder of Java, James Gosling, directly.

In an interview, James Gosling was asked when immutable variables should be used, and his answer was:

> I would use an immutable whenever I can.

So, what are the reasons behind this answer? What thoughts are they based on?

Actually, it is mainly triggered by perspectives such as caching, security, thread safety, and performance.

Q: Caching, security, thread safety, and performance? What are these?
A: Don't worry, just listen to me explain them one by one.

#### Caching

String is the most widely used data structure. Creating a large number of strings is very resource-intensive, so Java provides a caching function for strings, which can greatly save heap space.

A part of space is specifically set aside in the JVM to store Java strings, which is the String Pool.

Through the String Pool, two string variables with the same content can point to the same string object from the pool, thereby saving critical memory resources.

```java
String s = "abcd";
String s2 = s;
```

In this example, both `s` and `s2` represent "abcd", so they will point to the same string object in the String Pool:

![][2]

However, the reason this can be done is mainly due to the immutability of strings. Imagine if strings were mutable; once we modified the content of `s`, it would inevitably cause the content of `s2` to be changed passively, which is clearly not what we want to see.

#### Security

Strings are widely used in Java applications to store sensitive information such as usernames, passwords, connection URLs, network connections, etc. The JVM class loader also uses it extensively when loading classes.

Therefore, protecting the String class is crucial for improving the security of the entire application.

When we pass a string in a program, if the content of this string is immutable, then we can trust the content in this string.

However, if it is mutable, then the string content could be modified at any time. Then the string content becomes completely untrustworthy. Thus, the entire system would have no security to speak of.

#### Thread Safety

Immutability automatically makes strings thread-safe because they will not be changed when accessed from multiple threads.

Therefore, in general, immutable objects can be shared among multiple threads running simultaneously. They are also thread-safe because if a thread changes the value, a new string will be created in the String Pool instead of modifying the same value. Thus, strings are safe for multi-threading.

#### Hashcode Caching

Since string objects are widely used as data structures, they are also widely used in hash implementations, such as HashMap, HashTable, HashSet, etc. When operating on these hash implementations, the `hashCode()` method is frequently called.

Immutability guarantees that the value of the string will not change. Therefore, the `hashCode()` method is overridden in the String class to facilitate caching, so that the hash is calculated and cached during the first `hashCode()` call, and the same value is returned from then on.

In the String class, there is the following code:

```java
private int hash;//this is used to cache hash code.
```

#### Performance

The previously mentioned String Pool, hashcode caching, etc., are all manifestations of performance improvement.

Because strings are immutable, the String Pool can be used for caching, which can greatly save heap memory. Moreover, the hashcode can be cached in advance, making it more efficient.

Since strings are the most widely used data structure, improving the performance of strings has a considerable impact on improving the overall performance of the entire application.

### Summary

Through this article, we can conclude that strings are immutable, so their references can be treated as ordinary variables, and they can be passed between methods and threads without worrying about whether the actual string object they point to will change.

We also learned about other reasons that prompted Java language designers to set this class as an immutable class. The main considerations are caching, security, thread safety, and performance.

 [1]: https://www.hollischuang.com/wp-content/uploads/2021/03/16163108328434.jpg
 [2]: https://www.hollischuang.com/wp-content/uploads/2021/03/16163114985563.jpg
