---
title: "Integer Scope"
---

Integer types in Java primarily consist of `byte`, `short`, `int`, and `long`. Their numerical ranges increase accordingly, determined by the number of bytes they occupy in memory.

As a quick refresher: 1 byte = 8 bits. Integer types in Java are signed.

Let's look at the numbers an 8-bit space can represent:
*   Minimum value: `10000000` (-128) (-2^7)
*   Maximum value: `01111111` (127) (2^7-1)

The Java integer types are defined as follows:

*   **byte**: Uses 1 byte. Range: -128 (-2^7) to 127 (2^7-1). The default value is 0.
*   **short**: Uses 2 bytes. Range: -32,768 (-2^15) to 32,767 (2^15-1). The default value is 0. Due to Java's type conversion, it can usually be initialized directly as 0.
*   **int**: Uses 4 bytes. Range: -2,147,483,648 (-2^31) to 2,147,483,647 (2^31-1). The default value is 0.
*   **long**: Uses 8 bytes. Range: -9,223,372,036,854,775,808 (-2^63) to 9,223,372,036,854,775,807 (2^63-1). The default value is 0L or 0l, or simply 0.

As mentioned, each type has a specific range. However, certain calculations in a program can exceed these limits, resulting in an overflow. Consider the following code:

```java
int i = Integer.MAX_VALUE;
int j = Integer.MAX_VALUE;

int k = i + j;
System.out.println("i (" + i + ") + j (" + j + ") = k (" + k + ")");
```

Output: `i (2147483647) + j (2147483647) = k (-2)`

This is an example of overflow. When overflow occurs, Java does not throw an exception or provide any warning. Therefore, you must be cautious about data overflow when performing operations on data of the same type.
