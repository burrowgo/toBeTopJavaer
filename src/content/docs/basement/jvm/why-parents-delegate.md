---
title: "Why Parents Delegate"
---

As mentioned earlier, because there is a strict hierarchical relationship between class loaders, Java classes also have a hierarchical relationship.

Or rather, this hierarchical relationship is one of priority.

For example, a class defined under the java.lang package, because it is stored in rt.jar, will be delegated all the way to the Bootstrap ClassLoader during the loading process and eventually loaded by the Bootstrap ClassLoader.

A user-defined com.hollis.ClassHollis class will also be delegated all the way up to the Bootstrap ClassLoader. However, since the Bootstrap ClassLoader is not responsible for loading this class, the Extension ClassLoader will then attempt to load it. Since the Extension ClassLoader is also not responsible for loading this class, it will finally be loaded by the Application ClassLoader.

This mechanism has several benefits.

First, through delegation, repeated loading of classes can be avoided. When a parent loader has already loaded a class, the child loader will not reload it.

In addition, the parent delegation method also ensures security. Because the Bootstrap ClassLoader only loads classes from jar packages in JAVA_HOME, such as java.lang.Integer, this class will not be replaced easily unless someone gains access to your machine and corrupts your JDK.

This prevents someone from loading a custom, destructive version of java.lang.Integer. This effectively prevents the core Java API from being tampered with.