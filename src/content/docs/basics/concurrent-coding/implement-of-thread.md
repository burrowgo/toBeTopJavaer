---
title: "Implement Of Thread"
---

Mainstream operating systems provide thread implementations, and there are primarily three ways to implement threads: using kernel threads, using user threads, and using a hybrid implementation of user threads and lightweight processes.

## Implementation Using Kernel Threads

Kernel-Level Threads (KLT) are threads directly supported by the operating system kernel. The kernel handles thread switching, schedules threads by manipulating a scheduler, and is responsible for mapping thread tasks to various processors. Each kernel thread can be viewed as a representative of the kernel, allowing the operating system to handle multiple things simultaneously. A kernel that supports multi-threading is called a multi-threaded kernel.

Programs generally do not use kernel threads directly, but rather an advanced interface to them called Lightweight Processes (LWP). Lightweight processes are what we commonly refer to as threads. Since each lightweight process is supported by a kernel thread, kernel threads must be supported first for lightweight processes to exist. This 1:1 relationship between lightweight processes and kernel threads is known as a one-to-one thread model, as shown in the figure.

![Kernel Threads Model](http://www.hollischuang.com/wp-content/uploads/2018/12/15442554190788.jpg)

Due to kernel thread support, each lightweight process becomes an independent scheduling unit. Even if one lightweight process is blocked in a system call, it does not affect the continuation of the entire process. However, lightweight processes have limitations: first, because they are based on kernel threads, various thread operations such as creation, destruction, and synchronization require system calls. The cost of system calls is relatively high, requiring frequent switching between user mode and kernel mode. Second, each lightweight process requires a supporting kernel thread, thus consuming certain kernel resources (such as stack space for kernel threads). Consequently, the number of lightweight processes a system can support is limited.

## Implementation Using User Threads

In a broad sense, any thread that is not a kernel thread can be considered a user thread (UT). Therefore, by this definition, lightweight processes are also user threads. However, the implementation of lightweight processes is always built upon the kernel, and many operations require system calls, limiting their efficiency.

In a narrow sense, user threads refer to implementations built entirely on a user-space thread library, where the kernel is unaware of the threads' existence. The creation, synchronization, destruction, and scheduling of user threads are completed entirely in user mode without the kernel's help. If implemented correctly, such threads do not need to switch to kernel mode, making operations very fast and low-cost, and supporting a much larger number of threads. Multi-threading in some high-performance databases is implemented using user threads. This 1:N relationship between a process and user threads is known as a one-to-many thread model, as shown in the figure.

![User Threads Model](http://www.hollischuang.com/wp-content/uploads/2018/12/15442554407298.jpg)

The advantage of using user threads is that they do not require kernel support, but the disadvantage is precisely that they lack kernel support - all thread operations must be handled by the user program itself. Thread creation, switching, and scheduling are all issues that must be addressed. Furthermore, because the operating system only allocates processor resources to processes, solving problems such as "how to handle blocking" and "how to map threads to other processors in multi-processor systems" becomes extremely difficult, if not impossible. Consequently, programs implemented using user threads are generally more complex. Except for multi-threaded programs on older operating systems that did not support multi-threading (like DOS) and a few programs with special requirements, fewer programs use user threads today. Languages like Java and Ruby once used user threads but eventually abandoned them.

## Hybrid Implementation Using User Threads and Lightweight Processes

Besides relying on kernel threads or being implemented entirely by user programs, there is another implementation that uses kernel threads and user threads together. In this hybrid implementation, both user threads and lightweight processes exist. User threads are still built entirely in user space, so their creation, switching, and destruction remain inexpensive and can support large-scale concurrency. The lightweight processes supported by the operating system serve as a bridge between user threads and kernel threads. This allows for the use of thread scheduling and processor mapping provided by the kernel, and user thread system calls are completed via lightweight threads, greatly reducing the risk of the entire process being completely blocked. In this hybrid model, the ratio of user threads to lightweight processes is variable, resulting in an N:M relationship, known as a many-to-many thread model, as shown in the figure below.

Many UNIX-like operating systems, such as Solaris and HP-UX, provide N:M thread model implementations.

![Hybrid Model](http://www.hollischuang.com/wp-content/uploads/2018/12/15442554705166.jpg)

## Implementation of Java Threads

Before JDK 1.2, Java threads were implemented based on user threads called "Green Threads." In JDK 1.2, the thread model was replaced with one based on native operating system threads. Therefore, in current JDK versions, the thread model supported by the operating system largely determines how Java Virtual Machine threads are mapped. This cannot be standardized across different platforms, and the JVM specification does not limit which thread model Java threads must use. The thread model only affects the scale of concurrency and operation costs; these differences are transparent to the coding and running process of Java programs.

For Sun JDK, its Windows and Linux versions are implemented using a one-to-one thread model, where one Java thread maps to one lightweight process, as the thread models provided by Windows and Linux are one-to-one.

On the Solaris platform, since the operating system's thread features can support both one-to-one (via Bound Threads or Alternate Libthread) and many-to-many (via LWP/Thread Based Synchronization) thread models, the Solaris version of the JDK provides two platform-specific JVM parameters: `-XX:+UseLWPSynchronization` (default) and `-XX:+UseBoundThreads` to explicitly specify which thread model the virtual machine should use.

The Java language provides a unified treatment for thread operations across different hardware and operating system platforms. Each instance of the `java.lang.Thread` class that has executed `start()` and has not yet finished represents a thread. We note that the `Thread` class differs significantly from most Java APIs in that all its key methods are declared as `native`. In the Java API, a native method often means it is not or cannot be implemented using platform-independent means (it could also be for efficiency, but usually the most efficient means are platform-specific).

(Reference: "Understanding the Java Virtual Machine")
