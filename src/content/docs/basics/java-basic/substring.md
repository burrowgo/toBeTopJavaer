---
title: "Substring"
---

`String` is a fundamental class in Java that every developer uses frequently. It is also a common topic in interviews.

There are many methods in the `String` class. Some are very common, while others are less so. Today, we will introduce `substring`, which is a frequently used method with many associated interview questions.

The implementation of the `substring(int beginIndex, int endIndex)` method differs across various JDK versions. Understanding these differences can help you use it more effectively. For simplicity, `substring()` in this article refers to the `substring(int beginIndex, int endIndex)` method.

## The Role of substring()

The `substring(int beginIndex, int endIndex)` method extracts a portion of a string and returns the content within the range `[beginIndex, endIndex - 1]`.

```java
String x = "abcdef";
x = x.substring(1, 3);
System.out.println(x);
```

Output:
```
bc
```

## What Happens When substring() is Called?

As you might know, because `String` is immutable, when `x.substring(1, 3)` is assigned to `x`, it points to a brand-new string:

![string-immutability1][1]

However, this diagram is not a completely accurate representation of what happens in the heap, as the behavior of `substring` differs between JDK 6 and JDK 7.

## substring in JDK 6

Strings are implemented using character arrays. In JDK 6, the `String` class contains three member variables: `char value[]`, `int offset`, and `int count`. They store the actual character array, the starting index, and the character count, respectively.

When `substring` is called, a new `String` object is created, but its `value` still points to the same character array in the heap. Only the `count` and `offset` values differ between the two objects.

![string-substring-jdk6][2]

The following code snippet from the JDK 6 source code illustrates this:

```java
// JDK 6
String(int offset, int count, char value[]) {
``` 
this.value = value;
this.offset = offset;
this.count = count;
```
}

public String substring(int beginIndex, int endIndex) {
``` 
// check boundary
return new String(offset + beginIndex, endIndex - beginIndex, value);
```
}
```

## Problems with substring in JDK 6

If you have a very long string but only need a tiny portion of it via `substring`, this can lead to performance issues. Since the small substring still references the entire original character array, the large array cannot be garbage collected, potentially causing a memory leak. In JDK 6, a common workaround was:

```java
x = x.substring(x, y) + "";
```

The issue of improper `substring` usage leading to memory leaks in JDK 6 is documented in the Java Bug Database:

<img src="http://www.hollischuang.com/wp-content/uploads/2016/03/leak.png" alt="leak" width="1089" height="744" class="aligncenter size-full wp-image-2660" />

> **Memory Leak:** In computer science, a memory leak occurs when a program fails to release memory that is no longer needed. It doesn't mean the memory physically vanishes, but rather that the application loses control over it, leading to wasted resources.

## substring in JDK 7

The issue mentioned above was resolved in JDK 7. In this version, the `substring` method creates a new array in the heap for the returned string.

![string-substring-jdk7][3]

The JDK 7 source code implementation is as follows:

```java
// JDK 7
public String(char value[], int offset, int count) {
``` 
// check boundary
this.value = Arrays.copyOfRange(value, offset, offset + count);
```
}

public String substring(int beginIndex, int endIndex) {
``` 
// check boundary
int subLen = endIndex - beginIndex;
return new String(value, beginIndex, subLen);
```
}
```

In JDK 7, `new String` creates a new character array, avoiding any reference to the original array and thus preventing memory leaks.

Therefore, if you are using a JDK version older than 1.7 in production, be mindful of potential memory leaks when using `substring`.

 [1]: http://www.programcreek.com/wp-content/uploads/2013/09/string-immutability1-650x303.jpeg
 [2]: http://www.programcreek.com/wp-content/uploads/2013/09/string-substring-jdk6-650x389.jpeg
 [3]: http://www.programcreek.com/wp-content/uploads/2013/09/string-substring-jdk71-650x389.jpeg
