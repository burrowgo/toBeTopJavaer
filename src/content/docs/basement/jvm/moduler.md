---
title: "Moduler"
---

In recent years, modular technology has become very mature, and modular technology has been applied in JDK 9.

In fact, long before JDK 9, frameworks like OSGI were already modular. **The reason OSGI can achieve hot-swapping of modules and precise control over internal visibility of modules is due to its special class loading mechanism. The relationship between loaders is no longer the tree structure of the parent delegation model, but has developed into a complex mesh structure.**

![w942](https://www.hollischuang.com/wp-content/uploads/2021/01/16102754973998.jpg)

**In the JDK, parent delegation is no longer absolute.**

Before JDK 9, JVM's base classes were all in the rt.jar package, which was the cornerstone of the JRE runtime.

This not only violated the single responsibility principle but also caused bloat as many useless classes were packaged together during compilation.

**In JDK 9, the entire JDK is built based on modularity. The former rt.jar and tool.jar have been split into dozens of modules. During compilation, only the modules actually used are compiled, and each class loader performs its duty, only loading the modules it is responsible for.**

``` java
Class<?> c = findLoadedClass(cn);
if (c == null) {
    // Find which module the current class belongs to
    LoadedModule loadedModule = findLoadedModule(cn);
    if (loadedModule != null) {
        // Get the class loader for the current module
        BuiltinClassLoader loader = loadedModule.loader();
        // Perform class loading
        c = findClassInModuleOrNull(loadedModule, cn);
     } else {
          // Only perform parent delegation if no module information is found
            if (parent != null) {
              c = parent.loadClassOrNull(cn);
            }
      }
}
```
    

### Summary

The above has comprehensively introduced the knowledge of parent delegation, from what it is to how it is implemented and broken, as well as examples of breaking it.

I believe that through studying this article, you must have a deeper understanding of the parent delegation mechanism.

After reading this article, confidently write on your resume: "Familiar with Java's class loading mechanism, feel free to ask!"