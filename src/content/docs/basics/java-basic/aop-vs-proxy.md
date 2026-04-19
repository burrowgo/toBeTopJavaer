---
title: "Aop Vs Proxy"
---

There are mainly two ways of dynamic proxy in Spring AOP: JDK dynamic proxy and CGLIB dynamic proxy.

JDK dynamic proxy receives the proxied class through reflection and requires the proxied class to implement an interface. The core of JDK dynamic proxy is the `InvocationHandler` interface and the `Proxy` class.

If the target class does not implement an interface, Spring AOP will choose to use CGLIB for dynamic proxying of the target class.

CGLIB (Code Generation Library) is a code generation library that can dynamically generate a subclass of a certain class at runtime. Note that CGLIB performs dynamic proxying through inheritance, so if a class is marked as `final`, it cannot use CGLIB for dynamic proxying.
