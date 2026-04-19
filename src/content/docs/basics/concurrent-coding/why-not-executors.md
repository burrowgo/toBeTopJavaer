---
title: "Why is it not recommended to use `Executors` to create thread pools?"
---


In the article [Analysis of the Implementation Principles of Java Thread Pools from Source Code](https://mp.weixin.qq.com/s/-89-CcDnSLBYy3THmcLEdQ), we introduced common usages and basic principles of thread pools in Java.

In that article, there is a description:

> Thread pools can be constructed through the `Executors` static factory, but it is generally not recommended to use it this way.

The problem was not explored in depth in that article. The reason the author said this is that this way of creating thread pools has great hidden dangers. A little carelessness may lead to online failures, such as: "A tragic case and summary caused by misuse of Java thread pools" (https://zhuanlan.zhihu.com/p/32867181).

In this article, we will analyze why the ways provided by the JDK itself to build thread pools are not recommended? How exactly should a thread pool be created?

### Executors

`Executors` is a utility class in Java that provides factory methods to create different types of thread pools.

![][2]

As seen from the figure above, the thread pools created by `Executors` methods all implement the `ExecutorService` interface. Common methods include:

`newFixedThreadPool(int nThreads)`: Creates a thread pool with a fixed number of threads.

`newCachedThreadPool()`: Creates a cacheable thread pool. Calling `execute` will reuse previously constructed threads (if threads are available). If no threads are available, a new thread is created and added to the pool. Threads that have not been used for 60 seconds are terminated and removed from the cache.

`newSingleThreadExecutor()`: Creates a single-threaded Executor.

`newScheduledThreadPool(int corePoolSize)`: Creates a thread pool that supports scheduled and periodic task execution. In most cases, it can be used instead of the `Timer` class.

The class seems to be quite powerful, uses the factory pattern, has strong scalability, and importantly, is very convenient to use, such as:

```text
ExecutorService executor = Executors.newFixedThreadPool(nThreads);
```

You can create a fixed-size thread pool.

But why do I say it's not recommended to use this class to create thread pools?

I mentioned "not recommended," but in the "Alibaba Java Development Manual," it is clearly stated, and the word "not allowed" is used for using `Executors` to create thread pools.

<img src="http://www.hollischuang.com/wp-content/uploads/2018/10/15406254121131.jpg" alt="" style="width:1177px" />

### What are the problems with Executors?

In the "Alibaba Java Development Manual," it is mentioned that using `Executors` to create thread pools may lead to OOM (OutOfMemory, memory overflow), but it does not explain why. Next, let's look at why `Executors` is not allowed.

Let's start with a simple example to simulate OOM using `Executors`.

```java
/**
 * @author Hollis
 */
public class ExecutorsDemo {
``` java
private static ExecutorService executor = Executors.newFixedThreadPool(15);
```java
public static void main(String[] args) {
    for (int i = 0; i < Integer.MAX_VALUE; i++) {
        executor.execute(new SubThread());
    }
}
```
```
}

class SubThread implements Runnable {
``` java
```java
@Override
public void run() {
    try {
        Thread.sleep(10000);
    } catch (InterruptedException e) {
        // do nothing
    }
}
```
```
}
```

By specifying JVM parameters: `-Xmx8m -Xms8m` and running the above code, an OOM will be thrown:

```text
Exception in thread "main" java.lang.OutOfMemoryError: GC overhead limit exceeded
``` 
at java.util.concurrent.LinkedBlockingQueue.offer(LinkedBlockingQueue.java:416)
at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1371)
at com.hollis.ExecutorsDemo.main(ExecutorsDemo.java:16)
```
```

The code above points out that line 16 of `ExecutorsDemo.java` is `executor.execute(new SubThread());`.

### Why does Executors have defects?

Through the example above, we know that the thread pool created by `Executors` has the risk of OOM. So what exactly causes it? We need to analyze the source code of `Executors`.

In fact, from the error message above, we can see clues. In the code above, it has been said that the real cause of OOM is the `LinkedBlockingQueue.offer` method.

```text
Exception in thread "main" java.lang.OutOfMemoryError: GC overhead limit exceeded
``` 
at java.util.concurrent.LinkedBlockingQueue.offer(LinkedBlockingQueue.java:416)
at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1371)
at com.hollis.ExecutorsDemo.main(ExecutorsDemo.java:16)
```
```

If the reader looks at the code, they will find that the bottom layer is indeed implemented through `LinkedBlockingQueue`:

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
}
```

If the reader knows about blocking queues in Java, they might understand the reason now.

There are two main implementations of `BlockingQueue` in Java: `ArrayBlockingQueue` and `LinkedBlockingQueue`.

`ArrayBlockingQueue` is a bounded blocking queue implemented with an array, and the capacity must be set.

`LinkedBlockingQueue` is a bounded blocking queue implemented with a linked list. The capacity can be chosen. If not set, it will be an unbounded blocking queue with a maximum length of `Integer.MAX_VALUE`.

The problem here lies in: **If not set, it will be an unbounded blocking queue with a maximum length of `Integer.MAX_VALUE`.** That is, if we don't set the capacity of `LinkedBlockingQueue`, its default capacity will be `Integer.MAX_VALUE`.

In `newFixedThreadPool`, when creating `LinkedBlockingQueue`, the capacity is not specified. At this time, `LinkedBlockingQueue` is an unbounded queue. For an unbounded queue, tasks can be continuously added to the queue. In this case, there is a possibility of memory overflow due to too many tasks.

The problems mentioned above are mainly reflected in the two factory methods `newFixedThreadPool` and `newSingleThreadExecutor`. It's not that `newCachedThreadPool` and `newScheduledThreadPool` are safe. The maximum number of threads created by these two methods may be `Integer.MAX_VALUE`, and creating so many threads will inevitably lead to OOM.

### The Correct Way to Create a Thread Pool

To avoid using `Executors` to create thread pools, mainly to avoid using the default implementations therein, we can directly call the constructor of `ThreadPoolExecutor` to create the thread pool ourselves. At the same time, specify the capacity for the `BlockingQueue`.

```java
private static ExecutorService executor = new ThreadPoolExecutor(10, 10,
        60L, TimeUnit.SECONDS,
        new ArrayBlockingQueue(10));
```

In this case, once the number of submitted threads exceeds the number of currently available threads, `java.util.concurrent.RejectedExecutionException` will be thrown. This is because the queue used by the current thread pool is a bounded queue, and the queue is full and cannot continue to process new requests. But an Exception is better than an Error.

In addition to defining `ThreadPoolExecutor` yourself, there are other methods. At this time, you should think of open-source libraries such as Apache and Guava.

The author recommends using `ThreadFactoryBuilder` provided by Guava to create thread pools.

```java
public class ExecutorsDemo {

``` java
private static ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
    .setNameFormat("demo-pool-%d").build();

private static ExecutorService pool = new ThreadPoolExecutor(5, 200,
    0L, TimeUnit.MILLISECONDS,
    new LinkedBlockingQueue<Runnable>(1024), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());

```java
public static void main(String[] args) {
```

    for (int i = 0; i < Integer.MAX_VALUE; i++) {
        pool.execute(new SubThread());
    }
}
```
}
```

When creating threads through the above method, not only OOM problems can be avoided, but also the thread name can be customized, making it easier to trace the source when an error occurs.

Thinking question: The author said in the article that an Exception is better than an Error. Why?

Regarding the "Alibaba Java Development Manual" mentioned in the article, please follow the public account "Hollis" and reply with "Manual" to get the full PDF.

[1]: https://mp.weixin.qq.com/s/-89-CcDnSLBYy3THmcLEdQ
[2]: http://www.hollischuang.com/wp-content/uploads/2018/10/15406248096737.jpg
