---
title: "Instanceof In Java"
---

`instanceof` is a binary operator in Java, similar to `==`, `>`, and `<`.

As a reserved keyword, `instanceof` tests whether the object on its left is an instance of the class (or subclass/interface) on its right, returning a `boolean`.

The following example demonstrates the usage of the `instanceof` keyword in the `displayObjectClass()` method:

```java
public static void displayObjectClass(Object o) {
``` 
if (o instanceof Vector)
    System.out.println("The object is an instance of the java.util.Vector class.");
else if (o instanceof ArrayList)
    System.out.println("The object is an instance of the java.util.ArrayList class.");
else
    System.out.println("The object is an instance of the " + o.getClass() + " class.");
```
}
```
