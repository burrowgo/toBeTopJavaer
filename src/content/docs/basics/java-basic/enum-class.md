---
title: "Enum Class"
---

In Java, enums are defined using the `enum` keyword, but there is also a `java.lang.Enum` class. This is an abstract class defined as follows:

```java
package java.lang;

public abstract class Enum<E extends Enum<E>> implements Constable, Comparable<E>, Serializable {
``` java
private final String name;
private final int ordinal;
```
}
```

While we don't directly use this class in daily development, enums defined with the `enum` keyword are actually implemented by inheriting from the `Enum` class.

When you use `enum` to define an enumeration type, the compiler automatically generates a `final` class that inherits from the `Enum` class. This is why enum types cannot be further inherited.