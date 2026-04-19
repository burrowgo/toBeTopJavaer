---
title: "Create Thread With Extends"
---

```java
/**
 * @author Hollis
 */
public class MultiThreads {

``` java
```java
public static void main(String[] args) throws InterruptedException {
    System.out.println(Thread.currentThread().getName());
```

    System.out.println("Creating a thread by extending the Thread class");
    SubClassThread subClassThread = new SubClassThread();
    subClassThread.start();  
}
```
}

class SubClassThread extends Thread {

``` java
```java
@Override
public void run() {
    System.out.println(getName());
}
```
```
}
```

Output:

```text
main
Creating a thread by extending the Thread class
Thread-0
```

`SubClassThread` is a subclass that extends the `Thread` class. By extending the `Thread` class and overriding its `run` method, then creating a `SubClassThread` object and calling its `start` method, you can start a thread. The code in `run` will then be executed.

Each thread performs its operations through the `run()` method corresponding to a specific `Thread` object. The `run()` method is called the thread body. A thread is started by calling the `start()` method of the `Thread` class.

In the main thread, after the `start()` method of the child thread is called, the main thread can execute subsequent code without waiting for the child thread. The child thread will then start executing its `run()` method.

Of course, the `run()` method is also a public method and can be called directly in the `main` function. However, if `run()` is called directly, the main thread will wait for it to finish. In this case, `run()` is just an ordinary method.

If the reader is interested, checking the source code of `Thread` will reveal that it implements an interface, `java.lang.Runnable`. In fact, developers can also create a new thread directly through this interface.
