---
title: "Create Annotation"
---

In Java, classes are defined with `class`, and interfaces are defined with `interface`. The definition of an annotation is similar to an interface, but with an added `@` symbol, i.e., `@interface`. The code is as follows:

``` java
public @interface EnableAuth {
    
}
```

Annotations can define member variables for describing information, similar to the definition of methods in an interface. The code is as follows:
    
``` java
public @interface EnableAuth {
    String name();
}
```

You can also add default values:

``` java
public @interface EnableAuth {
    String name() default "YuanTianDi";
}
```

The above introduction only completes the first step of custom annotations. In daily development, annotations are mostly used on classes, methods, and fields. Example code is as follows:

``` java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface EnableAuth {
    
}
```

### Target

Used to specify which program units the decorated annotation can modify, such as classes, methods, or fields mentioned above.

### Retention

Used to specify how long the decorated annotation is retained. There are three types: 
* **SOURCE**: Annotation only exists in source code, not in class bytecode.
* **CLASS**: Default retention policy, annotation exists in class bytecode but cannot be obtained at runtime.
* **RUNTIME**: Annotation exists in class bytecode and can be obtained at runtime through reflection. If you want to obtain annotation information through reflection during program execution, you need to set `Retention` to `RUNTIME`.

### Documented

Used to specify that the decorated annotation class will be extracted into documentation by the javadoc tool.

### Inherited

Used to specify that the decorated annotation class will be inheritable.
