---
title: "Overloading Vs Overriding"
---

Overloading and Overriding are two important concepts in Java. But for beginners, they are also relatively easy to confuse. This article gives two practical examples to explain what exactly overriding and overloading are.

## Definitions

First, let's look at the definitions of overloading and overriding separately:

**Overloading**: Refers to the situation in the same class where multiple functions or methods have the same name but different parameter lists. Such functions or methods with the same name but different parameters are called overloaded functions or methods.

**Overriding**: Refers to the case where there are two methods in Java's subclass and parent class with the same name and parameter list. Since they have the same method signature, the new method in the subclass will cover the original method in the parent class.

## Overloading Example

 class Dog{
```java
public void bark(){
System.out.println("woof ");
}
```
 
 //overloading method
```java
public void bark(int num){
for(int i=0; i<num; i++)
System.out.println("woof ");
}
}
```
 

In the code above, two bark methods are defined: one without parameters, and the other with an int parameter. We can say that these two methods are overloaded methods because they have the same method name but different parameter lists.

During compile time, the compiler can determine which specific bark method is called based on the method signature (method name and parameters).

The conditions and requirements for method overloading are:

1. The overloaded method must change the parameter list;
2. The overloaded method can change the return type;
3. The overloaded method can change the access modifier;
4. The overloaded method can declare new or broader checked exceptions;
5. Methods can be overloaded in the same class or in a subclass.

## Overriding Example

The following is an overriding example. After reading the code, try to guess the output:

 class Dog{
```java
public void bark(){
System.out.println("woof ");
}
}
class Hound extends Dog{
public void sniff(){
System.out.println("sniff ");
}
 
public void bark(){
System.out.println("bowl");
}
}
 
public class OverridingTest{
public static void main(String [] args){
Dog dog = new Hound();
dog.bark();
}
}
```
 

Output:

 bowl
 

In the example above, we defined a bark method in both the parent class and the subclass, and they are both parameterless methods. So we say this situation is method overriding. That is, the subclass Hound overrides the bark method in the parent class Dog.

In the main method for testing, the dog object is defined as the Dog type.

During compile time, the compiler checks if the Dog class has an accessible bark() method. As long as it contains a bark() method, compilation will pass.

During runtime, a Hound object is created (using new) and assigned to the dog variable. At this time, the JVM clearly knows that the dog variable actually points to a reference of a Hound object. Therefore, when dog calls the bark() method, it will call the bark() method defined in the Hound class. This is what is known as dynamic polymorphism.

The conditions and requirements for method overriding are:

1. The parameter list must be exactly the same as that of the overridden method;
2. The return type must be exactly the same as the return type of the overridden method;
3. The restrictiveness of the access level must not be stronger than that of the overridden method;
4. The restrictiveness of the access level can be weaker than that of the overridden method;
5. The overriding method must not throw new checked exceptions or checked exceptions broader than those declared by the overridden method;
6. The overriding method can throw fewer or more limited exceptions (that is, the overridden method declares an exception, but the overriding method can declare nothing);
7. Final methods cannot be overridden;
8. If a method cannot be inherited, it cannot be overridden.