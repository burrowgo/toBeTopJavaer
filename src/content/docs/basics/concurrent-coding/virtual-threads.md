---
title: "Virtual Threads (Project Loom)"
---


## Overview
**Virtual Threads**, introduced in **Java 21 (LTS)** via Project Loom, are lightweight threads that significantly reduce the effort of writing, maintaining, and observing high-throughput concurrent applications. They are designed to solve the **thread-per-request** scalability problem in traditional Java development.

## The Problem: Platform Threads
Traditionally, a `java.lang.Thread` is a **Platform Thread**, which is a thin wrapper around an OS thread. OS threads are expensive to create, consume a lot of memory (typically 1MB for the stack), and context switching between them is relatively slow.

In a traditional server architecture (like Tomcat), each request is handled by its own thread. This limits the number of concurrent requests to the number of available OS threads, which is usually in the thousands.

## The Solution: Virtual Threads
Virtual Threads are not tied to a specific OS thread. Instead, many virtual threads are multiplexed onto a small pool of platform threads (carrier threads).

When a virtual thread performs a **blocking I/O** operation (like waiting for a database response or an HTTP call), the JVM "unmounts" the virtual thread from its carrier thread and lets another virtual thread run. Once the I/O is complete, the virtual thread is "remounted" and continues execution.

### Key Benefits
- **Lightweight:** You can create millions of virtual threads in a single JVM.
- **Efficient I/O:** Virtual threads make blocking I/O as efficient as asynchronous/non-blocking I/O, without the complexity of callbacks or reactive programming.
- **Compatibility:** Virtual threads are still `java.lang.Thread`, so existing libraries and debuggers work with them.

## Usage
Creating a virtual thread is simple:
```java
Thread.ofVirtual().start(() -> {
``` 
System.out.println("Hello from a virtual thread!");
```
});
```

Using a virtual thread executor:
```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
``` 
executor.submit(() -> {
    // High-concurrency task
});
```
}
```

## Impact on 2026 Development
By 2026, virtual threads have largely replaced the need for complex reactive frameworks (like Project Reactor or RxJava) in most business applications. The return to simple, imperative, and synchronous-style code while maintaining extreme scalability is a major shift in the Java ecosystem.

### When NOT to Use Virtual Threads
- **CPU-bound tasks:** Virtual threads provide no benefit for tasks that are pure computation (e.g., video encoding, heavy math). In these cases, traditional platform threads or parallel streams are better.
- **Old Synchronized Blocks:** While the JVM is improving this, holding a lock via `synchronized` can sometimes "pin" a virtual thread to its carrier thread, preventing it from unmounting during I/O. Using `ReentrantLock` is often preferred when working with virtual threads.
