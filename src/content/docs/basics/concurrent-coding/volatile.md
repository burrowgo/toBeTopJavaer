---
title: "Volatile"
---

As introduced in "[Send this article to whoever asks you what the Java Memory Model is][1]", Java provides a series of concurrency-related keywords to solve atomicity, visibility, and ordering issues in concurrent programming, such as `synchronized`, `volatile`, `final`, and the `concurrent` package. In the [previous][2] article, we also introduced the usage and principles of `synchronized`. This article will analyze another keyword - `volatile`.

This article focuses on `volatile`, primarily introducing its usage, principles, and how it provides guarantees for visibility and ordering.

The `volatile` keyword exists not only in Java but also in many other languages, though its usage and semantics vary. It is found in C, C++, and Java, used to declare variables or objects. Below is a brief introduction to the `volatile` keyword in Java.

### Usage of volatile

`volatile` is often described as a "lightweight `synchronized`" and is an important keyword in Java concurrent programming. Unlike `synchronized`, `volatile` is a variable modifier and can only be used to modify variables. it cannot be used for methods or code blocks.

The usage of `volatile` is simple: just use it to modify a variable that may be accessed by multiple threads simultaneously.

```java
public class Singleton { 
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
} 
```


The code above is a typical implementation of a singleton using double-checked locking, where the `volatile` keyword is used to modify the `singleton` variable that might be accessed by multiple threads simultaneously.

### Principles of volatile

As mentioned in "[Send this article to whoever asks you what the Java Memory Model is][1]", to improve processor execution speed, multi-level caches are added between the processor and memory. However, this introduces the problem of cache data inconsistency.

For a `volatile` variable, when a write operation is performed, the JVM sends a `lock` prefix instruction to the processor, which writes the variable in the cache back to the system's main memory.

However, even if written back to memory, if other processors still have the old value in their caches, execution problems will arise. Therefore, in multi-processor systems, to ensure cache consistency, a "Cache Coherence Protocol" is implemented.

**Cache Coherence Protocol**: Each processor checks whether its cached value has expired by sniffing data transmitted on the bus. When a processor discovers that the memory address corresponding to its cache line has been modified, it sets the current cache line to an invalid state. When the processor needs to modify this data, it is forced to re-read the data from the system memory into its cache.

Thus, if a variable is modified by `volatile`, its value is forced into main memory after every change. Other processors, following the cache coherence protocol, will also load the value of this variable from main memory into their own caches. This ensures that the value of a `volatile` variable is visible across multiple caches in concurrent programming.

### volatile and Visibility

Visibility means that when multiple threads access the same variable and one thread modifies its value, the other threads can see the modified value immediately.

We analyzed in "[Send this article to whoever asks you what the Java Memory Model is][1]" that the Java Memory Model (JMM) stipulates that all variables are stored in main memory, and each thread has its own working memory. A thread's working memory stores a copy of the variables it uses from main memory. All operations on variables must be performed in working memory, not directly in main memory. Threads cannot directly access variables in each other's working memory; variable passing between threads requires data synchronization between their working memory and main memory. Thus, it's possible for thread 1 to change a variable's value while thread 2 remains unaware.

As explained in the principles of `volatile`, the `volatile` keyword in Java ensures that modified variables are synchronized to main memory immediately and refreshed from main memory before each use. Therefore, `volatile` can be used to guarantee variable visibility in multi-threaded operations.

### volatile and Ordering

Ordering means that the program executes in the sequence in which the code is written.

We analyzed in "[Send this article to whoever asks you what the Java Memory Model is][1]" that besides the introduction of time slices, the CPU may execute instructions out of order due to processor optimization and instruction reordering. For example, `load -> add -> save` might be optimized to `load -> save -> add`. This can lead to ordering issues.

In addition to guaranteeing data visibility, `volatile` has another powerful function: it can prohibit instruction reordering optimization.

Ordinary variables only guarantee that correct results are obtained where the assignment results are depended upon during the method's execution; they do not guarantee that the order of assignment operations matches the execution order in the code.

`volatile` can prohibit instruction reordering, ensuring that code executes strictly in the written sequence. This guarantees ordering. Operations on variables modified by `volatile` will strictly follow the code order, so the execution sequence of `load -> add -> save` will be `load`, `add`, then `save`.

### volatile and Atomicity

Atomicity means an operation is uninterruptible and must be fully executed or not executed at all.

We analyzed in "[What is really going on with multi-threading issues in Java concurrent programming?][3]" that threads are the basic units of CPU scheduling. The CPU uses time slices and schedules threads according to different algorithms. When a thread gets a time slice, it starts executing; when the time slice is exhausted, it loses CPU usage rights. In multi-threaded scenarios, atomicity issues arise because time slices rotate between threads.

In the previous article about `synchronized`, we mentioned that ensuring atomicity requires the bytecode instructions `monitorenter` and `monitorexit`, but `volatile` has no relationship with these instructions.

**Therefore, `volatile` cannot guarantee atomicity.**

In the following two scenarios, `volatile` can be used instead of `synchronized`:

> 1. The operation result does not depend on the variable's current value, or it can be ensured that only a single thread will modify the variable's value.
> 
> 2. The variable does not need to participate in invariant constraints with other state variables.

```java
Except for the above scenarios, other methods such as `synchronized` or the `concurrent` package must be used to guarantee atomicity.
```

Let's look at an example of `volatile` and atomicity:

```java
public class Test {
public volatile int inc = 0;
 
public void increase() {
inc++;
}
 
public static void main(String[] args) {
final Test test = new Test();
for(int i=0;i<10;i++){
new Thread(){
public void run() {
for(int j=0;j<1000;j++)
test.increase();
};
}.start();
}
```
 
 while(Thread.activeCount()>1) // Ensure all preceding threads have finished
 Thread.yield();
 System.out.println(test.inc);
 }
 }


The code above simply creates 10 threads and executes the `i++` operation 1000 times each. Under normal circumstances, the output should be 10000. However, the result is often less than 10000. This is because `volatile` cannot satisfy atomicity.

This happens because while `volatile` can guarantee the visibility of `inc` across multiple threads, it cannot guarantee the atomicity of `inc++`.

### Summary and Reflection

We have introduced the `volatile` keyword and the `synchronized` keyword. Now we know that `synchronized` guarantees atomicity, ordering, and visibility, while `volatile` only guarantees ordering and visibility.

Now, let's look at the singleton implementation using double-checked locking again. Since `synchronized` is already used, why is `volatile` still needed?

```java
public class Singleton { 
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
} 
```


We will introduce the answer in the next article: "Since we have synchronized, why do we need volatile?". Please follow my blog (http://47.103.216.138) and official account (Hollis).

[1]: http://47.103.216.138/archives/2550
[2]: http://47.103.216.138/archives/2637
[3]: http://47.103.216.138/archives/2618
