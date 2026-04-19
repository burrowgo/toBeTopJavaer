---
title: "Stop Create Bigdecimal With Double"
---

It is widely known that for financial representation and calculations, you should avoid using `double` or `float` and instead use `BigDecimal`, which offers superior precision.

Consequently, `BigDecimal` is frequently used in payment, e-commerce, and financial applications. **However, if you believe that simply using `BigDecimal` guarantees absolute precision, you are mistaken!**

In a previous article, we discussed how `BigDecimal.equals()` doesn't necessarily mean two numbers are mathematically equal (see [Why Alibaba Forbids Using BigDecimal.equals() for Value Comparison][1]).

Beyond that, the first step - creating the `BigDecimal` object - is where many developers falter. If the initialization is flawed, all subsequent calculations will be incorrect.

So, how do you correctly create a `BigDecimal`?

**I have reviewed countless lines of code and interviewed many senior developers, and many still fall into this trap. It's a subtle but high-impact issue.**

The *Alibaba Java Development Manual* provides a specific requirement:

![][2]

This is a **[Mandatory]** rule. Let's explore the reasoning behind it.

To understand this, we need to answer two questions:
1. Why is `double` imprecise?
2. How does `BigDecimal` maintain precision?

### Why double is Imprecise

Computers operate purely on binary (0s and 1s). All numbers must be converted to binary for storage and processing.

Converting a decimal integer to binary is straightforward (e.g., 10 is `1010`). However, decimals are a different story. Converting a decimal fraction to binary often involves "multiplying by 2 and taking the integer part." For example, 0.625 is `0.101`.

But not all decimals have a clean binary representation. For example, 0.1 in binary is `0.000110011001100...`, an infinite recurring sequence. **Computers cannot store this accurately.**

To handle this, systems use approximations based on a certain level of precision, as defined by the IEEE 754 standard. Java's `float` and `double` represent 32-bit single-precision and 64-bit double-precision floating-point numbers, respectively. Since they only keep a finite number of significant digits, they are inherently imprecise.

### How BigDecimal Ensures Precision

Looking at the `BigDecimal` source code, we see it represents a number using an "unscaled value" and a "scale."

```java
public class BigDecimal extends Number implements Comparable<BigDecimal> {
``` java
private final BigInteger intVal;
private final int scale; 
private final transient long intCompact;
```
}
```

**What is the "scale"?**
If the scale is zero or positive, it represents the number of digits to the right of the decimal point. If negative, the unscaled value is multiplied by 10 to the power of the absolute value of the scale. 

For example, 123.123 has an unscaled value of 123123 and a scale of 3. Crucially, 0.1 can be represented exactly as an unscaled value of 1 and a scale of 1.

### The Pitfall of BigDecimal(double)

`BigDecimal` offers a constructor that takes a `double`, but it is a trap. Since `double` only stores an approximation of 0.1, `new BigDecimal(0.1)` results in a value like `0.1000000000000000055511151231257827021181583404541015625`.

![][3]

**Using this constructor introduces a loss of precision immediately, which can lead to catastrophic errors in financial calculations.**

### The Correct Way: BigDecimal(String)

To represent a decimal exactly, use the `String` constructor. `new BigDecimal("0.1")` results in a value that is exactly 0.1 with a scale of 1.

Note: `new BigDecimal("0.10000")` and `new BigDecimal("0.1")` have scales of 5 and 1, respectively. Using `.equals()` on them will return `false`.

To accurately represent 0.1, use these recommended methods:
```java
BigDecimal recommend1 = new BigDecimal("0.1");
BigDecimal recommend2 = BigDecimal.valueOf(0.1);
```

*Thought Exercise: `BigDecimal.valueOf(0.1)` uses `Double.toString()`. If `double` is imprecise, how does this method remain accurate?*

### Summary

Due to binary limitations, many decimals like 0.1 cannot be represented exactly in computer hardware, leading to the use of approximations like `float` and `double`. 

Using the `BigDecimal(double)` constructor carries over this imprecision. To ensure accuracy, always initialize `BigDecimal` with a `String` or use `BigDecimal.valueOf()`. This ensures that 0.1 is stored exactly as a combination of an unscaled value (1) and a scale (1).

 [1]: https://mp.weixin.qq.com/s/iiZW9xr1Xb2JIaRFnWLZUg
 [2]: https://www.hollischuang.com/wp-content/uploads/2021/01/16119907257353.jpg
 [3]: https://www.hollischuang.com/wp-content/uploads/2021/01/16119945021181.jpg
