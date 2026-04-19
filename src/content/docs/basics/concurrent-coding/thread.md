---
title: "Thread"
---

In a multi-threaded operating system, a process usually includes multiple threads. Each thread is the basic unit for utilizing the CPU and is an entity with minimal overhead. Threads have the following attributes:

## Lightweight Entity

Entities in a thread basically do not own system resources, but only a small amount of essential resources to ensure independent operation. Thread entities include programs, data, and TCB. A thread is a dynamic concept, and its dynamic characteristics are described by the Thread Control Block (TCB). The TCB includes the following information:
(1) Thread state.
(2) Contextual resources saved when the thread is not running.
(3) A set of execution stacks.
(4) Main memory area for storing local variables of each thread.
(5) Access to the main memory and other resources within the same process.
A set of registers and stacks used to indicate the program counter of the executed instruction sequence, retain local variables, a few state parameters, and return addresses.

## Basic Unit for Independent Scheduling and Dispatching

In a multi-threaded operating system, a thread is a basic unit that can run independently, and therefore it is also a basic unit for independent scheduling and dispatching. Since threads are very "light," thread switching is very rapid and has low overhead (within the same process).

## Concurrent Execution

Multiple threads in a process can execute concurrently, and even all threads in a process can be allowed to execute concurrently. Similarly, threads in different processes can also execute concurrently, making full use of the ability of processors and peripheral devices to work in parallel.

## Shared Process Resources

Each thread in the same process can share the resources owned by that process. This is first manifested in: all threads have the same address space (the address space of the process), which means that the thread can access every virtual address in the address space. In addition, it can also access open files, timers, semaphore mechanisms, etc., owned by the process. Since threads within the same process share memory and files, communication between threads does not need to call the kernel.
