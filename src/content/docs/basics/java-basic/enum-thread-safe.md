---
title: "Enum Thread Safe"
---

### How Enums Ensure Thread Safety

To look at the source code, we first need a class. So what kind of class is an enum type? Is it `enum`? The answer is obviously no. Like `class`, `enum` is just a keyword, not a class itself. So what class maintains an enum? Let's write a simple enum:

```java
public enum T {
``` 
SPRING, SUMMER, AUTUMN, WINTER;
```
}
```

Then we use decompilation to see how this code is implemented. After [Java decompilation](/archives/58), the code content is as follows:

```java
public final class T extends Enum
{
``` java
private T(String s, int i)
{
    super(s, i);
}
public static T[] values()
{
    T at[];
    int i;
    T at1[];
    System.arraycopy(at = ENUM$VALUES, 0, at1 = new T[i = at.length], 0, i);
    return at1;
}

public static T valueOf(String s)
{
    return (T)Enum.valueOf(demo/T, s);
}

public static final T SPRING;
public static final T SUMMER;
public static final T AUTUMN;
public static final T WINTER;
private static final T ENUM$VALUES[];
static
{
    SPRING = new T("SPRING", 0);
    SUMMER = new T("SUMMER", 1);
    AUTUMN = new T("AUTUMN", 2);
    WINTER = new T("WINTER", 3);
    ENUM$VALUES = (new T[] {
        SPRING, SUMMER, AUTUMN, WINTER
    });
}
```
}
```

Through the decompiled code, we can see `public final class T extends Enum`, which means this class inherits from the `Enum` class. Meanwhile, the `final` keyword tells us that this class cannot be inherited. When we use `enum` to define an enum type, the compiler automatically creates a `final` class that inherits from the `Enum` class, so enum types cannot be inherited. We see several attributes and methods in this class.

We can see:

```java
public static final T SPRING;
public static final T SUMMER;
public static final T AUTUMN;
public static final T WINTER;
private static final T ENUM$VALUES[];
static
{
``` 
SPRING = new T("SPRING", 0);
SUMMER = new T("SUMMER", 1);
AUTUMN = new T("AUTUMN", 2);
WINTER = new T("WINTER", 3);
ENUM$VALUES = (new T[] {
    SPRING, SUMMER, AUTUMN, WINTER
});
```
}
```

These are all `static` types because `static` attributes are initialized after the class is loaded. As we introduced in [Deep Analysis of Java ClassLoader Mechanism (Source Code Level)](/archives/199) and [Java Class Loading, Linking, and Initialization](/archives/201), static resources are initialized when a Java class is first truly used, and the loading and initialization process of Java classes are thread-safe. Therefore, **creating an enum type is thread-safe**.
