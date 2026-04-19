---
title: "Linux Io"
---

### Blocking I/O Model

The most traditional I/O model, where blocking occurs during the process of reading and writing data.

When a user thread issues an I/O request, the kernel checks if the data is ready. If not, it waits for the data to become ready, and the user thread enters a blocked state, yielding the CPU. Once the data is ready, the kernel copies it to the user thread and returns the result, at which point the user thread is unblocked.

A typical example of a blocking I/O model is:
```
data = socket.read();
```
If the data is not ready, it will remain blocked in the `read()` method.

### Non-blocking I/O Model

When a user thread initiates a read operation, it does not need to wait and receives a result immediately. If the result is an error, it knows the data is not ready and can send the read operation again. Once the data in the kernel is ready and another request from the user thread is received, the kernel immediately copies the data to the user thread and returns.

In fact, in the non-blocking I/O model, the user thread needs to constantly poll the kernel to see if the data is ready. This means non-blocking I/O does not yield the CPU but continues to occupy it.

A typical non-blocking I/O model generally looks like this:
```
while(true){
``` 
data = socket.read();
if(data != error){
    // process data
    break;
}
```
}
```
However, non-blocking I/O has a serious issue: the constant polling in the `while` loop leads to very high CPU utilization. Therefore, this approach is rarely used in practice.

### I/O Multiplexing Model

The I/O multiplexing model is currently widely used. Java NIO is essentially based on I/O multiplexing.

In this model, a single thread constantly polls the status of multiple sockets. Only when a socket actually has a read or write event does it call the actual I/O operation. Since one thread can manage multiple sockets, the system doesn't need to create or maintain many processes or threads. I/O resources are only used when there are actual events, significantly reducing resource consumption.

In Java NIO, `selector.select()` is used to query each channel for events. If no events are present, it remains blocked, which causes the user thread to block.

One might argue that Multi-threading + Blocking I/O could achieve a similar effect. However, in that model, each socket corresponds to one thread, leading to high resource consumption. For long-lived connections, threads are not released, causing performance bottlenecks as connections increase.

In contrast, I/O multiplexing manages multiple sockets with one thread, only occupying resources when actual events occur. Thus, it is more suitable for high-concurrency scenarios.

Additionally, I/O multiplexing is more efficient than non-blocking I/O because polling is performed by the kernel rather than the user thread.

Note that I/O multiplexing detects events via polling and responds to them sequentially. If an event handler is very large, it may delay subsequent events and affect new event polling.

### Signal-Driven I/O Model

In the signal-driven I/O model, when a user thread initiates an I/O request, it registers a signal handler for the corresponding socket. The user thread then continues execution. When the kernel data is ready, it sends a signal to the user thread. Upon receiving the signal, the user thread calls the I/O read/write operation within the signal handler to perform the actual request.

### Asynchronous I/O Model

Asynchronous I/O is an ideal model. When a user thread initiates a read operation, it can immediately start doing other things. From the kernel's perspective, upon receiving an asynchronous read, it returns immediately, indicating the request was successfully initiated, without blocking the user thread. The kernel then waits for the data to be ready, copies it to the user thread, and sends a signal to notify that the read operation is complete. The user thread doesn't need to know how the I/O operation is performed; it just initiates the request and uses the data once notified of success.

In this model, neither phase of the I/O operation blocks the user thread. Both phases are handled automatically by the kernel. This differs from the signal-driven model, where the signal only indicates data readiness, requiring the user thread to call the I/O function. In asynchronous I/O, the signal indicates completion.

Note that asynchronous I/O requires underlying OS support. Java 7 introduced Asynchronous I/O (AIO).

The first four models are essentially synchronous I/O. Only the last one is true asynchronous I/O. In models like I/O multiplexing or signal-driven I/O, the second phase (data copying) still blocks the user thread.
