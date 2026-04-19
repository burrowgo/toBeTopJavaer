---
title: "Tomcat Parents Delegate"
---

We know that Tomcat is a web container, and a web container may need to deploy multiple applications.

Different applications may depend on different versions of the same third-party library, but the full path name of a class in different versions of the library may be the same.

For example, multiple applications depend on hollis.jar, but application A depends on version 1.0.0, and application B depends on version 1.0.1. Both versions have a class named com.hollis.Test.class.

**If the default parent delegation class loading mechanism is used, multiple identical classes cannot be loaded.**

Therefore, **Tomcat breaks the parent delegation principle and provides an isolation mechanism, separately providing a WebAppClassLoader for each web container.**

Tomcat's class loading mechanism: To achieve isolation, classes defined by the web application itself are loaded preferentially. Therefore, it does not follow the parent delegation convention. Each application's own class loader - WebAppClassLoader - is responsible for loading class files in its own directory. If it cannot be loaded, it is handed over to the CommonClassLoader. This is exactly the opposite of parent delegation.