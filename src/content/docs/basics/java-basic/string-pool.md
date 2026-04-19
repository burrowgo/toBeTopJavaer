---
title: "String Pool"
---

Strings are something everyone is familiar with; it is a very commonly used class.

As a Java class, a String can be created in the following two ways:

```java
String str = "Hollis";

String str = new String("Hollis");
```

The first one is our more common practice, and this form is called a "literal".

In the JVM, to reduce the repetitive creation of the same strings and to save memory, a separate piece of memory is allocated to save string constants. This memory area is called the String Constant Pool.

When a string object is created in the code using double quotes (literal), the JVM first checks this string. If a reference to a string object with the same content exists in the string constant pool, that reference is returned; otherwise, a new string object is created, then this reference is placed into the string constant pool, and the reference is returned.

This mechanism is known as string interning or pooling.

### Location of the String Constant Pool

In versions prior to JDK 7, the string constant pool was located in the Permanent Generation.

As planned, the JDK would replace the Permanent Generation with Metaspace in subsequent versions. Therefore, starting in JDK 7, the string constant pool was first moved out of the Permanent Generation and temporarily placed in the Heap memory.

In JDK 8, the Permanent Generation was completely removed and replaced by Metaspace. Consequently, the string constant pool moved from the Heap memory back to the "Permanent Generation" (actually part of the heap but managed differently, or more accurately, it stayed in the heap while other permanent gen data moved to Metaspace).

*Correction: In JDK 7 and later, the String Pool is in the Heap. In JDK 8, the Permanent Generation was replaced by Metaspace, but the String Pool remained in the Heap.*