---
title: "Stack Alloc"
---

### JVM Memory Allocation Strategy

This article provides a brief review of JVM memory structure and allocation. Standard common knowledge includes:

1. According to the Java Virtual Machine Specification, JVM-managed memory includes the Method Area, VM Stack, Native Method Stack, Heap, and Program Counter.
2. Runtime data storage is typically thought of as Heap and Stack. The "Stack" here refers to the VM Stack, specifically the local variable table.
3. The stack stores primitive type data (`int`, `short`, `long`, `byte`, `float`, `double`, `boolean`, `char`) and object references.
4. The heap primarily stores objects created via the `new` keyword.
5. Array reference variables are stored in the stack, while array elements reside in the heap.

In *Understanding the JVM*, the Java heap is described as follows:
"However, with the evolution of JIT compilation and escape analysis, technologies like stack allocation and scalar replacement have introduced subtle changes. The rule that 'all objects are allocated on the heap' is no longer absolute."

This statement is often glazed over by those unfamiliar with JIT and escape analysis.

**Note: This article assumes basic knowledge of JIT. If unfamiliar, please research it briefly before continuing.**

During compilation, JIT performs optimizations to reduce heap allocation pressure. A key technique is **Escape Analysis**.

### Escape Analysis

Escape Analysis (EA) is a cutting-edge optimization in the JVM. It is a cross-function, global data flow analysis algorithm that reduces synchronization load and heap allocation pressure. By using EA, the Java HotSpot compiler analyzes the scope of a new object's reference to decide if it should be allocated to the heap.

The core of EA is analyzing an object's dynamic scope: once defined in a method, an object might be referenced externally (e.g., passed as a parameter), which is known as **Method Escape**.

Example:
```java
public static StringBuffer createStringBuffer(String s1, String s2) {
``` 
StringBuffer sb = new StringBuffer();
sb.append(s1);
sb.append(s2);
return sb;
```
}
```
`StringBuffer sb` is a local variable, but it is returned directly. Thus, other methods can modify it, meaning its scope extends beyond the method. It has "escaped." If it can be accessed by other threads (e.g., assigned to a class variable), it is called **Thread Escape**.

To prevent escape, you could write:
```java
public static String createStringBuffer(String s1, String s2) {
``` 
StringBuffer sb = new StringBuffer();
sb.append(s1);
sb.append(s2);
return sb.toString();
```
}
```
Since `sb` itself isn't returned, it doesn't escape the method.

EA allows the compiler to perform these optimizations:

1. **Synchronization Omission (Lock Elision):** If an object is only accessible from one thread, synchronization operations on it can be removed.
2. **Heap to Stack Allocation:** If an object does not escape a method, it becomes a candidate for stack allocation instead of heap allocation.
3. **Scalar Replacement:** Objects can be broken down into their constituent parts (scalars like primitives), which can then be stored in CPU registers instead of memory.

I have discussed Lock Elision in previous articles on VM lock optimization; it relies heavily on EA. This article focuses on the second point: converting heap allocation to stack allocation.

> Note: Stack allocation is actually implemented via scalar replacement. I may provide a more comprehensive guide on EA in a future post.

You can control EA via JVM parameters:
- `-XX:+DoEscapeAnalysis`: Enable EA
- `-XX:-DoEscapeAnalysis`: Disable EA
EA is enabled by default starting from JDK 1.7.

### Stack Allocation of Objects

While objects and arrays are generally allocated in the heap, JIT can use EA results to move these allocations to the stack during compilation.

Consider this code:
```java
public static void main(String[] args) {
``` 
long a1 = System.currentTimeMillis();
for (int i = 0; i < 1000000; i++) {
    alloc();
}
long a2 = System.currentTimeMillis();
System.out.println("cost " + (a2 - a1) + " ms");
try {
    Thread.sleep(100000);
} catch (InterruptedException e1) {
    e1.printStackTrace();
}
```
}

private static void alloc() {
``` 
User user = new User();
```
}

static class User {}
```
This loop creates 1 million `User` objects. Since `user` is local to `alloc()` and never escapes, JIT can optimize its allocation.

Run with EA disabled:
`-Xmx4G -Xms4G -XX:-DoEscapeAnalysis -XX:+PrintGCDetails`

Check the heap using `jmap -histo <pid>`:
```
num     #instances         #bytes  class name
----------------------------------------------
  2:       1000000       16000000  StackAllocTest$User
```
1 million instances are in the heap. This is the "standard" behavior without optimization.

Now, run with EA enabled:
`-Xmx4G -Xms4G -XX:+DoEscapeAnalysis -XX:+PrintGCDetails`

Check the heap again:
```
num     #instances         #bytes  class name
----------------------------------------------
  3:         83619        1337904  StackAllocTest$User
```
Only about 83,000 instances are in the heap. JIT optimization reduced the heap allocations from 1 million to 83,000.

> You can also verify this by using a smaller heap. With EA enabled, you will see significantly fewer GC events because stack-allocated memory is reclaimed automatically when the method returns, rather than requiring a GC cycle.

### Summary

If asked: "Are all objects and arrays allocated in the heap?"
The answer is: "Not necessarily. With JIT compilers and escape analysis, objects that don't escape their method scope can be optimized for stack allocation. However, this isn't absolute; as seen in our test, some objects may still end up in the heap."
