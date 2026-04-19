---
title: "Dynamic Proxy"
---

Previously, we introduced [Static Proxy](/basics/java-basic/static-proxy). While the static proxy pattern is very useful, it has certain limitations. For instance, it requires developers to write a significant amount of boilerplate code, which is a waste of time and energy. When a class has many methods or when multiple objects need to be proxied simultaneously, the complexity increases substantially.

Is there a method that doesn't require developers to manually write proxy classes? That's where **Dynamic Proxy** comes in.

In dynamic proxy, the proxy class does not need to be determined at compile time. Instead, it can be generated dynamically at runtime to implement proxy functionality for the target object.

Reflection is one way to implement dynamic proxy.