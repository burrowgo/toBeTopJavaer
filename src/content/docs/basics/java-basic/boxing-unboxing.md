---
title: "Boxing Unboxing"
---

This article primarily introduces the knowledge related to auto-unboxing and auto-boxing in Java.

## Basic Data Types

Basic data types, also known as built-in types, are special types in Java that are different from classes. They are the most frequently used types in our programming.

Java is a strongly typed language; every variable must have a declared type, and the first assignment to a variable is called initialization.

There are eight basic types in Java, which can be categorized into three groups:

> Character type: `char`
>
> Boolean type: `boolean`
>
> Numeric types: `byte`, `short`, `int`, `long`, `float`, `double`.

Numeric types are further divided into integer types (`byte`, `short`, `int`, `long`) and floating-point types (`float`, `double`).

In Java, numeric types are always signed; their ranges are fixed and do not change regardless of the hardware environment or operating system.

Actually, there is another basic type in Java called `void`, which has a corresponding wrapper class `java.lang.Void`, though we cannot operate on them directly.

### Benefits of Basic Data Types

We know that in Java, objects created with `new` are stored in the heap, and we access them via references in the stack. Consequently, objects themselves are relatively resource-intensive.

For frequently used types like `int`, it would be cumbersome to `new` a Java object every time we use such a variable. Therefore, similar to C++, Java provides basic data types. Variables of these types do not need to be created using `new`; they are stored directly in the stack memory rather than the heap, making them much more efficient.

### Range of Integer Types

Integer types in Java include `byte`, `short`, `int`, and `long`, representing numeric ranges from small to large. These differences in range are due to the number of bytes they occupy in memory.

As a quick refresher: 1 byte = 8 bits. Integer types in Java are signed.

For 8 bits in computing:
- Minimum: 10000000 (-128) (-2^7)
- Maximum: 01111111 (127) (2^7-1)

Among the integer types:
- `byte`: Uses 1 byte, range -128 to 127. Default value is 0.
- `short`: Uses 2 bytes, range -32,768 to 32,767. Default value is 0.
- `int`: Uses 4 bytes, range -2,147,483,648 to 2,147,483,647. Default value is 0.
- `long`: Uses 8 bytes, range -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807. Default value is 0L.

### What happens when the range is exceeded?

Each integer type has a specific range. However, certain calculations in a program can lead to values outside this range, known as overflow.

```java
int i = Integer.MAX_VALUE;
int j = Integer.MAX_VALUE;

int k = i + j;
System.out.println("i (" + i + ") + j (" + j + ") = k (" + k + ")");
```
Output: `i (2147483647) + j (2147483647) = k (-2)`

**This is an overflow. No exception is thrown when an overflow occurs.** Therefore, you **must pay close attention to data overflow issues** when performing arithmetic operations with the same data type.

## Wrapper Types

Java is an object-oriented language, but its basic data types are not objects, which can be inconvenient in practice. To address this, each basic data type has a corresponding class, collectively known as Wrapper Classes.

Wrapper classes are located in the `java.lang` package. Their correspondence is as follows:

| Basic Type | Wrapper Class |
| :--- | :--- |
| byte | Byte |
| boolean | Boolean |
| short | Short |
| char | Character |
| int | Integer |
| long | Long |
| float | Float |
| double | Double |

Except for `Integer` and `Character`, the wrapper class names are identical to the basic types but capitalized.

### Why are wrapper classes needed?

If basic types are more efficient, why provide wrapper classes?

The answer lies in Java being an object-oriented language. Many frameworks and features require objects. For example, in Collection classes, you cannot store `int` or `double` directly because collections require `Object` types. Wrapper classes allow basic types to have object characteristics, including attributes and methods.

## Unboxing and Boxing

Converting a basic data type to its corresponding wrapper class is called **boxing**. Conversely, converting a wrapper class back to its basic data type is called **unboxing**.

Before Java SE 5, boxing was done manually:
```java
Integer i = new Integer(10);
```

## Auto-Unboxing and Auto-Boxing

Java SE 5 introduced auto-unboxing and auto-boxing to simplify development.

- **Auto-boxing:** The automatic conversion of a basic data type into its corresponding wrapper class.
- **Auto-unboxing:** The automatic conversion of a wrapper class into its corresponding basic data type.

```java
Integer i = 10;  // Auto-boxing
int b = i;       // Auto-unboxing
```

## Implementation Principles

How does Java implement this? Let's look at the following code:

```java
public static void main(String[] args) {
``` 
Integer integer = 1; // Boxing
int i = integer;    // Unboxing
```
}
```

Decompiling this code reveals:

```java
public static void main(String[] args) {
``` 
Integer integer = Integer.valueOf(1);
int i = integer.intValue();
```
}
```

Thus, auto-boxing is implemented via the wrapper class's `valueOf()` method, and auto-unboxing is implemented via the object's `xxxValue()` method (e.g., `intValue()`).

## Where does auto-boxing and auto-unboxing occur?

### Scenario 1: Adding basic types to collections
```java
List<Integer> li = new ArrayList<>();
for (int i = 1; i < 50; i++) {
``` 
li.add(i);
```
}
```
Decompilation shows `li.add(Integer.valueOf(i));`. Auto-boxing occurs when basic types are added to a collection.

### Scenario 2: Comparison between wrapper and basic types
```java
Integer a = 1;
System.out.println(a == 1 ? "Equal" : "Not Equal");
```
Decompilation shows `a.intValue() == 1`. The wrapper class is unboxed for comparison.

### Scenario 3: Arithmetic operations on wrapper types
```java
Integer i = 10;
Integer j = 20;
System.out.println(i + j);
```
Wrapper types are unboxed to basic types for arithmetic operations.

### Scenario 4: Ternary operator usage
```java
boolean flag = true;
Integer i = 0;
int j = 1;
int k = flag ? i : j;
```
If the second and third operands are a wrapper type and a basic type respectively, the wrapper type is unboxed. If `i` is `null`, this will result in a NullPointerException (NPE).

### Scenario 5: Function parameters and return values
```java
public int getNum1(Integer num) { return num; } // Auto-unboxing
public Integer getNum2(int num) { return num; } // Auto-boxing
```

## Auto-Boxing/Unboxing and Caching

Java's `Integer` class includes a caching mechanism for values between -128 and 127 to save memory and improve performance.

```java
Integer integer1 = 3;
Integer integer2 = 3;
System.out.println(integer1 == integer2); // true

Integer integer3 = 300;
Integer integer4 = 300;
System.out.println(integer3 == integer4); // false
```
For values within -128 to 127, auto-boxing uses cached objects, so references are identical. For values outside this range, new objects are created. Note: `==` compares references, while `equals` compares values.

The cache range can be adjusted via `-XX:AutoBoxCacheMax=size` or `java.lang.Integer.IntegerCache.high`.

## Issues with Auto-Boxing/Unboxing

While convenient, it can introduce problems:
1. **Comparison:** Use `equals` for wrapper types to avoid reference comparison pitfalls.
2. **NPE:** Auto-unboxing a `null` object will throw a NullPointerException.
3. **Performance:** Excessive boxing/unboxing in a loop can waste resources.

## References
[Java Auto-Boxing and Unboxing](https://www.jianshu.com/p/cc9312104876)