---
title: "Variable"
---

There are three types of variables in Java: class variables, instance variables (member variables), and local variables. They are stored in the JVM's method area, heap memory, and stack memory, respectively.

```java
/**
 * @author Hollis
 */
public class Variables {
    
``` java
/**
 * Class variable
 */
private static int a;
    
/**
 * Instance variable
 */
```java
private int b;
```
    
/**
 * Local variable
 * @param c
 */
```java
public void test(int c){
    int d;
}
```
```
}
```
Among the three variables defined above, variable `a` is a class variable, variable `b` is an instance variable, and variables `c` and `d` are local variables.

As a class variable, `a` is stored in the method area; `b`, as an instance variable, is stored in the heap memory along with the object (excluding stack allocation scenarios); `c` and `d`, as local variables of the method, are stored in the stack memory.

The reason for focusing on these three types of variables in this chapter is that many people do not know the differences between them, and consequently do not know where they are stored. This leads to uncertainty about which variables need to consider concurrency issues.

Concurrency issues are not covered in this "Basics" section of the book but will be highlighted in the next "Concurrency" section. Here is a brief explanation:

Since only shared variables encounter concurrency issues, variables `a` and `b` are shared variables, while variables `c` and `d` are non-shared variables. Therefore, in multi-threaded scenarios, operations on variables `a` and `b` need to consider thread safety, whereas operations on variables `c` and `d` do not.