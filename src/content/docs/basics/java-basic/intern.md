---
title: "Intern"
---

In the JVM, to reduce the duplicated creation of identical strings and save memory, a separate memory area is dedicated to storing string constants, known as the String Constant Pool.

When a string is created in the code using double quotes (literal), the JVM first checks this string. If a reference to a string object with the same content exists in the string constant pool, it returns that reference. Otherwise, it creates a new string object, puts the reference into the string constant pool, and returns the reference.

In addition to the above method, there is another way to place string content into the string constant pool at runtime, which is by using the `intern` method.

The function of `intern` is very simple:

Using the `intern` method of `String` during each assignment will reuse the object if the same value exists in the constant pool and return the object reference.
