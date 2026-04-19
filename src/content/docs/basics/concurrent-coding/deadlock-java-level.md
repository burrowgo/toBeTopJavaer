---
title: "Java-Level Deadlock"
---


## 1. What is Deadlock
Deadlock is not very common in personal studies or even in development. However, once a deadlock occurs, the consequences can be very serious.
First, what is a deadlock? To use an analogy, it's like two people fighting and restricting (locking, holding) each other so that neither can move. Both are angry, and if you don't let go, I won't let go. In the end, no one can move.
In a multi-threaded environment, there is inevitable competition for resources. When two threads lock their current resources but both need the other's resource to proceed to the next step, both sides will wait indefinitely for the other to release the resource. This forms a deadlock. These processes that wait for each other forever are called deadlock processes.

To summarize, the conditions for a deadlock are:

  1. Mutual Exclusion: The lock on a resource is exclusive; only one thread can own the resource while it is locked. Other threads can only wait for the lock to be released before attempting to acquire the resource.
  2. Hold and Wait: A thread already owns at least one resource but simultaneously makes a new resource request, and the requested resource is owned by another thread. At this point, it enters a state of holding the current resource and waiting for the next one.
  3. No Preemption: A resource already owned by a thread can only be released by the thread itself and cannot be preempted by other threads.
  4. Circular Wait: Multiple threads are waiting for each other's resources while holding the resources needed by others for the next step. This forms a cycle, similar to (2) Hold and Wait, but here it refers to the relationship between multiple threads. It does not mean a single thread waits in a loop.

Still don't understand? Let's go straight to the code and write a deadlock ourselves.

## 2. Writing a Deadlock
According to the conditions, we will make two threads request and hold each other's resources.
```java
public class DeadLockDemo implements Runnable{

``` java
public static int flag = 1;

// static variables are shared by class objects
static Object o1 = new Object();
static Object o2 = new Object();

```java
@Override
public void run() {
    System.out.println(Thread.currentThread().getName() + ": current flag = " + flag);
    if(flag == 1){
        synchronized (o1){
            try {
                System.out.println("I am " + Thread.currentThread().getName() + ", locking o1");
                Thread.sleep(3000);
                System.out.println(Thread.currentThread().getName() + " woke up -> preparing to get o2");
            }catch (Exception e){
                e.printStackTrace();
            }
            synchronized (o2){
                System.out.println(Thread.currentThread().getName() + " got o2");// line 24
            }
        }
    }
    if(flag == 0){
        synchronized (o2){
            try {
                System.out.println("I am " + Thread.currentThread().getName() + ", locking o2");
                Thread.sleep(3000);
                System.out.println(Thread.currentThread().getName() + " woke up -> preparing to get o1");
            }catch (Exception e){
                e.printStackTrace();
            }
            synchronized (o1){
                System.out.println(Thread.currentThread().getName() + " got o1");// line 38
            }
        }
    }
}

public static void main(String args[]){
```

    DeadLockDemo t1 = new DeadLockDemo();
    DeadLockDemo t2 = new DeadLockDemo();
    DeadLockDemo.flag = 1;
    new Thread(t1).start();

    // Let the main thread sleep for 1 second to ensure t2 starts and locks o2, entering deadlock
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    DeadLockDemo.flag = 0;
    new Thread(t2).start();

}
```
}
```
In the code:
`t1` is created, acquires the lock for `o1`, and sleeps for 3 seconds.
`t2` is created, acquires the lock for `o2`, and sleeps for 3 seconds.
`t1` wakes up first, prepares to get the lock for `o2`, finds it locked, and must wait for `o2`'s lock to be released.
`t2` wakes up later, prepares to get the lock for `o1`, finds it locked, and must wait for `o1`'s lock to be released.
`t1` and `t2` form a deadlock.

Viewing the running status:

![Deadlock Image](https://img-blog.csdnimg.cn/20190329173537340.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3RpbW8xMTYwMTM5MjEx,size_16,color_FFFFFF,t_70)

## 3. Detecting and Troubleshooting Deadlocks
We can use the tools provided by the JDK to locate deadlock issues:

  1. `jps`: Displays all current Java Virtual Machine process names and PIDs.
  2. `jstack`: Prints process stack information.

![JPS Image](https://img-blog.csdnimg.cn/20190329174354777.png)

List all Java processes.
Check `DeadLockDemo` to see why this thread is not exiting the stack.

```shell
jstack 11170
```

![Jstack Image](https://img-blog.csdnimg.cn/20190329174417873.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3RpbW8xMTYwMTM5MjEx,size_16,color_FFFFFF,t_70)

Scroll directly to the end: a Java-level deadlock has been detected. The two threads are stuck at line 38 and line 24 of the code, respectively. Check the corresponding positions in the code to troubleshoot the error. Here, the second lock can never be obtained, resulting in a deadlock.

![Jstack Result Image](https://img-blog.csdnimg.cn/20190329174407208.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3RpbW8xMTYwMTM5MjEx,size_16,color_FFFFFF,t_70)

## 4. Solutions
Once a deadlock occurs, it cannot be resolved; we can only avoid its occurrence.
Since a deadlock requires four conditions to be met, we can start with the conditions and break any of the rules.

  1. (Mutual Exclusion) Use mutual exclusion locks as little as possible. Use read locks instead of write locks when possible. Of course, this is often unavoidable.
  2. (Hold and Wait) Adopt a static resource allocation strategy (meaning a process is allocated all the resources it needs when it is established). Try not to let threads request multiple locks at the same time, or if a thread holds one lock but cannot get the next, don't hold and wait; release the resources, wait for a while, and then re-request.
  3. (No Preemption) Allow processes to preempt resources held by other processes based on priority.
  4. (Circular Wait) Adjust the order of acquiring locks as much as possible to avoid nested resource requests. Add timeouts.
