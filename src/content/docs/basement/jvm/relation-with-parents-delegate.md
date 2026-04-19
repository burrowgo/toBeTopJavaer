---
title: "Relation With Parents Delegate"
---

Many people see names like parent loader and child loader and assume that there is an inheritance relationship between class loaders in Java.

In fact, many articles on the internet also have similar erroneous views.

It should be clarified here that in the parent delegation model, the parent-child relationship between class loaders is generally not implemented through inheritance (Inheritance), but rather through composition (Composition) to reuse the code of the parent loader.

The following is the definition of the parent loader in ClassLoader:

``` java
public abstract class ClassLoader {
    // The parent class loader for delegation
    private final ClassLoader parent;
}
```
