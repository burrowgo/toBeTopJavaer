---
title: "Byte Stream Vs Character Stream"
---

### Byte vs. Character

Bit: The smallest binary unit, the operational part of the computer. Takes value 0 or 1.

Byte: The smallest unit for a computer to operate data, consisting of 8 bits. Value range (-128 to 127).

Char (Character): The smallest unit for a user to read and write, consisting of 16 bits in Java. Value range (0 to 65535).

### Byte Stream

Operates on `byte` type data. The main operation classes are subclasses of `OutputStream` and `InputStream`. It does not use a buffer and operates directly on the file itself.

### Character Stream

Operates on character type data. The main operation classes are subclasses of `Reader` and `Writer`. It uses a buffer to buffer characters. If the stream is not closed, nothing will be output.

### Conversion

```java
The entire IO package is actually divided into byte streams and character streams, but besides these two streams, there is also a set of byte stream-character stream conversion classes.
```

`OutputStreamWriter`: A subclass of `Writer` that changes an output character stream into a byte stream, i.e., changing an output object of a character stream into an output object of a byte stream.

`InputStreamReader`: A subclass of `Reader` that changes an input byte stream into a character stream, i.e., changing an input object of a byte stream into an input object of a character stream.
