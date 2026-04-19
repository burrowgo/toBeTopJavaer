---
title: "Float"
---

We know that the storage and calculation of computer numbers are carried out through binary. For converting decimal integers to binary integers, the "divide by 2 and take remainder, reverse order arrangement" method is used.

The specific method is:

* Divide the decimal integer by 2 to get a quotient and a remainder.
* Then divide the quotient by 2 to get another quotient and remainder. Continue this process until the quotient is less than 1.
* Then arrange the remainders in reverse order, with the first remainder as the least significant bit and the last remainder as the most significant bit.

For example, if we want to convert 127 to binary, the process is as follows:

![-w624](https://www.hollischuang.com/wp-content/uploads/2020/10/16024170911973.jpg)

So, how to calculate the conversion of decimal decimals to binary decimals?

Converting decimal decimals to binary decimals uses the "multiply by 2 and take integer part, sequential arrangement" method.

The specific method is:

* Multiply the decimal decimal by 2 to get a product.
* Take the integer part of the product, then multiply the remaining decimal part by 2 to get another product.
* Take the integer part of this product again, and continue this process until the decimal part of the product is zero. At this point, 0 or 1 is the last bit of the binary. Or until the required precision is reached.

For example, try converting 0.625 to binary:

![-w624](https://www.hollischuang.com/wp-content/uploads/2020/10/16024172361526.jpg)

But 0.625 is a special case. Using the same algorithm, please calculate the binary corresponding to 0.1:

![-w624](https://www.hollischuang.com/wp-content/uploads/2020/10/16024175486626.jpg)

We find that an infinite loop occurs in the binary representation of 0.1, which is (0.1)10 = (0.000110011001100...)2.

In this case, the computer cannot represent 0.1 exactly in binary.

Therefore, to solve the problem that some decimals cannot be accurately represented in binary, the IEEE 754 specification was introduced.

The IEEE Standard for Floating-Point Arithmetic (IEEE 754) is the most widely used floating-point arithmetic standard since the 1980s and is adopted by many CPUs and floating-point units.

> Floating-point numbers and decimals are not exactly the same. The representation of decimals in computers actually has two types: fixed-point and floating-point. Because with the same number of bits, the representation range of fixed-point numbers is smaller than that of floating-point numbers. Therefore, in computer science, floating-point numbers are used to represent approximate values of real numbers.

IEEE 754 specifies four ways to represent floating-point values: single precision (32-bit), double precision (64-bit), extended single precision (above 43 bits, rarely used), and extended double precision (above 79 bits, usually implemented with 80 bits).

The most commonly used are 32-bit single-precision floating-point numbers and 64-bit double-precision floating-point numbers.

IEEE did not solve the problem that decimals cannot be accurately represented; it just proposed a way to represent decimals using approximate values and introduced the concept of precision.

A floating-point number `a` is represented by two numbers `m` and `e`: `a = m x b^e`.

In any such system, we choose a base `b` (the base of the number system) and precision `p` (how many bits are used for storage). `m` (the mantissa) is a `p`-digit number in the form of +/-d.ddd...ddd (each digit is an integer between 0 and b-1, inclusive).

If the first digit of `m` is a non-zero integer, `m` is said to be normalized. Some descriptions use a separate sign bit (s represents + or -) to represent positive or negative, so `m` must be positive. `e` is the exponent.
