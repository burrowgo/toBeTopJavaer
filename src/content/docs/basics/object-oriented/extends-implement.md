---
title: "Extends Implement"
---

In previous chapters, we mentioned three characteristics of object-oriented: encapsulation, inheritance, and polymorphism. We have introduced these three characteristics separately.

We know that inheritance can use all functions of an existing class and extend these functions without re-writing the original class. This derivation method reflects *transitivity*.

In Java, in addition to inheritance, there is another way that reflects transitivity called implementation. So, what is the difference between these two ways?

The clear definitions and differences between inheritance and implementation are as follows:

Inheritance (Inheritance): If parts of functions of multiple classes are the same, then a class can be abstracted, and their common parts are put into the parent class, letting them all inherit this class.

Implementation (Implement): If the goals processed by multiple classes are the same, but the methods and ways of processing are different, then an interface is defined, which is a standard, letting them implement this interface and each implement their specific processing methods to handle that goal.

Inheritance refers to the ability of a class (called a subclass or sub-interface) to inherit the functions of another class (called a parent class or parent interface) and add its own new functions. Therefore, the fundamental reason for inheritance is to *reuse*, while the fundamental reason for implementation is the need to define a *standard*.
 
In Java, inheritance is achieved using the `extends` keyword, while implementation is through the `implements` keyword.

 >To put it simply, the same car can be an electric car, a gasoline car, or a hybrid, as long as it implements different standards. However, a car can only belong to one brand and one manufacturer.
 
```java
class Car extends Benz implements GasolineCar, ElectroCar{
 
}

```

In the above, we defined a car that implements two standards: electric car and gasoline car, but it belongs to the brand Mercedes-Benz. By defining it like this, we can follow the standards to the greatest extent and reuse all existing functional components of Mercedes-Benz cars.

In addition, only global constants (static final) and methods without implementation (default methods can be used after Java 8) can be defined in an interface; while attribute methods, variables, constants, etc., can be defined in inheritance.

*It is especially important to note that Java supports a class implementing multiple interfaces at the same time, but does not support inheriting from multiple classes at the same time.* However, this issue is no longer absolute after Java 8. We will introduce the issue of multiple inheritance in the next chapter.
