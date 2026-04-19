---
title: "Big Endian Vs Little Endian"
---

Byte order, also known as endianness, refers to the order in which multi-byte data is stored in memory.

On almost all machines, multi-byte objects are stored as a contiguous sequence of bytes. For example, if the starting address of a 4-byte `int` variable `a` in C/C++ is `&a = 0x100`, then the four bytes of `a` will be stored at memory locations `0x100`, `0x101`, `0x102`, and `0x103`.

Depending on the storage order of the integer `a` within these 4 bytes, byte order is classified into two types: Big Endian and Little Endian.

- **Big Endian:** The most significant byte (MSB) is stored at the lowest memory address.
- **Little Endian:** The least significant byte (LSB) is stored at the lowest memory address.

For example, the number `0x12345678` would be stored as follows:
- **Big Endian:** `12 34 56 78`
- **Little Endian:** `78 56 34 12`

Java uses **Big Endian** to store data, while C/C++ typically uses **Little Endian**. In network transmissions, the standard network byte order is **Big Endian**, which is consistent with Java.

Therefore, when writing communication programs in C/C++, it is essential to convert integer and short-integer data from host byte order to network byte order before sending, and back to host byte order after receiving. If one side is a Java program and the other is a C/C++ program, the C/C++ side must perform these conversions. The Java side requires no additional processing because Java's byte order matches the network byte order. If both sides are Java programs, you don't need to worry about byte order at all.