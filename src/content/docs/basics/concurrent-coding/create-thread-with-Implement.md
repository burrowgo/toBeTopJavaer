---
title: "Create Thread With Implement"
---

```java
public class MultiThreads {
``` java
```java
public static void main(String[] args) throws InterruptedException {
    System.out.println(Thread.currentThread().getName());
```

    System.out.println("Creating a thread by implementing the Runnable interface");
    RunnableThread runnableThread = new RunnableThread();
    new Thread(runnableThread).start();
  }
```
}

class RunnableThread implements Runnable {

``` java
```java
@Override
public void run() {
    System.out.println(Thread.currentThread().getName());
}
```
```
}
```

Output:

```text
main
Creating a thread by implementing the Runnable interface
Thread-1
```

By implementing the interface and overriding `run()`, you can create a new thread.

We all know that Java does not support multiple inheritance. Therefore, using the `Runnable` interface can avoid the limitation of multiple inheritance. For example, if a class `A` already extends class `B`, it cannot extend the `Thread` class. In this case, if you want to implement multi-threading, you need to use the `Runnable` interface.

Other than that, there is almost no difference between the two.

However, these two ways of creating threads have a disadvantage: you cannot get the execution result after the task is finished.

If we want to get the execution result of the child thread in the main thread, we need to use `Callable` and `FutureTask`.
