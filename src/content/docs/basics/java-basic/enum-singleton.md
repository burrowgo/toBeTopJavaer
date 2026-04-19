---
title: "Enum Singleton"
---

I have discussed the singleton pattern extensively on my blog. As the most common of the 23 design patterns, it is more nuanced than it seems. Designing a robust singleton requires addressing thread safety and preventing serialization from breaking the instance.

### Singleton Articles:
- [Design Patterns (2) - Singleton Pattern][1]
- [Design Patterns (3) - Singletons in the JDK][2]
- [Seven Ways to Write Singleton Pattern][3]
- [Singleton and Serialization][4]
- [Thread-Safe Singleton Without Synchronized or Lock][5]
- [Thread-Safe Singleton Without Synchronized or Lock (Part 2)][6]

If you are unfamiliar with these challenges, I recommend reading the articles above for a deeper understanding.

While there are generally seven ways to implement a singleton, which is the best? Let's analyze.

### The Best Way to Implement a Singleton

On StackOverflow, a popular discussion titled "[What is an efficient way to implement a singleton pattern in Java?][7]" identifies **enums** as the top choice.

The answer cites Joshua Bloch's *Effective Java*:
> "A single-element enum type is the best way to implement a singleton."

If you understand the pitfalls of singletons, you'll likely agree: enums are an excellent choice.

### Simplicity of Enum Singletons

Compared to other methods, enum singletons are remarkably concise. Most other implementations are bulky because they must manually manage thread safety.

**Double-Checked Locking:**
```java
public class Singleton {  
``` java
private volatile static Singleton singleton;  
private Singleton (){}  
public static Singleton getSingleton() {  
    if (singleton == null) {  
        synchronized (Singleton.class) {  
            if (singleton == null) {  
                singleton = new Singleton();  
            }  
        }  
    }  
    return singleton;  
}  
```
}  
```

**Enum Singleton:**
```java
public enum Singleton {  
``` java
INSTANCE;  
```java
public void whateverMethod() {}  
```
```
}  
```

The enum version is much cleaner and avoids the complexities of locking while also solving serialization issues that double-checked locking fails to address.

### Enum and Thread Safety

Non-enum singletons require manual thread-safety management. Enums, however, handle this at a "lower level."

As detailed in my post "[Deep Analysis of Java Enum Types - Thread Safety and Serialization][8]", using `enum` is similar to defining a class. When decompiled, an enum like:
```java
public enum T { SPRING, SUMMER, AUTUMN, WINTER; }
```
becomes:
```java
public final class T extends Enum {
``` java
public static final T SPRING;
// ... other constants
static {
    SPRING = new T("SPRING", 0);
    // ... initialization
}
```
}
```
Static properties are initialized when the class is loaded. The JVM's class-loading mechanism (specifically `ClassLoader.loadClass`) is inherently thread-safe. Therefore, an enum singleton is automatically thread-safe during its initialization.

### Preventing Serialization from Breaking Singletons

Double-checked locking singletons can be compromised by serialization (see [Singleton and Serialization][4]). Enums avoid this by following the [Java Object Serialization Specification][12]:

Serialization only outputs the enum's name. During deserialization, `Enum.valueOf` is used to find the existing constant. Ordinary deserialization uses reflection to bypass private constructors and create new instances, breaking the singleton. Enums use a specialized mechanism that prevents this.

### Summary

Enums are the simplest and most robust way to implement a singleton. The `enum` keyword ensures thread-safe initialization handled by the JVM. Additionally, Java's specialized serialization for enums prevents the instance from being duplicated via reflection or deserialization.

 [1]: http://www.hollischuang.com/archives/1373
 [2]: http://www.hollischuang.com/archives/1383
 [3]: http://www.hollischuang.com/archives/205
 [4]: http://www.hollischuang.com/archives/1144
 [5]: http://www.hollischuang.com/archives/1860
 [6]: http://www.hollischuang.com/archives/1866
 [7]: https://stackoverflow.com/questions/70689/what-is-an-efficient-way-to-implement-a-singleton-pattern-in-java
 [8]: http://www.hollischuang.com/archives/197
 [9]: http://www.hollischuang.com/archives/58
 [10]: http://www.hollischuang.com/archives/199
 [11]: http://www.hollischuang.com/archives/201
 [12]: https://docs.oracle.com/javase/7/docs/platform/serialization/spec/serial-arch.html#6469
