---
title: "Priority Of Thread"
---

We have learned that the Java Virtual Machine uses a preemptive scheduling model. This means it prioritizes allocating CPU to threads with higher priority.

Although Java thread scheduling is completed automatically by the system, we can still "suggest" that the system allocate a bit more execution time to some threads and less to others - this can be done by setting thread priorities.

Java defines 10 levels of thread priority (`Thread.MIN_PRIORITY` to `Thread.MAX_PRIORITY`). When two threads are in the READY state at the same time, the thread with the higher priority is more likely to be selected by the system for execution.

Java thread priorities are represented by integers from 1 to 10. The default priority is 5.

 Minimum priority 1: Thread.MIN_PRIORITY
 
 Maximum priority 10: Thread.MAX_PRIORITY
 
 Normal priority 5: Thread.NORM_PRIORITY
 

In Java, you can use the `setPriority()` method of the `Thread` class to set a new priority for a thread. The `getPriority()` method returns the current priority of the thread. When a thread is created, its default priority is the priority of the thread that created it.

The following code demonstrates how to set and get thread priorities:

 /**
 * @author Hollis
 */
```java
public class Main {
 
public static void main(String[] args) {
Thread t = Thread.currentThread();
System.out.println("Main Thread Priority:" + t.getPriority());
```
 
 Thread t1 = new Thread();
 System.out.println("Thread(t1) Priority:" + t1.getPriority());
 t1.setPriority(Thread.MAX_PRIORITY - 1);
 System.out.println("Thread(t1) Priority:" + t1.getPriority());
 
 t.setPriority(Thread.NORM_PRIORITY);
 System.out.println("Main Thread Priority:" + t.getPriority());
 
 Thread t2 = new Thread();
 System.out.println("Thread(t2) Priority:" + t2.getPriority());
 
 // Change thread t2 priority to minimum
 t2.setPriority(Thread.MIN_PRIORITY);
 System.out.println("Thread(t2) Priority:" + t2.getPriority());
 }
 
 }
 

The output is:

 Main Thread Priority:5
 Thread(t1) Priority:5
 Thread(t1) Priority:9
 Main Thread Priority:5
 Thread(t2) Priority:5
 Thread(t2) Priority:1
 

In the code above, when the Java Virtual Machine starts, it launches a thread through the `main` method. The JVM will continue to run until one of the following conditions occurs:

* The `exit()` method is called and has the authority to be executed normally.
* All "non-daemon threads" have died (meaning only "daemon threads" remain in the JVM).
