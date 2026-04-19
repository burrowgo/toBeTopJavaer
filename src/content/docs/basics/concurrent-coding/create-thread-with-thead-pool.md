---
title: "Create Thread With Thead Pool"
---

Java provides support for thread pools in many ways, and the interface provided by the JDK is very simple. You can construct one by directly calling `ThreadPoolExecutor`:

``` java
public class MultiThreads {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        System.out.println(Thread.currentThread().getName());
        System.out.println("Creating a thread via a thread pool");
        ExecutorService executorService = new ThreadPoolExecutor(1, 1, 60L, TimeUnit.SECONDS,
            new ArrayBlockingQueue<Runnable>(10));
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName());
            }
        });
    }
}
```
    

Output:

``` 
main
Creating a thread via a thread pool
pool-1-thread-1
```
    

A thread pool is essentially a `HashSet`. Excess tasks are placed in a blocking queue.

There are many ways to create a thread pool, including using the `Executors` static factory, though this is generally not recommended. It is suggested to use a thread pool to create threads, and specifically to use the `ThreadPoolExecutor` constructor with a `ThreadFactory` parameter (which requires dependency on Guava) to set thread names. We will introduce the specific reasons in detail in later chapters.
