---
title: "Deamon Thread"
---

In Java, there are two types of threads: User Threads and Daemon Threads. User threads are generally used to execute user-level tasks, while daemon threads are "background threads," generally used to execute background tasks. The most typical application of daemon threads is the GC (Garbage Collector).

There is almost no difference between these two types of threads, except that the Java Virtual Machine will exit when all "User Threads" have finished.

We can make a thread a daemon thread by using the `setDaemon()` method and passing `true` as a parameter. We must call the `setDaemon()` method before starting the thread; otherwise, a `java.lang.IllegalThreadStateException` will be thrown.

You can use the `isDaemon()` method to check if a thread is a daemon thread.

```java
/**
 * @author Hollis
 */
public class Main {
``` java
```java
public static void main(String[] args) {
```

    Thread t1 = new Thread();
    System.out.println(t1.isDaemon());
    t1.setDaemon(true);
    System.out.println(t1.isDaemon());
    t1.start();
    t1.setDaemon(false);
}
```
}
```

Output of the above code:

```text
false
true
Exception in thread "main" java.lang.IllegalThreadStateException
``` 
at java.lang.Thread.setDaemon(Thread.java:1359)
at com.hollis.Main.main(Main.java:16)
```
```

As mentioned, when only daemon threads remain in the JVM, the JVM will exit. Let's write some code to test this:

```java
/**
 * @author Hollis
 */
public class Main {
``` java
```java
public static void main(String[] args) {
```

    Thread childThread = new Thread(new Runnable() {
```java
        @Override
        public void run() {
            while (true) {
                System.out.println("I'm child thread..");
                try {
                    TimeUnit.MILLISECONDS.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    });
    childThread.start();
    System.out.println("I'm main thread...");
}
```
```
}
```

In the above code, we start a child thread in the `main` thread. Since it is not explicitly set as a daemon thread, it is a user thread. The child thread is in a `while(true)` loop, printing `I'm child thread..` every second.

The output is:

```text
I'm main thread...
I'm child thread..
I'm child thread..
.....
I'm child thread..
I'm child thread..
```

Now let's set the child thread as a daemon thread and run the code again.

```java
/**
 * @author Hollis
 */
public class Main {
``` java
```java
public static void main(String[] args) {
```

    Thread childThread = new Thread(new Runnable() {
```java
        @Override
        public void run() {
            while (true) {
                System.out.println("I'm child thread..");
                try {
                    TimeUnit.MILLISECONDS.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    });
    childThread.setDaemon(true);
    childThread.start();
    System.out.println("I'm main thread...");
}
```
```
}
```

By adding `childThread.setDaemon(true);`, we set the child thread as a daemon thread. Running it gives the following result:

```text
I'm main thread...
I'm child thread..
```

The child thread only prints once. That is, after the `main` thread finishes, since the child thread is a daemon thread, the JVM exits directly.

**It is worth noting that new threads created in a daemon thread are also daemon threads.**

When mentioning threads, there is an important thing we need to introduce: `ThreadLocal`.
