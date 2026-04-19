---
title: "Length Of String"
---

I previously wrote an article analyzing whether `String` has a length limit. Recently, I revisited this question and gained some new insights. I have reorganized the content to include additional verification steps and corrections. During this analysis, I will attempt to debug the JDK compilation process and refer to the JVM specifications to provide a comprehensive overview.

Because this topic involves Java compilation principles, it might be easier to understand via video. I have uploaded a video to Bilibili: [[Soul Question]Does String in Java really have a length limit?](https://www.bilibili.com/video/BV1uK4y1t7H1/)

### String Length Limit

To understand this issue, we first need to examine the `String` source code to see if there are any definitions or restrictions regarding length.

The `String` class has several overloaded constructors, some of which allow the user to pass a `length` parameter:

```java
public String(byte bytes[], int offset, int length)
```

As we can see, the `length` parameter is defined as an `int`. This means that, at least in terms of definition, the maximum supported length for a `String` is the maximum value of an `int`.

According to the `Integer` class, the maximum value of `java.lang.Integer#MAX_VALUE` is 2^31 - 1.

Does this mean we can assume that the maximum length a `String` can support is this value?

Not exactly. This value represents the maximum length supported when constructing a `String` at **runtime**. In reality, there is also a length limit when defining a string literal at **compile-time**.

Consider the following code:

```java
String s = "11111...1111"; // Imagine 100,000 "1" characters here
```

If we define a string this way and compile it using `javac`, an error will be thrown:

```text
error: constant string too long
```

Wait, if the `String` constructor supports a length up to 2,147,483,647 (2^31 - 1), why does the above definition fail to compile?

When a `String` is defined as `String s = "xxx";`, the "xxx" is called a string literal. After compilation, this literal is stored in the Class Constant Pool.

This brings us to the rules governing the constant pool.

### Constant Pool Limits

`javac` is the command that compiles Java files into `.class` files. During the generation of the Class file, a specific format must be followed.

According to section 4.4 of the *Java Virtual Machine Specification*, `CONSTANT_String_info` represents constant objects of type `java.lang.String`. Its format is:

```text
CONSTANT_String_info {
``` 
u1 tag;
u2 string_index;
```
}
```

The `string_index` must be a valid index into the constant pool, and the entry at that index must be a `CONSTANT_Utf8_info` structure. This structure represents a sequence of Unicode code points that will eventually be initialized as a `String` object.

The `CONSTANT_Utf8_info` structure is defined as:

```text
CONSTANT_Utf8_info {
``` 
u1 tag;
u2 length;
u1 bytes[length];
```
}
```

Here, `length` specifies the number of bytes in the `bytes[]` array. Its type is `u2`.

By consulting the *Specification*, we learn that `u2` represents a 2-byte unsigned integer. Since 1 byte has 8 bits, 2 bytes have 16 bits.

The maximum value a 16-bit unsigned integer can represent is 2^16 - 1 = 65,535.

Therefore, the Class file format dictates that a string constant's length cannot exceed 65,535.

However, if we try to define a string with exactly 65,535 characters:

```java
String s = "11111...1111"; // 65,535 "1" characters
```

Compiling this with `javac` will still result in the "constant string too long" error. Why?

The reason can be found in the `javac` source code, specifically in the `Gen` class:

```java
private void checkStringConstant(DiagnosticPosition var1, Object var2) {
``` 
if (this.nerrs == 0 && var2 != null && var2 instanceof String && ((String)var2).length() >= 65535) {
    this.log.error(var1, "limit.string", new Object[0]);
    ++this.nerrs;
}
```
}
```

As shown, if the `String` length is **greater than or equal to 65,535**, the compilation fails. You can verify this by debugging the `javac` compilation process.

A string defined with 65,534 characters will compile successfully.

Interestingly, the *Java Virtual Machine Specification* mentions this value regarding another context:

> if the Java Virtual Machine code for a method is exactly 65535 bytes long and ends with an instruction that is 1 byte long, then that instruction cannot be protected by an exception handler. A compiler writer can work around this bug by limiting the maximum size of the generated Java Virtual Machine code for any method... to 65534 bytes.

### Runtime Limits

The restriction mentioned above applies only to the compilation phase when using string literals.

Does `String` have a limit at runtime? Yes, it is the `Integer.MAX_VALUE` mentioned earlier. This value is approximately 4GB. If a `String`'s length exceeds this at runtime, an exception may be thrown (prior to JDK 1.9).

An `int` is a 32-bit signed type. The maximum positive value is:
- 2^31 - 1 = 2,147,483,647 16-bit Unicode characters.
- Total bits: 2,147,483,647 * 16 = 34,359,738,352 bits.
- Total bytes: 34,359,738,352 / 8 = 4,294,967,294 Bytes ~ 4GB.

You might wonder how a string could exceed 65,535 characters at runtime if it's restricted during compilation. This is actually quite common, such as through concatenation:

```java
String s = "";
for (int i = 0; i < 100000; i++) {
``` 
s += "i";
```
}
```

The resulting string length is 100,000. I have personally encountered this when handling high-definition images converted to BASE64 strings for transmission between systems. Assigning the BASE64 content to a string caused an exception because it exceeded the limit.

### Summary

Strings have length limits. At **compile-time**, string constants in the pool cannot exceed 65,535 bytes, and `javac` specifically restricts the maximum length to 65,534 characters.

At **runtime**, the length cannot exceed the range of an `int` (`Integer.MAX_VALUE`), or an exception will occur.

For more details on experimental testing, consulting specifications, and `javac` debugging tips, you can watch my video ([jump here](https://www.bilibili.com/video/BV1uK4y1t7H1/)).