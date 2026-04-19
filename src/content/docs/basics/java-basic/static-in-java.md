---
title: "Static In Java"
---

`static` means "static" and is used to modify member variables and member methods. It can also form static code blocks.

### Static Variables

We use `static` to indicate the level of a variable. A static variable in a class does not belong to the objects or instances of the class. Because static variables are shared with all object instances, they are not thread-safe.

Usually, static variables are modified with the `final` keyword to indicate a common resource or that they can be used by all objects. If a static variable is not made private, it can be used in the form of "ClassName.VariableName".

```java
//static variable example
private static int count;
public static String str;
```

### Static Methods

Like static variables, static methods belong to the class rather than instances.

A static method can only use static variables and call static methods. Usually, static methods are used when you want other classes to use them without creating an instance. For example: the `Collections` class.

Java's wrapper classes and utility classes contain many static methods. The `main()` method is the entry point of a Java program and is a static method.

```java
//static method example
public static void setCount(int count) {
``` 
if(count > 0)
StaticExample.count = count;
```
}

//static util method
public static int addInts(int i, int...js){
``` 
int sum=i;
for(int x : js) sum+=x;
return sum;
```
}
```

Starting from Java 8 and above, there can also be static methods of interface types.

### Static Code Blocks

Java's static blocks are a group of instructions executed by the Java ClassLoader in memory when the class is loaded.

Static blocks are commonly used to initialize static variables of a class. Most of the time, they are also used to create static resources when the class is loaded.

Java does not allow the use of non-static variables in static blocks. A class can have multiple static blocks, although this seems useless. A static block is executed only once when the class is loaded into memory.

```java
static{
``` java
//can be used to initialize resources when class is loaded
System.out.println("StaticExample static block");
//can access only static variables and methods
str="Test";
setCount(2);
```
}
```

### Static Classes

Java can use static classes nestedly, but a static class cannot be used for the top level of nesting.

The use of static nested classes is the same as other top-level classes; nesting is only for ease of project packaging.

Original address: https://zhuanlan.zhihu.com/p/26819685
