---
title: "Final In Java"
---

`final` is a keyword in Java, which means "this part cannot be modified".

`final` can be used to define: variables, methods, and classes.

### final variables

If a variable is set to `final`, the value of the `final` variable cannot be changed (it will be a constant).


``` java
class Test{
     final String name = "Hollis";
     
}
```

Once a `final` variable is defined, it cannot be modified.

### final methods

If any method is declared as `final`, it cannot be overridden.

``` java
class Parent {
    final void name() {
        System.out.println("Hollis");
    }
}
```
    
When we define a subclass of the above class, the `name` method cannot be overridden, and compilation will fail.


### final classes

If any class is declared as `final`, it cannot be inherited.


``` java
final class Parent {
        
}
```
    
    
The above class cannot be inherited!
