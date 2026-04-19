---
title: "State Of Thread"
---

Threads have states, and these states can transition between each other. There are 6 types of thread states in Java:

*   1. NEW: A new thread object has been created, but the `start()` method has not yet been called.
*   2. RUNNABLE: In Java, the READY and RUNNING states are collectively referred to as "RUNNABLE."
    *   READY: After the thread object is created, other threads (such as the main thread) call the `start()` method of that object. Threads in this state are in the runnable thread pool, waiting to be selected by the thread scheduler and allocated CPU usage rights.
    *   RUNNING: A thread in the READY state has obtained a CPU time slice and begins executing program code.
*   3. BLOCKED: Indicates that the thread is blocked waiting for a monitor lock (locks will be introduced in later chapters).
*   4. WAITING: A thread in this state needs to wait for other threads to perform specific actions (notification or interruption).
*   5. TIMED_WAITING: Unlike WAITING, this state can return on its own after a specified time.
*   6. TERMINATED: Indicates that the thread has finished executing.

The following is a transition diagram of thread states:

<img src="https://www.hollischuang.com/wp-content/uploads/2018/12/167019dc85aaaf5a.jpg" alt="" width="1155" height="771" class="aligncenter size-full wp-image-5859" />

As seen, the transition paths between the various states in the diagram are labeled with corresponding Java methods. These are the APIs for thread scheduling in Java.
