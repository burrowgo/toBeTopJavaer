---
title: "Progress Vs Thread"
---

To make it look like "doing many things at the same time," a time-sharing operating system divides the CPU time into basically equal "time slices" and allocates these time slices in turn to each task of each user through the management of the operating system.

In a multi-tasking system, the CPU needs to handle the operations of all programs. When the user switches between them, it needs to record where these programs have executed. In the operating system, the CPU switching to another process needs to save the state of the current process and restore the state of another process: the currently running task transitions to a ready (or suspended, deleted) state, and another selected ready task becomes the current task. **Context switching** is such a process that allows the CPU to record and restore the states of various running programs so that it can complete the switching operation.

> During the context switching process, the CPU stops processing the currently running program and saves the specific location of the current program execution so that it can continue running later. From this perspective, context switching is a bit like reading several books at the same time. While switching back and forth between books, we need to remember the current page number of each book. In a program, the "page number" information during the context switching process is saved in the Process Control Block (PCB). The PCB is also often called a "switch frame." The "page number" information will be saved in the CPU's memory until it is used again.

For the operating system, a task is a process (Process). For example, opening a browser starts a browser process, opening a notepad starts a notepad process, opening two notepads starts two notepad processes, and opening a Word document starts a Word process.

When switching between multiple processes, context switching is required. However, context switching inevitably consumes some resources. Therefore, people considered whether they could add some "sub-tasks" within a process to reduce the cost of context switching. For example, when we use Word, it can simultaneously perform typing, spell checking, word counting, etc. These sub-tasks share the same process resources, but switching between them does not require context switching.

Within a process, to do many things at the same time, it is necessary to run multiple "sub-tasks" simultaneously. We call these "sub-tasks" within the process threads (Thread).

With the development of time, people further divided the responsibilities between processes and threads. **The process is considered the basic unit of resource allocation, and the thread is the basic unit of execution. Multiple threads within the same process share resources.**

Taking the Java language we are familiar with, Java programs run on the JVM, and each JVM is actually a process. All resource allocations are based on the JVM process. In this JVM process, many threads can be created, multiple threads share JVM resources, and multiple threads can execute concurrently.
