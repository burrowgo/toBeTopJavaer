---
title: "Spi Principle"
---

Examine the signature and member variables of the `ServiceLoader` class:

```java
public final class ServiceLoader<S> implements Iterable<S> {
``` java
private static final String PREFIX = "META-INF/services/";

// Represents the class or interface being loaded
private final Class<S> service;

// The class loader used to locate, load, and instantiate providers
private final ClassLoader loader;

// The access control context used when the ServiceLoader was created
private final AccessControlContext acc;

// Cache of providers, in instantiation order
private LinkedHashMap<String, S> providers = new LinkedHashMap<>();

// Lazy-lookup iterator
```java
private LazyIterator lookupIterator;
```

......
```
}
```

Based on the source code, the implementation process is as follows:

### 1. The application calls the `ServiceLoader.load` method

Inside the `ServiceLoader.load` method, a new `ServiceLoader` instance is created, and its member variables are initialized, including:

*   `loader`: (Type: `ClassLoader`) The class loader.
*   `acc`: (Type: `AccessControlContext`) The access controller.
*   `providers`: (Type: `LinkedHashMap`) Used to cache successfully loaded classes.
*   `lookupIterator`: Implements iterator functionality.

### 2. The application obtains object instances via the iterator interface

The `ServiceLoader` first checks if the `providers` map contains any cached instances. If a cache exists, it returns it directly.
If there is no cache, it performs class loading:

*   Reads the configuration files under `META-INF/services/` to obtain the names of all classes that can be instantiated.
*   Loads the class objects using the reflection method `Class.forName()` and instantiates them using the `newInstance()` method.
*   Caches the instantiated classes into the `providers` map.
*   Returns the instance object.
