---
title: "Implements Of Parents Delegate"
---

The parent delegation model is important for the stable operation of Java programs, but its implementation is not complicated.

The code implementing parent delegation is concentrated in the loadClass() method of java.lang.ClassLoader:

``` java
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }
    
                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);
    
                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```
        
The code is not difficult to understand and mainly consists of the following steps:

1. First, check if the class has already been loaded.

2. If not loaded, call the parent loader's loadClass() method to load.

3. If the parent loader is null, the Bootstrap ClassLoader is used as the parent loader by default.

4. If the parent class loading fails, after a ClassNotFoundException is thrown, call its own findClass() method to load.