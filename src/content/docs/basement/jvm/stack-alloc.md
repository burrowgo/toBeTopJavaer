---
title: "Stack Alloc"
---

### JVM Memory Allocation Strategy

The JVM memory structure and memory allocation methods are not the focus of this article and are only briefly reviewed here. Below are some common facts we know:

1. According to the Java Virtual Machine Specification, the memory managed by the JVM includes the Method Area, VM Stack, Native Method Stack, Heap, and Program Counter.

2. We generally believe that runtime data storage in the JVM includes heap and stack. The stack mentioned here actually refers to the VM Stack, or specifically, the local variable table in the virtual stack.

3. The stack stores variables of basic data types (int/short/long/byte/float/double/Boolean/char) and object references.

4. The heap mainly stores objects, i.e., objects created through the new keyword.

5. Array reference variables are stored in stack memory, and array elements are stored in heap memory.

In "Deep Understanding of the Java Virtual Machine," there is a description of Java heap memory:

However, with the development of JIT compilation and the gradual maturity of escape analysis technology, stack allocation and scalar replacement optimization techniques will lead to subtle changes. The idea that all objects are allocated on the heap is gradually becoming less "absolute."

This is just a brief mention without in-depth analysis. Many people seeing this might not truly understand the meaning of the above statement due to their lack of knowledge about JIT, escape analysis, and other technologies.

**PS: It is assumed here that everyone knows what JIT is. Friends who don't know can Google it first, or join my Knowledge Planet to read that exclusive article for members.**

In fact, during compilation, JIT performs many optimizations. One part of the optimization is to reduce the pressure of memory heap allocation, and an important technique is called **escape analysis**.

### Escape Analysis

Escape Analysis is a cutting-edge optimization technology in the Java Virtual Machine. It is a cross-function global data flow analysis algorithm that can effectively reduce synchronization overhead and memory heap allocation pressure in Java programs. Through escape analysis, the Java Hotspot compiler can analyze the scope of use of a new object reference to decide whether to allocate this object on the heap.

The basic behavior of escape analysis is to analyze the dynamic scope of an object: when an object is defined in a method, it may be referenced by external methods, for example, passed to other places as a call parameter, which is called method escape.

For example:

 public static StringBuffer craeteStringBuffer(String s1, String s2) {
 StringBuffer sb = new StringBuffer();
 sb.append(s1);
 sb.append(s2);
 return sb;
 }
 

StringBuffer sb is a variable internal to the method. In the above code, sb is returned directly, so this StringBuffer might be changed by other methods. Thus, its scope is not just inside the method. Although it is a local variable, it is said to have escaped outside the method. It might even be accessed by external threads, for example, assigned to a class variable or instance variable that can be accessed in other threads, which is called thread escape.

If you want StringBuffer sb not to escape the method in the above code, you can write it like this:

 public static String createStringBuffer(String s1, String s2) {
 StringBuffer sb = new StringBuffer();
 sb.append(s1);
 sb.append(s2);
 return sb.toString();
 }
 

By not returning the StringBuffer directly, the StringBuffer will not escape the method.

Using escape analysis, the compiler can perform the following optimizations on the code:

1. Synchronization Elision. If an object is found to be accessible from only one thread, synchronization for operations on this object can be omitted.

2. Convert heap allocation to stack allocation. If an object is allocated in a subroutine and the pointer to that object will never escape, the object may be a candidate for stack allocation instead of heap allocation.

3. Object decomposition or scalar replacement. Some objects may not need to exist as a continuous memory structure to be accessed. Then, parts (or all) of the object may not be stored in memory but in CPU registers.

The content about synchronization elision was introduced in my article "[Deep Understanding of Multi-threading (5) - Lock Optimization Techniques of Java Virtual Machine][1]", which is the lock elimination technique in lock optimization, also relying on escape analysis.

This article mainly introduces the second use of escape analysis: converting heap allocation to stack allocation.

> In fact, among the three optimizations above, stack memory allocation actually relies on scalar replacement. Since it's not the focus of this article, it won't be elaborated here. If you're interested, I'll write a dedicated article later to comprehensively introduce escape analysis.

During Java code execution, JVM parameters can be used to specify whether to enable escape analysis: `-XX:+DoEscapeAnalysis` enables it, and `-XX:-DoEscapeAnalysis` disables it. It has been enabled by default since JDK 1.7.

### Stack Memory Allocation of Objects

We know that, in general, memory allocation for objects and array elements is performed on the heap. However, as the JIT compiler matures, many optimizations make this allocation strategy not absolute. The JIT compiler can decide whether to convert the memory allocation of an object from heap to stack based on the results of escape analysis during compilation.

Let's look at the following code:

```java
public static void main(String[] args) {
long a1 = System.currentTimeMillis();
for (int i = 0; i < 1000000; i++) {
alloc();
}
// Check execution time
long a2 = System.currentTimeMillis();
System.out.println("cost " + (a2 - a1) + " ms");
// Thread sleep to easily check the number of objects in heap memory
try {
Thread.sleep(100000);
} catch (InterruptedException e1) {
e1.printStackTrace();
}
}
```
 
 private static void alloc() {
 User user = new User();
 }
 
 static class User {
 
 }
 

The code is simple: it uses a for loop to create 1 million User objects.

**We defined the User object in the alloc method but did not reference it outside the method. That is, this object will not escape outside of alloc. After JIT's escape analysis, its memory allocation can be optimized.**

We specify the following JVM parameters and run:

 -Xmx4G -Xms4G -XX:-DoEscapeAnalysis -XX:+PrintGCDetails -XX:+HeapDumpOnOutOfMemoryError 
 

After the program prints `cost XX ms` and before the code finishes running, we use the `[jmap][1]` command to see how many User objects are currently in the heap:

 > ~ jps
 2809 StackAllocTest
 2810 Jps
 > ~ jmap -histo 2809
 
 num #instances #bytes class name
 ----------------------------------------------
 1: 524 87282184 [I
 2: 1000000 16000000 StackAllocTest$User
 3: 6806 2093136 [B
 4: 8006 1320872 [C
 5: 4188 100512 java.lang.String
 6: 581 66304 java.lang.Class
 

From the above jmap results, we can see that 1 million `StackAllocTest$User` instances were created in the heap.

With escape analysis disabled (-XX:-DoEscapeAnalysis), even though the User object created in the alloc method did not escape to the outside, it was still allocated in the heap. That is, without JIT compiler optimization and escape analysis technology, this is what normally happens. All objects are allocated in the heap.

Next, let's enable escape analysis and execute the above code again.

 -Xmx4G -Xms4G -XX:+DoEscapeAnalysis -XX:+PrintGCDetails -XX:+HeapDumpOnOutOfMemoryError 
 

After the program prints `cost XX ms` and before the code finishes running, we use the `jmap` command to see how many User objects are in the heap:

 > ~ jps
 709
 2858 Launcher
 2859 StackAllocTest
 2860 Jps
 > ~ jmap -histo 2859
 
 num #instances #bytes class name
 ----------------------------------------------
 1: 524 101944280 [I
 2: 6806 2093136 [B
 3: 83619 1337904 StackAllocTest$User
 4: 8006 1320872 [C
 5: 4188 100512 java.lang.String
 6: 581 66304 java.lang.Class
 

From the results above, it can be seen that with escape analysis enabled (-XX:+DoEscapeAnalysis), there are only about 80,000 `StackAllocTest$User` objects in the heap. That is, after JIT optimization, the number of objects allocated in the heap dropped from 1 million to 80,000.

> In addition to the method of verifying the number of objects through jmap, readers can also try reducing the heap memory and then executing the above code. Analyzing the number of GCs will also show that after enabling escape analysis, the number of GCs during operation decreases significantly. Because many heap allocations are optimized into stack allocations, the number of GCs is significantly reduced.

### Summary

So, if someone asks you in the future: Do all objects and arrays allocate space in the heap?

You can tell them: Not necessarily. With the development of the JIT compiler, if JIT finds through escape analysis during compilation that some objects do not escape the method, then heap allocation might be optimized into stack allocation. However, this is not absolute. As we saw earlier, even after enabling escape analysis, not all User objects were not allocated on the heap.

 [1]: http://www.hollischuang.com/archives/2344