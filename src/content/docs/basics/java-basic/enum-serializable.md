---
title: "Enum Serializable"
---

> Preface: Java SE5 introduced a new type - [Java Enum type](/archives/195), where the `enum` keyword can create a new type from a finite set of named values, which can be used as regular program components. This is a very useful feature. This article will deeply analyze the source code of enums to see how they are implemented, how they ensure thread safety, and why using enums to implement singletons is the best way.

<!--more-->

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

### Why Singleton Implemented with Enums is the Best Way

In [[Reprint + Note] Seven Ways to Write Singleton Pattern](/archives/205), we see a total of seven ways to implement singletons. Among them, *Effective Java* author `Josh Bloch` advocates using enums. Since the master says it's good, we need to know why?

**1. Simple Writing**

> The writing is simple. You can see the difference by looking at the implementations in [[Reprint + Note] Seven Ways to Write Singleton Pattern](/archives/205).

```java
public enum EasySingleton{
``` 
INSTANCE;
```
}
```

You can access it via `EasySingleton.INSTANCE`.

**2. Enums Handle Serialization Themselves**

> We know that all previous singleton patterns had a major problem: once they implemented the `Serializable` interface, they were no longer singletons because every call to the `readObject()` method returned a newly created object. One solution is to use the `readResolve()` method to avoid this. However, **to ensure that enum types are unique in the JVM as specified in the Java specification, Java has special regulations on the serialization and deserialization of enum types.** The original text is as follows:
> 
> > Enum constants are serialized differently than ordinary serializable or externalizable objects. The serialized form of an enum constant consists solely of its name; field values of the constant are not present in the form. To serialize an enum constant, ObjectOutputStream writes the value returned by the enum constant's name method. To deserialize an enum constant, ObjectInputStream reads the constant name from the stream; the deserialized constant is then obtained by calling the java.lang.Enum.valueOf method, passing the constant's enum type along with the received constant name as arguments. Like other serializable or externalizable objects, enum constants can function as the targets of back references appearing subsequently in the serialization stream. The process by which enum constants are serialized cannot be customized: any class-specific writeObject, readObject, readObjectNoData, writeReplace, and readResolve methods defined by enum types are ignored during serialization and deserialization. Similarly, any serialPersistentFields or serialVersionUID field declarations are also ignored--all enum types have a fixedserialVersionUID of 0L. Documenting serializable fields and data for enum types is unnecessary, since there is no variation in the type of data sent.
> 
> This roughly means that during serialization, Java only outputs the `name` attribute of the enum object to the result. During deserialization, it finds the enum object by name using the `valueOf` method of `java.lang.Enum`. Meanwhile, the compiler does not allow any customization of this serialization mechanism, thus disabling methods such as `writeObject`, `readObject`, `readObjectNoData`, `writeReplace`, and `readResolve`. Let's look at this `valueOf` method:

```java
public static <T extends Enum<T>> T valueOf(Class<T> enumType, String name) {  
``` 
T result = enumType.enumConstantDirectory().get(name);  
if (result != null)  
    return result;  
if (name == null)  
    throw new NullPointerException("Name is null");  
throw new IllegalArgumentException(  
    "No enum const " + enumType +"." + name);  
```
}  
```

From the code, we can see it tries to get the enum object named `name` from the `map` returned by calling the `enumConstantDirectory()` method of the `enumType` `Class` object. If it doesn't exist, an exception is thrown. Further following the `enumConstantDirectory()` method, we find it eventually calls the static `values()` method of the `enumType` via reflection (the method the compiler created for us), and then fills the `enumConstantDirectory` attribute in the `enumType` `Class` object with the returned result.

Therefore, **the JVM guarantees serialization.**

**3. Enum Instance Creation is Thread-Safe**

> As introduced in [Deep Analysis of Java ClassLoader Mechanism (Source Code Level)](/archives/199) and [Java Class Loading, Linking, and Initialization](/archives/201), static resources are initialized when a Java class is first truly used, and the loading and initialization process of Java classes are thread-safe. Therefore, **creating an enum type is thread-safe**.
