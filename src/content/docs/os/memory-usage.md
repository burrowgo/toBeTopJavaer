---
title: "Linux Memory Management"
---


## Overview
Properly interpreting memory usage on Linux is essential for managing Java applications, especially because the JVM interacts deeply with the OS page cache.

## Free vs. Available Memory
-   **Free:** Memory that is completely unused.
-   **Available:** Memory that can be reclaimed from the OS cache and given to an application. This is a much better metric for determining if your system has enough memory.

## Buffers and Cache
Linux uses "free" memory to cache file data for better performance. This memory is not "wasted"—it's being used to speed up disk I/O but can be instantly reclaimed if an application needs it.

## Swap Usage
-   **What is Swap:** A portion of the disk used when physical RAM is full.
-   **Performance Impact:** Accessing data in swap is thousands of times slower than RAM. High "swapping" (swapping out and in) is a primary cause of high latencies in Java applications.
-   **Recommendation:** Set `swappiness` to a low value (e.g., 10) for Java servers to prevent premature swapping.

## Memory Issues in Java
-   **RSS (Resident Set Size):** Total memory a process is using in RAM. This includes the JVM Heap, Metaspace, Thread stacks, and Direct Memory.
-   **Memory Leak vs. High Usage:** Use `jmap -histo` or `Arthas` to determine if your heap is growing indefinitely or if you simply need a larger heap.
