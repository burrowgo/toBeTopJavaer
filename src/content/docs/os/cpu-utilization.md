---
title: "CPU Load and Utilization"
---


## Overview
Understanding the difference between **CPU Load** and **CPU Utilization** is critical for performance tuning and troubleshooting in a production environment.

## CPU Utilization
**CPU Utilization** is the percentage of time the CPU was busy processing instructions during a given interval.
-   **Low Utilization (0-30%):** The CPU is largely idle.
-   **High Utilization (70-100%):** The CPU is actively processing tasks. 
-   *Note:* 100% utilization does not necessarily mean the system is overloaded if there are no tasks waiting in the queue.

## CPU Load (System Load)
**CPU Load** represents the number of processes that are either currently using the CPU or waiting to use it (runnable state).
-   **Load Average:** Linux provides load averages for 1, 5, and 15 minutes.
-   **Interpreting Load:**
``` 
-   If your CPU has 4 cores, a load of **4.0** means the CPU is perfectly full.
-   A load of **8.0** on 4 cores means for every process on a core, another one is waiting.
```

## Troubleshooting with `top`, `htop`, and `vmstat`
-   **`top` / `htop`:** Real-time view of processes and load.
-   **`vmstat`:** Reports virtual memory statistics, including CPU wait time (`wa`).

## High CPU in Java Applications
-   **Causes:** Infinite loops, frequent Full GC, heavy serialization, or high-throughput crypto operations.
-   **Identification:** Use `jstack` or `Arthas` to find which thread is consuming the most CPU cycles.
