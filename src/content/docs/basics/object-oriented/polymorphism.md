---
title: "Polymorphism"
---

In section 1.2, we introduced the three basic characteristics of object-oriented programming: encapsulation, inheritance, and polymorphism, and provided simple examples for encapsulation and inheritance.

In this section, we will expand on polymorphism, which was left over from the previous section.

## What is Polymorphism

We will first introduce what polymorphism is and its classification based on all programming languages, and then focus on polymorphism in Java.

Polymorphism refers to providing a unified interface for entities of different data types or using a single symbol to represent multiple different types. Generally, polymorphism can be divided into the following categories:

* Ad-hoc Polymorphism: Defining a common interface for an arbitrary set of specific types of individuals.
* Parametric Polymorphism: Specifying one or more types not by name but by abstract symbols that can identify any type.
* Subtyping: A name refers to instances of many different classes, which have a common superclass.

### Ad-hoc Polymorphism

Ad-hoc polymorphism is a type of polymorphism in programming languages where a polymorphic function has multiple different implementations, and the corresponding version of the function is called depending on its actual arguments.

Function overloading, which we introduced in the previous section, is a type of ad-hoc polymorphism. In addition, operator overloading is also a type of ad-hoc polymorphism.

### Parametric Polymorphism

Parametric polymorphism in programming languages and type theory refers to not specifying concrete types when declaring and defining functions, composite types, and variables, but using these types as parameters instead, making the definition applicable to various concrete types.

Parametric polymorphism actually has very wide applications. For example, generics in Java are a form of parametric polymorphism. Another area where parametric polymorphism is widely used is functional programming.

### Subtyping

In object-oriented programming, when a computer program is running, the same message may be sent to objects of multiple different categories, and the system can trigger methods of the corresponding category based on the category to which the object belongs, resulting in different behaviors.

This subtyping polymorphism is the common polymorphism in Java. Below, we will focus on this subtyping polymorphism in Java.

## Polymorphism in Java

The concept of polymorphism in Java is relatively simple: the same operation applied to different objects can have different interpretations and produce different execution results.

Polymorphism in Java is actually a runtime state. To achieve runtime polymorphism, or dynamic binding, three conditions must be met:

* There is class inheritance or interface implementation.
* Subclasses must override the methods of the parent class.
* A reference of the parent class points to an object of the subclass.

Let's explain with a simple piece of code:

``` java
public class Parent{
        
    public void call(){
        System.out.println("I am Parent");
    }
}

public class Son extends Parent{// 1. There is class inheritance
    public void call(){// 2. Subclass overrides parent class method
        System.out.println("I am Son");
    }
}

public class Daughter extends Parent{// 1. There is class inheritance
    public void call(){// 2. Subclass overrides parent class method
        System.out.println("I am Daughter");
    }
}

public class Test{
        
    public static void main(String[] args){
        Parent p = new Son(); // 3. Parent class reference points to subclass object
        Parent p1 = new Daughter(); // 3. Parent class reference points to subclass object
    }
}
```

In this way, polymorphism is achieved. Even though both are instances of the `Parent` class, `p.call` calls the implementation of the `Son` class, and `p1.call` calls the implementation of the `Daughter` class.

Some might say that you already knew `p` was a `Son` and `p1` was a `Daughter` when you defined them. However, sometimes the objects you use are not all declared by yourself.

For example, for objects coming out of IOC in Spring, you don't know who they are when you use them, or you don't need to care who they are. It depends on the specific situation.

> IOC is the abbreviation for Inversion of Control. It is a design idea that means handing over your designed objects to a container for control, instead of directly controlling them inside your objects as in the traditional way.
>
> In other words, when we use the Spring framework, objects are created and managed by the Spring container, and we only need to use them.

### Static Polymorphism

The polymorphism we mentioned above is a runtime concept. Additionally, there is another saying that polymorphism is divided into dynamic polymorphism and static polymorphism.

The dynamic binding mentioned above is considered dynamic polymorphism because only at runtime can we know which class's method is actually being called.

Many believe there is also static polymorphism. Generally, function overloading in Java is considered a form of static polymorphism because it needs to be decided which specific method to call during compilation.

Combining the concepts of overloading and overriding introduced in section 2.1, let's summarize these two concepts again:

1. Overloading is a compile-time concept, while overriding is a runtime concept.

2. Overloading follows so-called "compile-time binding," where the method to be called is determined based on the type of the argument variables at compile time.

3. Overriding follows so-called "runtime binding," where the method is called based on the type of the actual object pointed to by the reference variable at runtime.

4. Method overriding in Java is the implementation of Java polymorphism (subtyping). And method overloading in Java is actually an implementation of ad-hoc polymorphism.