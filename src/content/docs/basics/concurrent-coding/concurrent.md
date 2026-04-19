---
title: "Concurrent"
---

Concurrency, in an operating system, refers to several programs being in a state between having started running and having finished running within a period of time, and these programs are all running on the same processor.

So, how does the operating system achieve this concurrency?

The operating systems we use today, whether Windows, Linux, or macOS, are actually **multi-user, multi-tasking time-sharing operating systems**. Users of these operating systems can do multiple things "at the same time."

However, in reality, for a single-CPU computer, only one thing can be done at a time in the CPU. To make it look like multiple things are being done "at the same time," a time-sharing operating system divides CPU time into time intervals of roughly the same length, known as "time slices." Through the management of the operating system, these time slices are allocated to each user in turn.

If a task is not completed before its time slice ends, the task is suspended, gives up the CPU, and waits for the next round of the cycle to continue. At this point, the CPU is allocated to another task.

Because computer processing speeds are very fast, as long as the intervals between time slices are appropriate, a user task will only experience a slight "pause" from the end of one allocated time slice to the start of the next CPU time slice. This pause is imperceptible to users, making it seem as if the entire system is "exclusively" used by them.

Therefore, in a single-CPU computer, what appears to be doing multiple things "at the same time" is actually completed concurrently through CPU time-slicing technology.
