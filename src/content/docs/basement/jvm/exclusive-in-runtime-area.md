---
title: "Exclusive In Runtime Area"
---

In the JVM runtime memory area, the PC Register, JVM Stack, and Native Method Stack are thread-exclusive.

Java Heap and Method Area are thread-shared. However, it's worth noting that the Java Heap also allocates a TLAB (Thread Local Allocation Buffer) space for each thread. This part of the space is thread-exclusive during allocation and thread-shared during use.