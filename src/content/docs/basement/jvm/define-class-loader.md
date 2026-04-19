---
title: "Define Class Loader"
---

There are many methods in ClassLoader related to class loading. We mentioned loadClass earlier, but there are also findClass, defineClass, etc. What are the differences between these methods?

* loadClass()
    * This is the main method for class loading, and the default parent delegation mechanism is implemented in this method.
* findClass()
    * Loads the .class bytecode according to the name or location.
* defineClass()
    * Converts the bytecode into a Class object.
    
We need to elaborate on loadClass and findClass. As we said before, when we want to customize a class loader and break the parent delegation principle, we override the loadClass method.

What if we want to define a class loader but do not want to break the parent delegation model?

In this case, you can inherit from ClassLoader and override the findClass method. The findClass() method is a new method added to ClassLoader after JDK 1.2.

     /**
     * @since  1.2
     */
``` 
protected Class<?> findClass(String name) throws ClassNotFoundException {
    throw new ClassNotFoundException(name);
}
```
    
This method only throws an exception and has no default implementation.

After JDK 1.2, it is no longer recommended for users to directly override the loadClass() method. Instead, it is suggested to implement your own class loading logic in the findClass() method.

Because in the logic of the loadClass() method, if the parent class loader fails to load, it will call its own findClass() method to complete the loading.

So, if you want to define your own class loader and follow the parent delegation model, you can inherit from ClassLoader and implement your own loading logic in findClass.