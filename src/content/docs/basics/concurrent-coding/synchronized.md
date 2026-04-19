---
title: "The `synchronized` Keyword in Java"
---


As introduced in the article [What is the Java Memory Model?](http://www.hollischuang.com/archives/2550), Java provides a series of keywords related to concurrent processing to solve atomicity, visibility, and ordering issues in concurrent programming, such as `synchronized`, `volatile`, `final`, and the `java.util.concurrent` package.

In "Deeply Understanding the Java Virtual Machine," it is stated:

> The `synchronized` keyword can serve as a solution when atomicity, visibility, and ordering are required. It seems "omnipotent." Indeed, most concurrency control operations can be completed using `synchronized`.

Ernest Hemingway said in "Death in the Afternoon": "The dignity of movement of an iceberg is due to only one-eighth of it being above water." For programmers, `synchronized` is just a keyword that is very simple to use. The reason we can handle multi-threading issues without thinking too much is that this keyword hides many details for us.

This article focuses on `synchronized`, mainly introducing its usage, principles, and how it provides atomicity, visibility, and ordering guarantees.

### Usage of `synchronized`

`synchronized` is a concurrency control keyword provided by Java. There are two main usages: synchronized methods and synchronized code blocks. That is, `synchronized` can modify both methods and code blocks.

```java
/**
 * @author Hollis 18/08/04.
 */
public class SynchronizedDemo {
     // Synchronized method
``` java
public synchronized void doSth(){
    System.out.println("Hello World");
}

// Synchronized block
```java
public void doSth1(){
    synchronized (SynchronizedDemo.class){
        System.out.println("Hello World");
    }
}
```
```
}
```

Code blocks and methods modified by `synchronized` can only be accessed by a single thread at a time.

### Implementation Principles of `synchronized`

`synchronized` is a very important keyword in Java used to solve data synchronization access in concurrent situations. When we want to ensure that a shared resource is accessed by only one thread at a time, we can use the `synchronized` keyword to lock the class or object in the code.

In [Implementation Principles of Synchronized](http://www.hollischuang.com/archives/1883), I introduced its implementation principles. To ensure completeness of knowledge, here is a brief introduction. Please read the original article for details.

Decompiling the above code gives the following:

```java
public synchronized void doSth();
``` 
descriptor: ()V
flags: ACC_PUBLIC, ACC_SYNCHRONIZED
Code:
  stack=2, locals=1, args_size=1
     0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
     3: ldc           #3                  // String Hello World
     5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
     8: return
```

  public void doSth1();
``` java
descriptor: ()V
flags: ACC_PUBLIC
Code:
  stack=2, locals=3, args_size=1
     0: ldc           #5                  // class com/hollis/SynchronizedTest
     2: dup
     3: astore_1
     4: monitorenter
     5: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
     8: ldc           #3                  // String Hello World
    10: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
    13: aload_1
    14: monitorexit
    15: goto          23
    18: astore_2
    19: aload_1
    20: monitorexit
    21: aload_2
    22: athrow
    23: return
```
```

As seen from the decompiled code: for synchronized methods, the JVM uses the `ACC_SYNCHRONIZED` flag to implement synchronization. For synchronized code blocks, the JVM uses the two instructions `monitorenter` and `monitorexit` to implement synchronization.

The [Java(R) Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.10) introduces the implementation principles of synchronized methods and blocks as follows:

> Method-level synchronization is implicit. The constant pool of a synchronized method contains an `ACC_SYNCHRONIZED` flag. When a thread accesses a method, it checks if `ACC_SYNCHRONIZED` is set. If so, it must first obtain the monitor lock, then execute the method, and release the monitor lock after the method execution. If other threads request to execute the method at this time, they will be blocked because they cannot obtain the monitor lock. It is worth noting that if an exception occurs during method execution and is not handled within the method, the monitor lock will be automatically released before the exception is thrown out of the method.
> 
> Synchronized code blocks are implemented using `monitorenter` and `monitorexit` instructions. Executing `monitorenter` can be understood as locking, and `monitorexit` as releasing the lock. Each object maintains a counter for the number of times it is locked. The counter of an unlocked object is 0. When a thread obtains the lock (executes `monitorenter`), the counter increments to 1. When the same thread obtains the lock again, the counter increments again. When the same thread releases the lock (executes `monitorexit`), the counter decrements. When the counter reaches 0, the lock is released, and other threads can obtain it.

Whether it is `ACC_SYNCHRONIZED` or `monitorenter`/`monitorexit`, they are all based on the Monitor. In the HotSpot JVM, the Monitor is implemented based on C++ by `ObjectMonitor`.

The `ObjectMonitor` class provides several methods, such as `enter`, `exit`, `wait`, `notify`, `notifyAll`, etc. When `synchronized` locks, it calls the `enter` method of `ObjectMonitor`, and when it unlocks, it calls the `exit` method. (For more on Monitors, see [Implementation Principles of Monitor](http://www.hollischuang.com/archives/2030)).

### `synchronized` and Atomicity

Atomicity means that an operation is uninterruptible and must either be completed entirely or not at all.

As analyzed in [What exactly is the problem with multi-threading in Java concurrent programming?](http://www.hollischuang.com/archives/2618), threads are the basic units of CPU scheduling. The CPU has the concept of time slices and schedules threads according to different algorithms. When a thread obtains a time slice and starts executing, it loses CPU usage when the time slice is exhausted. Therefore, in multi-threading scenarios, atomicity issues occur due to the rotation of time slices among threads.

In Java, to ensure atomicity, two high-level bytecode instructions, `monitorenter` and `monitorexit`, are provided. As mentioned earlier, the corresponding keyword for these instructions in Java is `synchronized`.

Through the `monitorenter` and `monitorexit` instructions, it can be guaranteed that the code modified by `synchronized` can only be accessed by one thread at a time. Before the lock is released, it cannot be accessed by other threads. Therefore, in Java, `synchronized` can be used to ensure that operations within methods and code blocks are atomic.

> When thread 1 executes the `monitorenter` instruction, it locks the Monitor. After locking, other threads cannot obtain the lock unless thread 1 actively unlocks. Even if during execution thread 1 gives up the CPU for some reason (e.g., time slice exhaustion), it does not unlock. Since `synchronized` locks are reentrant, the next time slice can still only be obtained by itself, and it will continue to execute the code until all code is finished. This ensures atomicity.

### `synchronized` and Visibility

Visibility means that when multiple threads access the same variable, if one thread modifies the value of the variable, other threads can immediately see the modified value.

As analyzed in the article about the Java Memory Model, the JMM stipulates that all variables are stored in main memory. Each thread has its own working memory, which stores a copy of the main memory variables used by the thread. All operations on variables must be performed in working memory, not directly in main memory. Different threads cannot directly access each other's working memory variables. Variable passing between threads requires data synchronization between working memory and main memory. Therefore, it is possible that thread 1 changes a variable, but it is invisible to thread 2.

The code modified by `synchronized` locks at the start and unlocks after completion. To ensure visibility, there is a rule: before unlocking a variable, it must first be synchronized back to main memory. This way, after unlocking, subsequent threads can access the modified value.

Therefore, the object locked by the `synchronized` keyword has visibility.

### `synchronized` and Ordering

Ordering means that the execution of a program follows the sequential order of the code.

As analyzed in the JMM article, in addition to time slices, the CPU may perform out-of-order execution of input code due to processor optimization and instruction reordering (e.g., `load -> add -> save` might be optimized to `load -> save -> add`). This can lead to ordering issues.

It is important to note that `synchronized` cannot prohibit instruction reordering and processor optimization. That is, `synchronized` cannot avoid the problems mentioned above.

So why is it said that `synchronized` also provides ordering guarantees?

This requires expanding the concept of ordering. The natural ordering in Java programs can be summarized in one sentence: If observed within this thread, all operations are naturally ordered. If observing another thread within one thread, all operations are unordered.

The above sentence is also from "Deeply Understanding the Java Virtual Machine." But how to understand it? It is actually related to `as-if-serial` semantics.

`as-if-serial` semantics means: no matter how reordering occurs (to improve parallelism), the execution result of a single-threaded program cannot be changed. Compilers and processors must comply with `as-if-serial` semantics regardless of how they optimize.

Simply put, `as-if-serial` semantics guarantees that in a single thread, instruction reordering has certain limits. As long as compilers and processors follow this semantics, a single-threaded program can be considered to execute in order. Of course, there is still reordering, but we don't need to worry about its interference.

Since the code modified by `synchronized` can only be accessed by the same thread at a time, it is effectively single-threaded execution. Therefore, its ordering can be guaranteed.

### `synchronized` and Lock Optimization

Previously, the usage, principles, and effects of `synchronized` on concurrent programming were introduced. It is a very useful keyword.

`synchronized` is actually implemented with the help of a Monitor. It calls the `enter` method of `ObjectMonitor` when locking and `exit` when unlocking. In fact, only before JDK 1.6 did the implementation of `synchronized` directly call `enter` and `exit`. This type of lock is called a "heavyweight lock."

In JDK 1.6, many optimizations were made to locks, resulting in lightweight locks, biased locks, lock elimination, adaptive spin locks, and lock coarsening (spin locks existed in 1.4 but were disabled by default; they are enabled by default in 1.6). These operations are intended to share data more efficiently between threads and solve competition issues.

For spin locks, lock coarsening, and lock elimination, please refer to [Lock Optimization Technologies in the Java Virtual Machine](http://www.hollischuang.com/archives/2344). Lightweight locks and biased locks will be introduced in subsequent articles.

In this article, we introduced the usage and principles of the `synchronized` keyword, how it guarantees atomicity, ordering, and visibility, and provided materials and thoughts on lock optimization. Next, we will continue to introduce the `volatile` keyword and its differences from `synchronized`. Stay tuned.
