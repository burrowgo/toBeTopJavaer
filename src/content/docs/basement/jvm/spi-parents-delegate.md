---
title: "Spi Parents Delegate"
---

In our daily development, we most often call basic classes provided by Java through APIs. These basic classes are loaded by the Bootstrap loader.

However, besides API calls, there is also an SPI (Service Provider Interface) method.

A typical example is the JDBC service, where we usually create a database connection in the following way:

``` 
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mysql", "root", "1234");
```
    

Before the above code is executed, DriverManager will first be loaded by the class loader. Since the java.sql.DriverManager class is located under rt.jar, it will be loaded by the Bootstrap loader.

When the class is loaded, its static methods are executed. One critical piece of code is:

``` 
ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
```
    

This code will attempt to load all implementation classes of the Driver interface on the classpath.

Now, here comes the problem.

**DriverManager is loaded by the Bootstrap loader. When it encounters the above code during loading, it will try to load all Driver implementation classes. However, these implementation classes are mostly provided by third parties. According to the parent delegation principle, third-party classes cannot be loaded by the Bootstrap loader.**

So, how is this problem solved?

Therefore, **the parent delegation principle is broken in JDBC by introducing ThreadContextClassLoader (Thread Context Class Loader, which defaults to AppClassLoader).**

Diving into the ServiceLoader.load method, we can see:

``` java
public static <S> ServiceLoader<S> load(Class<S> service) {
    ClassLoader cl = Thread.currentThread().getContextClassLoader();
    return ServiceLoader.load(service, cl);
}
```
    

The first line retrieves the context class loader of the current thread, AppClassLoader, which is used to load the specific implementation classes in the classpath.