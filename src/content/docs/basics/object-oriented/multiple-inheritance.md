---
title: "Multiple Inheritance"
---

Previously we mentioned: "Java supports a class implementing multiple interfaces at the same time, but does not support inheriting from multiple classes at the same time. However, this issue is no longer absolute after Java 8."

So, you might want to know why Java does not support inheriting from multiple classes at the same time?
### Multiple Inheritance

The case where a class has only one parent class is called single inheritance. The case where a class has multiple parent classes at the same time is called multiple inheritance.

In Java, a class can only inherit from one class through the extends keyword; multiple inheritance is not allowed. However, multiple inheritance might be supported in other object-oriented languages.

For example, C++ supports multiple inheritance, mainly because the programming process is an abstraction of the real world, and in the real world, there are indeed situations that require multiple inheritance. For example, Wikipedia gives an example of multiple inheritance:
 
For example, you can create a "Mammal" class with functions such as eating and reproducing; then define a subtype "Cat", which can inherit the above functions from the parent class.
 
However, "Cat" can also be a subclass of "Pet", possessing some abilities unique to pets.

Therefore, some object-oriented languages support multiple inheritance.

However, over the years, multiple inheritance has always been a sensitive topic, with opponents arguing that it increases the complexity and ambiguity of the program.

### The Diamond Problem


Suppose we have classes B and C, both inheriting from the same class A. Additionally, we have class D, which inherits from both class B and class C through the multiple inheritance mechanism.

![][1]

At this time, because D inherits from both B and C, and B and C both inherit from A, D will inherit two copies of attributes and methods from A due to multiple inheritance.

Then, when using D, if you want to call a method defined in A, ambiguity arises.

Because the shape of such inheritance relationships is similar to a diamond, this problem is vividly called the Diamond Problem.

To solve the Diamond Problem, C++ introduced **virtual inheritance**.

Because supporting multiple inheritance introduced the Diamond Problem, and to solve the Diamond Problem, virtual inheritance was introduced. After analysis, people found that there are actually not many situations where we truly want to use multiple inheritance.

Therefore, in Java, "implementation multiple inheritance" is not allowed, i.e., a class is not allowed to inherit from multiple parent classes. However, Java allows "declaration multiple inheritance", i.e., a class can implement multiple interfaces, and an interface can also inherit from multiple parent interfaces. Since interfaces only allowed method declarations and not method implementations (before Java 8), this avoided the ambiguity of multiple inheritance in C++.


However, the fact that Java does not support multiple inheritance is no longer so absolute after Java 8 supported default methods.

Although we still cannot use extends to inherit from multiple classes at the same time, because of default methods, we might inherit multiple default methods from multiple interfaces through implements. Then, how to solve the Diamond Problem brought about by this situation?

We will introduce this problem separately in the later Chapter 20.4.


 [1]: https://www.hollischuang.com/wp-content/uploads/2021/02/16145019571199.jpg
