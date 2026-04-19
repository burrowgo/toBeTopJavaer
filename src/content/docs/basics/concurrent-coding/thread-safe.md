---
title: "What is Thread Safety?"
---


The definition of thread safety according to Wikipedia is:

> Thread safety is a concept in computer programming that applies in the context of multi-threaded programs. A piece of code is thread-safe if it functions correctly during simultaneous execution by multiple threads. In particular, it must satisfy the need for multiple threads to access shared data.

Let's break down this definition. We need to clarify several points: 1. Concurrency 2. Multi-threading 3. Shared variables

# Concurrency

When mentioning thread safety, a term that must be mentioned is concurrency. Without concurrency, there would be no thread safety issues.

## What is Concurrency?

Concurrency, in operating systems, refers to a period of time in which several programs are in a state from start to finish, and these programs are all running on the same processor.

So, how does the operating system achieve this concurrency?

The operating systems we use today, whether Windows, Linux, or MacOS, are actually **multi-user, multi-tasking time-sharing operating systems**. Users using these operating systems can do many things "at the same time."

However, in reality, for a single-CPU computer, only one thing can be done at a time in the CPU. To make it look like "doing many things at the same time," the time-sharing operating system divides the CPU time into time intervals of basically the same length, namely "time slices." Through the management of the operating system, these time slices are allocated to each user in turn.

If a job has not completed the entire task before the time slice ends, the job is suspended, gives up the CPU, and waits for the next round of cycles to continue. At this time, the CPU is allocated to another job.

Since the processing speed of the computer is very fast, as long as the interval of the time slice is appropriate, a user job from using up one time slice allocated to it to obtaining the next CPU time slice will have some "pause" in between, but the user cannot perceive it, as if the entire system were "monopolized" by it.

Therefore, in a single-CPU computer, what looks like "doing many things at the same time" is actually completed concurrently through CPU time slice technology.

When mentioning concurrency, there is another term that is easily confused with it: parallelism.

## The Relationship Between Concurrency and Parallelism

Parallelism (Parallel) occurs when the system has more than one CPU. When one CPU executes one process, another CPU can execute another process. The two processes do not preempt CPU resources and can proceed simultaneously. This method is called parallelism.

Joe Armstrong, the father of Erlang, used a graphic to explain the difference between concurrency and parallelism:

<img src="http://www.hollischuang.com/wp-content/uploads/2018/12/166719746fa11df4.jpg" alt="" width="600" height="451" class="aligncenter size-full wp-image-5857" />

Concurrency is two queues alternately using one coffee machine. Parallelism is two queues using two coffee machines at the same time.

Mapping to a computer system, the coffee machine in the figure above is the CPU, and the two queues refer to two processes.

# Multi-threading

## Processes and Threads

After understanding the relationship and difference between concurrency and parallelism, let's return to the multi-tasking time-sharing operating system introduced earlier and see how the CPU performs process scheduling.

To make it look like "doing many things at the same time," the time-sharing operating system divides the CPU time into basically equal "time slices" and allocates these time slices in turn to each task of each user through the management of the operating system.

In a multi-tasking system, the CPU needs to handle the operations of all programs. When the user switches between them, it needs to record where these programs have executed. In the operating system, the CPU switching to another process needs to save the state of the current process and restore the state of another process: the currently running task transitions to a ready (or suspended, deleted) state, and another selected ready task becomes the current task. **Context switching** is such a process that allows the CPU to record and restore the states of various running programs so that it can complete the switching operation.

> During the context switching process, the CPU stops processing the currently running program and saves the specific location of the current program execution so that it can continue running later. From this perspective, context switching is a bit like reading several books at the same time. While switching back and forth between books, we need to remember the current page number of each book. In a program, the "page number" information during the context switching process is saved in the Process Control Block (PCB). The PCB is also often called a "switch frame." The "page number" information will be saved in the CPU's memory until it is used again.

For the operating system, a task is a process (Process). For example, opening a browser starts a browser process, opening a notepad starts a notepad process, opening two notepads starts two notepad processes, and opening a Word document starts a Word process.

When switching between multiple processes, context switching is required. However, context switching inevitably consumes some resources. Therefore, people considered whether they could add some "sub-tasks" within a process to reduce the cost of context switching. For example, when we use Word, it can simultaneously perform typing, spell checking, word counting, etc. These sub-tasks share the same process resources, but switching between them does not require context switching.

Within a process, to do many things at the same time, it is necessary to run multiple "sub-tasks" simultaneously. We call these "sub-tasks" within the process threads (Thread).

With the development of time, people further divided the responsibilities between processes and threads. **The process is considered the basic unit of resource allocation, and the thread is considered the basic unit of execution. Multiple threads of the same process share resources.**

Taking the Java language we are familiar with, Java programs run on the JVM, and each JVM is actually a process. All resource allocations are based on the JVM process. In this JVM process, many threads can be created, multiple threads share JVM resources, and multiple threads can execute concurrently.

# Shared Variables

The so-called shared variables refer to variables that can be operated on by multiple threads.

As mentioned earlier, a process is the basic unit of resource allocation, and a thread is the basic unit of execution. Therefore, multiple threads can share part of the data in the process. In the JVM, the Java heap and the method area are data areas shared by multiple threads. That is to say, multiple threads can operate on the same data stored in the heap or the method area. In other words, variables stored in the heap and the method area are shared variables in Java.

So, which variables in Java are stored in the heap, which variables are stored in the method area, and which variables are stored in the stack?

## Class Variables, Member Variables, and Local Variables

There are three types of variables in Java: class variables, member variables, and local variables. They are stored in the JVM's method area, heap memory, and stack memory, respectively.

```java
/**
 * @author Hollis
 */
public class Variables {

``` java
/**
 * Class variable
 */
private static int a;

/**
 * Member variable
 */
```java
private int b;
```

/**
 * Local variable
 * @param c
 */
```java
public void test(int c){
    int d;
}
```
```
}
```

Among the three variables defined above, variable `a` is a class variable, variable `b` is a member variable, and variables `c` and `d` are local variables.

Therefore, variables `a` and `b` are shared variables, and variables `c` and `d` are non-shared variables. Therefore, if a multi-threaded scenario is encountered, the operations for variables `a` and `b` need to consider thread safety, while the operations for variables `c` and `d` do not need to consider thread safety.

# Summary

After learning some basic knowledge, let's look back at the definition of thread safety:

> Thread safety is a concept in computer programming that applies in the context of multi-threaded programs. A piece of code is thread-safe if it functions correctly during simultaneous execution by multiple threads. In particular, it must satisfy the need for multiple threads to access shared data.

Now we know what a concurrent environment is, what multiple threads are, and what shared variables are. As long as we pay attention when writing multi-threaded code and ensure that the program functions can be executed correctly, it will be fine.

So the question arises: the definition says that thread safety can **correctly handle** shared variables between multiple threads, making the program function **complete correctly**.

What problems exist in multi-threaded scenarios that will lead to the failure to correctly handle shared variables? What problems exist in multi-threaded scenarios that will lead to the failure of the program to complete correctly? How to solve these problems that affect "correctness" in multi-threaded scenarios? What are the implementation principles of the various methods to solve these problems?

[1]: http://www.hollischuang.com/archives/3029
[2]: http://www.hollischuang.com/archives/tag/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B
