---
title: "Parents Delegate"
---

In the process of loading classes, the virtual machine needs to use class loaders. In Java, there are many class loaders. When the JVM wants to load a .class file, which class loader should load it?

This brings us to the "Parent Delegation Mechanism."

First, we need to know that the Java language system supports the following four types of class loaders:

* Bootstrap ClassLoader
* Extension ClassLoader
* Application ClassLoader
* User ClassLoader (User-defined class loader)

There is a hierarchical relationship between these four types of class loaders, as shown below:

![](https://www.hollischuang.com/wp-content/uploads/2021/01/16102749464329.jpg)

Generally, the loader at the upper level is considered the parent loader of the loader at the lower level. All loaders, except for the Bootstrap ClassLoader, have a parent loader.

The so-called parent delegation mechanism means that when a class loader receives a request for class loading, it will not directly load the specified class itself. Instead, it delegates this request to its parent loader to load. Only when the parent loader cannot load this class will the current loader be responsible for loading the class.

So, under what circumstances will the parent loader be unable to load a certain class?

In fact, the four types of loaders provided in Java have their own responsibilities:

* Bootstrap ClassLoader: mainly responsible for loading core Java libraries, such as rt.jar, resources.jar, charsets.jar, and classes under %JRE_HOME%\lib.
* Extension ClassLoader: mainly responsible for loading jar packages and class files in the %JRE_HOME%\lib\ext directory.
* Application ClassLoader: mainly responsible for loading all classes under the classpath of the current application.
* User ClassLoader: user-defined class loader, can load class files from specified paths.

This means that a user-defined class, such as com.hollis.ClassHollis, will never be loaded by the Bootstrap or Extension loaders.