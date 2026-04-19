---
title: "Integer Cache"
---

Original English: [Java Integer Cache][1] Translated from: [Integer Caching Mechanism in Java][2] Original Author: [Java Papers][3] Translator: [Hollis][4] Please indicate the source when reprinting.

This article introduces the knowledge related to Integer caching in Java. This is a feature introduced in Java 5 that helps save memory and improve performance. First, look at a sample code using Integer to learn about its caching behavior. Then, we will discuss why it is implemented this way and how exactly it is implemented. Can you guess the output of the following Java program? If your result is different from the actual result, then you should take a good look at this article.

```java
package com.javapapers.java;
 
public class JavaIntegerCache {
public static void main(String... strings) {
```
 
 Integer integer1 = 3;
 Integer integer2 = 3;
 
 if (integer1 == integer2)
 System.out.println("integer1 == integer2");
 else
 System.out.println("integer1 != integer2");
 
 Integer integer3 = 300;
 Integer integer4 = 300;
 
 if (integer3 == integer4)
 System.out.println("integer3 == integer4");
 else
 System.out.println("integer3 != integer4");
 
 }
 }
 

It is generally believed that the results of the two judgements above are both false. Although the values compared are equal, since objects are being compared and the object references are different, it would be thought that both `if` checks are false. In Java, `==` compares object references, while `equals` compares values. Therefore, in this example, different objects have different references, so the comparison should return false. Surprisingly, here two similar `if` conditions return different boolean values.

The actual output of the code above:

 integer1 == integer2
 integer3 != integer4
 

## Implementation of Integer Cache in Java

In Java 5, a new feature was introduced for Integer operations to save memory and improve performance. Integer objects achieve caching and reuse by using the same object reference.

> Applicable to the integer value range -128 to +127.
> 
> Only applicable to autoboxing. Not applicable when creating objects using a constructor.

The process where the Java compiler automatically converts primitive data types into wrapper class objects is called `autoboxing`, which is equivalent to using the `valueOf` method:

 Integer a = 10; // this is autoboxing
 Integer b = Integer.valueOf(10); // under the hood
 

Now that we know where this mechanism is used in the source code, let's look at the `valueOf` method in the JDK. The following is the implementation in `JDK 1.8.0 build 25`:

 /**
 * Returns an {@code Integer} instance representing the specified
 * {@code int} value. If a new {@code Integer} instance is not
 * required, this method should generally be used in preference to
 * the constructor {@link #Integer(int)}, as this method is likely
 * to yield significantly better space and time performance by
 * caching frequently requested values.
 *
 * This method will always cache values in the range -128 to 127,
 * inclusive, and may cache other values outside of this range.
 *
 * @param i an {@code int} value.
 * @return an {@code Integer} instance representing {@code i}.
 * @since 1.5
 */
 public static Integer valueOf(int i) {
 if (i >= IntegerCache.low && i <= IntegerCache.high)
 return IntegerCache.cache[i + (-IntegerCache.low)];
 return new Integer(i);
 }
 

Before creating an object, it first looks for it in `IntegerCache.cache`. Only if it's not found is a new object created using `new`.

## IntegerCache Class

`IntegerCache` is a `private static` inner class defined within the `Integer` class. Let's look at its definition.

 /**
 * Cache to support the object identity semantics of autoboxing for values between
 * -128 and 127 (inclusive) as required by JLS.
 *
 * The cache is initialized on first usage. The size of the cache
 * may be controlled by the {@code -XX:AutoBoxCacheMax=} option.
 * During VM initialization, java.lang.Integer.IntegerCache.high property
 * may be set and saved in the private system properties in the
 * sun.misc.VM class.
 */
 
 private static class IntegerCache {
 static final int low = -128;
 static final int high;
 static final Integer cache[];
 
 static {
 // high value may be configured by property
 int h = 127;
 String integerCacheHighPropValue =
 sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
 if (integerCacheHighPropValue != null) {
 try {
 int i = parseInt(integerCacheHighPropValue);
 i = Math.max(i, 127);
 // Maximum array size is Integer.MAX_VALUE
 h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
 } catch( NumberFormatException nfe) {
 // If the property cannot be parsed into an int, ignore it.
 }
 }
 high = h;
 
 cache = new Integer[(high - low) + 1];
 int j = low;
 for(int k = 0; k < cache.length; k++)
 cache[k] = new Integer(j++);
 
 // range [-128, 127] must be interned (JLS7 5.1.7)
 assert IntegerCache.high >= 127;
 }
 
 private IntegerCache() {}
 }
 

The Javadoc explains in detail that the cache supports the autoboxing process for values between -128 and 127. The maximum value of 127 can be modified via `-XX:AutoBoxCacheMax=size`. The cache is implemented through a `for` loop. It creates as many integers as possible from the low to the high and stores them in an integer array. This cache is initialized the first time the `Integer` class is used. From then on, the instance objects contained in the cache can be used instead of creating a new instance (in the case of autoboxing).

In fact, when this feature was introduced in Java 5, the range was fixed at -128 to +127. Later, in Java 6, the maximum value can be set through `java.lang.Integer.IntegerCache.high`. This allows us to flexibly adjust to improve performance based on the actual situation of the application. Why was this -128 to 127 range chosen? Because numbers in this range are the most widely used. The first time `Integer` is used in a program, it also takes some extra time to initialize this cache.

## Cache Behavior in the Java Language Specification

The Java Language Specification (JLS) in the [Boxing Conversion][5] section states as follows:

> If the value of a variable p being boxed is:
> 
> An integer between -128 and 127 (Section 3.10.1)
> 
> Boolean values true and false (Section 3.10.3)
> 
> Characters between '\u0000' and '\u007f' (Section 3.10.4)
> 
> Then, when p is boxed into two objects a and b, you can directly use a==b to determine whether the values of a and b are equal.

## Other Cached Objects

This caching behavior is not only applicable to `Integer` objects. We have similar caching mechanisms for all integer-type classes.

> `ByteCache` is used for caching `Byte` objects.
> 
> `ShortCache` is used for caching `Short` objects.
> 
> `LongCache` is used for caching `Long` objects.
> 
> `CharacterCache` is used for caching `Character` objects.

`Byte`, `Short`, and `Long` have a fixed range: -128 to 127. For `Character`, the range is 0 to 127. Except for `Integer`, these ranges cannot be changed.

 [1]: http://javapapers.com/java/java-integer-cache/
 [2]: http://www.hollischuang.com/?p=1174
 [3]: http://javapapers.com/
 [4]: http://www.hollischuang.com
 [5]: http://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html#jls-5.1.7
