---
title: "Java Thread Scheduling"
---

In articles about thread safety, we mentioned that for a single-CPU computer, only one machine instruction can be executed at any given time. Each thread must obtain the right to use the CPU to execute instructions.

The so-called concurrent execution of multiple threads refers to the fact that, from a macro perspective, each thread takes turns obtaining the right to use the CPU and executing its respective tasks.

From the previous introduction to thread states, we know that the running state of a thread includes two sub-states: READY and RUNNING.

For a thread to transition from the READY state to the RUNNING state, system scheduling is required. This involves allocating CPU usage rights to the thread, and only threads that have obtained CPU usage rights will transition from the READY state to the RUNNING state.

**The process of allocating CPU usage rights to multiple threads according to a specific mechanism is called thread scheduling.**

Do you remember what we mentioned when introducing the difference between processes and threads: a process is the basic unit for allocating resources, and a thread is the basic unit for CPU scheduling. The scheduling mentioned here refers to allocating CPU time slices to it to let it execute tasks.

## Linux Thread Scheduling

In Linux, threads are implemented by processes as lightweight processes. Therefore, in Linux, thread scheduling follows the same method as process scheduling, meaning threads are the scheduling units.

One of the benefits of implementing threads this way in Linux is that thread scheduling can simply use process scheduling, eliminating the need for an intra-process thread scheduler. In Linux, the scheduler decides which thread to run based on the thread's scheduling policy and static scheduling priority.

There are three main scheduling policies in Linux:

* SCHED_OTHER: Time-sharing scheduling policy (default).
* SCHED_FIFO: Real-time scheduling policy, first-come-first-served.
* SCHED_RR: Real-time scheduling policy, round-robin time slicing.

## Windows Thread Scheduling

Windows uses a priority-based, preemptive scheduling algorithm to schedule threads.

The part of the Windows kernel that handles scheduling is called the scheduler. The Windows scheduler ensures that the thread with the highest priority is always running. A thread selected to run by the scheduler will continue to run until it is preempted by a higher-priority thread, terminates, its time slice expires, or it calls a blocking system call (such as I/O). If a higher-priority real-time thread becomes ready while a low-priority thread is running, the low-priority thread is preempted. This preemption allows real-time threads to have priority when they need to use the CPU.


As you can see, different operating systems have different thread scheduling strategies. However, as a Java developer, we generally pay little attention to operating system-level details in our daily development.

This is mainly because Java programs run on the Java Virtual Machine (JVM), which masks the differences between operating systems, hence why we say Java is a cross-platform language.

**In an operating system, a Java program is actually a process. Therefore, we say Java is single-process and multi-threaded!**

As mentioned in the introduction to thread implementation, the `Thread` class differs significantly from most Java APIs in that all its key methods are declared as `native`. This means it needs different implementations for different operating systems.

In Java multi-threaded programs, to ensure that the execution of all threads follows certain rules, the JVM implements a thread scheduler. It defines a thread scheduling model and stipulates the allocation of CPU computing, allocating CPU usage rights to multiple threads according to these specific mechanisms.

There are two main scheduling models: **Cooperative Thread Scheduling** and **Preemptive Scheduling**.

## Cooperative Thread Scheduling

In a multi-threaded system with cooperative scheduling, the execution time of a thread is controlled by the thread itself. After a thread finishes its work, it must actively notify the system to switch to another thread. The biggest advantage of cooperative multi-threading is its simple implementation. Since a thread switches only after finishing its tasks, the switching operation is known to the thread itself, so there are no thread synchronization issues.

## Preemptive Scheduling

In a multi-threaded system with preemptive scheduling, each thread is allocated execution time by the system, and thread switching is not decided by the thread itself. Under this method of thread scheduling, the execution time of a thread is controllable by the system, and one thread will not cause the entire process to block.

The system allows high-priority threads in the runnable pool to occupy the CPU. If threads in the runnable pool have the same priority, one thread is chosen randomly to occupy the CPU. A thread in the running state will continue to run until it has to give up the CPU.

**The Java Virtual Machine uses the preemptive scheduling model.**

Although Java thread scheduling is completed automatically by the system, we can still "suggest" that the system allocate a bit more execution time to some threads and less to others - this can be done by setting thread priorities. Java defines 10 levels of thread priority (`Thread.MIN_PRIORITY` to `Thread.MAX_PRIORITY`). When two threads are in the READY state at the same time, the thread with the higher priority is more likely to be selected by the system for execution.

However, thread priority is not very reliable because Java threads are implemented by mapping to the system's native threads. Therefore, thread scheduling ultimately depends on the operating system. Although many operating systems now provide the concept of thread priority, it may not correspond one-to-one with Java thread priorities.
