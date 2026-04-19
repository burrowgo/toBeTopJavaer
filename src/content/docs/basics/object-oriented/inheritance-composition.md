---
title: "Inheritance Composition"
---

In the previous articles, we learned that encapsulation, inheritance, and polymorphism are the three characteristics of object-oriented programming. Through the study of inheritance and implementation, we know that inheritance helps us achieve class reuse.

Therefore, many developers naturally use class inheritance when they need to reuse some code.

However, it is not always correct to use inheritance directly whenever a reuse scenario is encountered. Extensive use of inheritance over a long period can bring high maintenance costs to the code.

This article will introduce a new concept that can help us with reuse - composition. By learning the concepts and differences between composition and inheritance, we will analyze how to make a choice when writing code from multiple perspectives.

## Object-Oriented Reuse Technology

Since reuse was mentioned earlier, let's briefly introduce object-oriented reuse technology.

Reusability is one of the great potential benefits brought by object-oriented technology. If used well, it can help us save a lot of development time and improve development efficiency. However, if abused, it may produce a lot of code that is difficult to maintain.

As an object-oriented development language, code reuse is one of Java's notable features. Code reuse in Java has three specific forms: inheritance, composition, and delegation. This article will focus on inheritance reuse and composition reuse.

## Inheritance

Inheritance was highlighted in previous chapters. We said that inheritance is the most common relationship between classes or interfaces; inheritance is an [`is-a`][1] relationship.

> is-a: represents a "is a" relationship, e.g., a dog is an animal.

![Inheritance][2]

## Composition

Composition reflects a relationship of whole and part, or ownership, which is a [`has-a`][3] relationship.

> has-a: represents a "has a" relationship, e.g., a dog has a tail.

![Composition][4]

## Differences and Connections Between Composition and Inheritance

> In an `inheritance` structure, the internal details of the parent class are visible to the subclass. Therefore, we can also say that code reuse through inheritance is a type of `white-box code reuse`. (If the implementation of the base class changes, the implementation of the derived class will also change accordingly. This leads to unpredictability in subclass behavior.)
> 
> `Composition` produces new, more complex functions by assembling (combining) existing objects. Because the internal details of each object are invisible to the others, we also say that this type of code reuse is `black-box code reuse`. (Because composition generally defines a type, it's impossible to know at compile time which specific implementation class's method will be called.)
> 
> `Inheritance` requires specifying which class to inherit from when writing code, so the relationship is determined at `compile time`. (The implementation inherited from the base class cannot be changed dynamically at runtime, thus reducing the flexibility of the application.)
> 
> `Composition` can adopt interface-oriented programming when writing code. Therefore, the composition relationship of classes is generally determined at `runtime`.

## Comparison of Advantages and Disadvantages

| Composition Relationship | Inheritance Relationship |
| -------------------------------- | -------------------------------------- |
| Advantage: Does not break encapsulation; loose coupling between the whole class and part classes; they are relatively independent. | Disadvantage: Breaks encapsulation; tight coupling between the subclass and the parent class; the subclass depends on the implementation of the parent class; the subclass lacks independence. |
| Advantage: Has good extensibility. | Disadvantage: Supports extension, but often at the cost of increasing the complexity of the system structure. |
| Advantage: Supports dynamic composition. At runtime, the whole object can choose different types of part objects. | Disadvantage: Does not support dynamic inheritance. At runtime, the subclass cannot choose a different parent class. |
| Advantage: The whole class can wrap the part class, encapsulate its interface, and provide a new interface. | Disadvantage: The subclass cannot change the interface of the parent class. |
| Disadvantage: The whole class cannot automatically obtain the same interface as the part class. | Advantage: The subclass can automatically inherit the interface of the parent class. |
| Disadvantage: When creating an object of the whole class, objects of all part classes need to be created. | Advantage: When creating an object of the subclass, there is no need to create an object of the parent class. |

## How to Choose

I believe many people know an important principle in object-oriented programming: "use composition more and inheritance less" or "composition is superior to inheritance." From the previous introduction and the comparison of advantages and disadvantages, it can be seen that composition is indeed more flexible than inheritance and more helpful for code maintenance.

Therefore,

> **`It is recommended to prioritize composition over inheritance whenever both are feasible.`**
> 
> **`Because composition is safer, simpler, more flexible, and more efficient.`**

Note that this doesn't mean inheritance is useless. What was said above is "whenever both are feasible." There are still some scenarios where inheritance is needed or more suitable.

> Inheritance should be used with caution, and its use is limited to situations where you are sure that the technology is effective. One way to judge is to ask yourself if you need to upcast from the new class to the base class. If it is necessary, then inheritance is necessary. Otherwise, you should carefully consider whether inheritance is needed. - "[Thinking in Java][5]"
> 
> Inheritance is appropriate only when the subclass is truly a subtype of the superclass. In other words, for two classes A and B, B should inherit from A only if an [`is-a`][1] relationship truly exists between them. - "[Effective Java][6]"

 [1]: https://en.wikipedia.org/wiki/Is-a
 [2]: http://www.hollischuang.com/wp-content/uploads/2016/03/Generalization.jpg
 [3]: https://en.wikipedia.org/wiki/Has-a
 [4]: http://www.hollischuang.com/wp-content/uploads/2016/03/Composition.jpg
 [5]: https://en.wikipedia.org/wiki/Thinking_in_Java
 [6]: https://en.wikipedia.org/wiki/Effective_Java
