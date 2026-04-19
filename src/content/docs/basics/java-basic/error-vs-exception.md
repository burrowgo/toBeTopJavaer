---
title: "Error Vs Exception"
---

Exception and Error are both important subclasses of Java exception handling, each containing a large number of subclasses. Both inherit from the Throwable class.

Error represents system-level errors, which are internal errors of the java runtime environment or hardware problems. You cannot expect the program to handle such problems, and there is no choice but to exit. It is thrown by the Java Virtual Machine.

Exception represents exceptions that the program needs to catch and handle, which are problems caused by imperfect program design and problems that the program must handle.
