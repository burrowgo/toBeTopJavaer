---
title: "Debugging Multi-threaded Code in Java"
---


After studying the previous articles, many people should have a certain understanding of multi-threading in Java and may have tried writing some multi-threaded code.

However, during many interviews I've conducted, I've found that while many people know how to implement multi-threading, they don't know how to debug it. In this article, we will introduce how to debug multi-threaded code.

First, let's write a multi-threading example. We use the `Runnable` interface to define multiple threads and start them.

```java
/**
 * @author Hollis
 */
public class MultiThreadDebug {

``` java
```java
public static void main(String[] args) {
    MyThread myThread = new MyThread();
```

    Thread thread1 = new Thread(myThread, "thread 1");
    Thread thread2 = new Thread(myThread, "thread 2");
    Thread thread3 = new Thread(myThread, "thread 3");

    thread1.start();

    thread2.start();

    thread3.start();
}
```
}

class MyThread implements Runnable {

``` java
```java
@Override
public void run() {
    System.out.println(Thread.currentThread().getName() + " running");
}
```
```
}
```

Let's try setting breakpoints in the code and start it in debug mode.

![][1]

As shown, after the program starts, it will enter a breakpoint in one of the threads. Let's see which thread it is:

![][2]

We found that `thread 1` entered the breakpoint. Then, we try to let the code continue executing. The program finishes running directly, and the console prints the following:

```text
Connected to the target VM, address: '127.0.0.1:55768', transport: 'socket'
thread 3 running
Disconnected from the target VM, address: '127.0.0.1:55768', transport: 'socket'
thread 2 running
thread 1 running

Process finished with exit code 0
```

If we execute this code multiple times, we will find that the printed results are different every time. The output order of the three threads is random, and each debug session only enters one thread's execution.

The results are random because it is not guaranteed which thread will obtain the CPU time slice first.

So, how can we make every thread's execution debuggable? How can we perform debugging and troubleshooting in multi-threading?

Actually, in IntelliJ IDEA, there is a setting: when we right-click on the breakpoint, a settings dialog will pop up. When we change "All" to "Thread" and try to execute the debug code again:

![][3]

After re-executing, you will find that every thread will enter the breakpoint.

[1]: https://www.hollischuang.com/wp-content/uploads/2020/11/16065562943648.jpg
[2]: https://www.hollischuang.com/wp-content/uploads/2020/11/16065563249582.jpg
[3]: https://www.hollischuang.com/wp-content/uploads/2020/11/16065565440571.jpg
