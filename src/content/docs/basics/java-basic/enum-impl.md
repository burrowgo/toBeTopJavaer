---
title: "Enum Impl"
---

Java SE5 provides a new type - Java's enumeration type. The keyword `enum` can create a finite set of named values as a new type, and these named values can be used as regular program components. This is a very useful function.

To see the source code, you must first have a class. What class is the enumeration type? Is it `enum`? The answer is obviously no. `enum` is just a keyword like `class`, it is not a class. Then what class is used to maintain the enumeration? Let's simply write an enumeration:

``` java
public enum t {
    SPRING,SUMMER;
}
```
Then we use decompilation to see how this code is implemented. The decompiled code content is as follows:

``` java
public final class T extends Enum
{
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
    private static final T ENUM$VALUES[];
    static
    {
        SPRING = new T("SPRING", 0);
        SUMMER = new T("SUMMER", 1);
        ENUM$VALUES = (new T[] {
            SPRING, SUMMER
        });
    }
}
```
    
Through the decompiled code, we can see `public final class T extends Enum`, which shows that this class inherits from the `Enum` class. At the same time, the `final` keyword tells us that this class cannot be inherited.

**When we use `enum` to define an enumeration type, the compiler will automatically help us create a `final` class that inherits from the `Enum` class, so the enumeration type cannot be inherited.**
