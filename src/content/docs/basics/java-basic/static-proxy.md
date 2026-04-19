---
title: "Static Proxy"
---

Static proxy refers to a proxy class written by the programmer themselves, determined at compile time. Let's look at the following example:

```java
public interface HelloSerivice {
``` java
```java
public void say();
```
```
}

public class HelloSeriviceImpl implements HelloSerivice{

``` java
```java
@Override
public void say() {
    System.out.println("hello world");
}
```
```
}
```

The code above is relatively simple, defining an interface and its implementation class. These are the target object and the target object's interface in the proxy pattern. Next, define the proxy object.

```java
public class HelloSeriviceProxy implements HelloSerivice{

``` java
```java
private HelloSerivice target;
public HelloSeriviceProxy(HelloSerivice target) {
    this.target = target;
}

@Override
public void say() {
    System.out.println("Logging...");
    target.say();
    System.out.println("Cleaning up data...");
}
```
```
}
```

The above is a proxy class; it also implements the target object's interface and extends the `say` method. Below is a test class:

```java
public class Main {
``` java
@Test
```java
public void testProxy(){
    // Target object
    HelloSerivice target = new HelloSeriviceImpl();
    // Proxy object
    HelloSeriviceProxy proxy = new HelloSeriviceProxy(target);
    proxy.say();
}
```
```
}
```

// Logging...
// hello world
// Cleaning up data...

This is a simple implementation of the static proxy pattern. All roles in the proxy pattern (proxy object, target object, target object's interface, etc.) are determined at compile time.

### Uses of Static Proxy

1.  **Control access to the real object:** Control the permissions of using the real object through the proxy object.
2.  **Avoid creating large objects:** By using a small proxy object to represent a real large object, system resource consumption can be reduced, the system optimized, and running speed improved.
3.  **Enhance the functionality of the real object:** This is relatively simple; through a proxy, extra functionality can be added before and after calling the real object's methods.
