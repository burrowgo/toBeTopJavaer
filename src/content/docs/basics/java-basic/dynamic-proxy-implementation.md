---
title: "Dynamic Proxy Implementation"
---

In Java, there are two primary ways to implement dynamic proxy:

```java
1. **JDK Dynamic Proxy:** The `Proxy` class and `InvocationHandler` interface in the `java.lang.reflect` package provide the capability to generate dynamic proxy classes.
2. **CGLIB Dynamic Proxy:** CGLIB (Code Generation Library) is a third-party code generation library that dynamically generates a subclass object in memory at runtime to extend the functionality of the target object.
```

This article won't dive deep into the specific syntax of both; I'll write separate articles for that later. Instead, we'll focus on the differences and use cases for these two types of dynamic proxies.

### Differences Between JDK and CGLIB Dynamic Proxy

JDK dynamic proxy has a limitation: the object being proxied must implement one or more interfaces. If you want to proxy a class that does not implement any interfaces, you can use CGLIB.

```java
CGLIB is a powerful, high-performance code generation package that can extend Java classes and implement Java interfaces at runtime. It is widely used by many AOP frameworks, such as Spring AOP and dynaop, to provide method interception.
```

Under the hood, CGLIB uses ASM, a small and fast bytecode processing framework, to transform bytecode and generate new classes. Direct use of ASM is discouraged because it requires a deep understanding of the JVM's internal structure, including class file formats and instruction sets.

**The biggest difference:**
- JDK dynamic proxy requires the target object to implement one or more interfaces.
- CGLIB proxy does not require the target object to implement any interfaces, allowing for "non-intrusive" proxying.

### General Steps to Implement Dynamic Proxy in Java

1. Define a delegate (target) class and a public interface.
2. Define a "call processor" class (implementing the `InvocationHandler` interface) to specify the specific tasks (including pre-processing and post-processing) that the dynamically generated proxy class needs to perform. Any method called on the proxy class will pass through this processor.
3. Generate the proxy object (which also involves generating the proxy class) by specifying the delegate object, the interfaces to be implemented, and an instance of the call processor. Each proxy object corresponds to one delegate object and one call processor instance.

### Key Classes Involved in Java Dynamic Proxy

- `java.lang.reflect.Proxy`: The main class for generating proxy classes. All proxy classes generated via this class inherit from `Proxy` (i.e., `DynamicProxyClass extends Proxy`).
- `java.lang.reflect.InvocationHandler`: This is the "call processor" interface. The specific logic for the dynamically generated proxy class must be defined in a class that implements this interface.

### Dynamic Proxy Implementation

Goal: Print a message before and after calling a method in the `UserServiceImpl` class without modifying the class itself.

```java
public class UserServiceImpl implements UserService {
``` java
```java
@Override
public void add() {
    System.out.println("--------------------add----------------------");
}
```
```
}
```

#### JDK Dynamic Proxy

```java
public class MyInvocationHandler implements InvocationHandler {
``` java
```java
private Object target;
```

public MyInvocationHandler(Object target) {
    super();
    this.target = target;
}

```java
@Override
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    System.out.println("-----------------begin " + method.getName() + "-----------------");
    Object result = method.invoke(target, args);
    System.out.println("-----------------end " + method.getName() + "-----------------");
    return result;
}
```

public Object getProxy() {
    return Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(), target.getClass().getInterfaces(), this);
}
```
}

public static void main(String[] args) {
``` 
UserService service = new UserServiceImpl();
MyInvocationHandler handler = new MyInvocationHandler(service);
UserService proxy = (UserService) handler.getProxy();
proxy.add();
```
}
```

#### CGLIB Dynamic Proxy

```java
public class CglibProxy implements MethodInterceptor {
``` java
private Enhancer enhancer = new Enhancer();

public Object getProxy(Class clazz) {
    // Set the class to create a subclass of
    enhancer.setSuperclass(clazz);
    enhancer.setCallback(this);
    // Dynamically create a subclass instance using bytecode technology
    return enhancer.create();
}

// Implement the MethodInterceptor interface method
public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
    System.out.println("Pre-proxy");
    // Call the parent class method via the proxy class
    Object result = proxy.invokeSuper(obj, args);
    System.out.println("Post-proxy");
    return result;
}
```
}

public class DoCGLib {
``` java
```java
public static void main(String[] args) {
    CglibProxy proxy = new CglibProxy();
    // Create the proxy class by generating a subclass
    UserServiceImpl proxyImp = (UserServiceImpl) proxy.getProxy(UserServiceImpl.class);
    proxyImp.add();
}
```
```
}
```
