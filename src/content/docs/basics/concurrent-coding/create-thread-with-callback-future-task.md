---
title: "Create Thread With Callback Future Task"
---

Since Java 1.5, `Callable` and `Future` have been provided, allowing the result of a task to be obtained after its execution is complete.

``` java
public class MultiThreads {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        CallableThread callableThread = new CallableThread();
        FutureTask<String> futureTask = new FutureTask<>(callableThread);
        new Thread(futureTask).start();
        System.out.println(futureTask.get());
    }
}
    
class CallableThread implements Callable<String> {
    @Override
    public String call() throws Exception {
        System.out.println(Thread.currentThread().getName());
        return "Hollis";
    }
}
```
    

Output:

``` 
Thread-0
Hollis
```
    

`Callable` is located in the `java.util.concurrent` package. It is also an interface and declares only one method, `call()`. Unlike the `run()` method in the `Runnable` interface, the `call()` method has a return value.

In the code above, we return the string "Hollis" in the `call` method of `CallableThread`, and the main thread can retrieve it.

`FutureTask` can be used for asynchronously obtaining execution results or canceling tasks. By passing a `Callable` task to `FutureTask` and calling its `run` method directly or executing it in a thread pool, the execution result can be obtained asynchronously from the outside via the `get` method of `FutureTask`. Therefore, `FutureTask` is very suitable for time-consuming calculations; the main thread can perform its own tasks and then retrieve the result.

Additionally, `FutureTask` ensures that even if the `run` method is called multiple times, the `Runnable` or `Callable` task will only be executed once. It also allows canceling the execution of the `FutureTask` via `cancel`.

It is worth noting that `futureTask.get()` will block the main thread until the child thread has finished execution and returned the result before the subsequent code in the main thread can continue.

Generally, during the time before the `Callable` finishes execution, the main thread can perform other tasks and then retrieve the return result of the `Callable`. You can use `isDone()` to determine if the child thread has finished execution.

The modified version of the above code is as follows:

``` java
public class MultiThreads {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        CallableThread callableThread = new CallableThread();
        FutureTask<String> futureTask = new FutureTask<>(callableThread);
        new Thread(futureTask).start();
    
        System.out.println("Main thread performs other important tasks first");
        if(!futureTask.isDone()){
            // Continue doing other things
        }
        System.out.println(futureTask.get()); // May block waiting for the result
    }
}
```
    

Generally, we put `Callable` into a thread pool and let the thread pool execute the code in `Callable`. As introduced before, a thread pool is a technical means to avoid the overhead of repeatedly creating threads. Thread pools can also be used to create threads.
