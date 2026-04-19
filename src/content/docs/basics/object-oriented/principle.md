---
title: "Principle"
---

The greatest benefit of the object-oriented development paradigm is that it is easy to use, easy to extend, and easy to maintain. But what kind of code is easy to use, easy to extend, and easy to maintain? How to measure them?

Robert C. Martin proposed the SOLID principles in the early 21st century, which is a combination of the abbreviations of five principles. These five principles are still in use today.

### Single Responsibility Principle (SRP)

Its core idea is: a class should ideally do only one thing and have only one reason to change.

The Single Responsibility Principle can be seen as an extension of low coupling and high cohesion in object-oriented principles. Defining responsibility as a reason for change aims to improve cohesion to reduce the reasons for change. The more responsibilities there are, the more reasons there might be for change, which will lead to responsibility dependency and mutual influence, thereby greatly damaging its cohesion and coupling. Single responsibility in the usual sense means having only one single function. Do not implement too many functional points for a class to ensure that the entity has only one reason for its change.
Focus is an excellent quality of a person; similarly, singularity is an excellent design for a class. Intertwined responsibilities will make the code look particularly awkward, where a slight move in one part may affect the whole situation, lacking beauty and inevitably leading to ugly system error risks.


### Open-Closed Principle (OCP)

Its core idea is: software entities should be open for extension but closed for modification. That is, open to extension and closed to modification.

The Open-Closed Principle is mainly reflected in two aspects:

1. Open to extension means that when there are new requirements or changes, the existing code can be extended to adapt to the new situation.

2. Closed to modification means that once a class design is completed, it can complete its work independently without any attempt to modify it.

The core idea for implementing the Open-Closed Principle is to program to abstractions rather than to concrete implementations, because abstractions are relatively stable. Making a class depend on a fixed abstraction means that modification is closed; while through the object-oriented inheritance and polymorphism mechanisms, the inheritance of an abstract class can be realized, and inherent behaviors can be changed by overriding its methods to implement new extension methods, which is thus open.
"Requirements always change" - there is no unchanging software, so the open-closed principle is needed to close changes to meet requirements while keeping the internal encapsulation system of the software stable, unaffected by changes in requirements.


### Liskov Substitution Principle (LSP)

Its core idea is: subclasses must be able to replace their base classes. This idea is reflected as a constraint specification for the inheritance mechanism. Only when a subclass can replace the base class can it be ensured that the system recognizes the subclass during runtime. This is the basis for ensuring inheritance reuse.

In the specific behaviors of the parent class and the subclass, the relationship and characteristics in the inheritance hierarchy must be strictly grasped. Replacing the base class with a subclass will not cause any change in the program's behavior. At the same time, this constraint is not established in reverse: a subclass can replace the base class, but the base class cannot necessarily replace the subclass.
The Liskov Substitution Principle mainly focuses on abstraction and polymorphism being built on inheritance. Therefore, only by following the Liskov substitution principle can it be ensured that inheritance reuse is reliable. The implementation method is programming to interfaces: abstracting the common parts into a base class interface or abstract class. Through "Extract Abstract Class", new ways to support the same responsibility are implemented in subclasses by overriding parent class methods.

The Liskov Substitution Principle is a design principle about inheritance mechanisms. Violating the Liskov substitution principle will inevitably lead to a violation of the Open-Closed Principle.

The Liskov Substitution Principle can ensure that the system has good extensibility. At the same time, implementing an abstraction mechanism based on polymorphism can reduce code redundancy and avoid type discrimination during runtime.


### Dependency Inversion Principle (DIP)

Its core idea is: depend on abstractions. Specifically, high-level modules should not depend on low-level modules; both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

We know that dependency will definitely exist between classes and between modules. When there is a tight coupling relationship between two modules, the best way is to separate the interface from the implementation: define an abstract interface between the dependencies so that the high-level module calls the interface while the low-level module implements the definition of the interface, thereby effectively controlling the coupling relationship and achieving the design goal of depending on abstractions.
The stability of the abstraction determines the stability of the system because abstractions are unchanging. Depending on abstractions is the essence of object-oriented design and also the core of the Dependency Inversion Principle.

Depending on abstractions is a general principle, while in some cases, depending on details is unavoidable. A trade-off between abstraction and concrete implementation must be weighed. The method is not invariant. Depending on abstractions means programming to interfaces, not to implementations.


### Interface Segregation Principle (ISP)

Its core idea is: use multiple small specialized interfaces rather than one large general interface.

Specifically, the Interface Segregation Principle is reflected in: interfaces should be cohesive, and "fat" interfaces should be avoided. A class's dependency on another class should be established on the smallest interface. Do not force dependency on unused methods; this is a kind of interface pollution.

Interfaces effectively isolate details and abstractions, reflecting all the benefits of programming to abstractions. Interface segregation emphasizes the singularity of interfaces. Fat interfaces have obvious drawbacks, leading to implementation types having to fully implement all methods and attributes of the interface; while sometimes, the implementation type doesn't need all interface definitions. In design, this is "waste", and in implementation, it will bring potential problems. Modifying a fat interface will lead to a series of client programs needing to be modified, which is sometimes a disaster. In this case, decomposing a fat interface into multiple specific customized methods makes the client depend only on the methods they actually call, thereby relieving the client from depending on methods they don't use.
The means of separation mainly include the following two:

1. Delegation separation: By adding a new type to delegate customer requests, isolate the direct dependency between the customer and the interface, but this will increase the system's overhead.

2. Multiple inheritance separation: Realize customer requirements through interface multiple inheritance. This way is better.

The above are 5 basic object-oriented design principles. They are like golden rules in object-oriented program design. Following them can make our code more vivid, easy to reuse, easy to extend, flexible, and elegant.

Different design patterns correspond to different requirements, while design principles represent the eternal soul, which needs to be followed at all times in practice. As Arthur J. Riel said in "Object-Oriented Design Heuristics": "You don't have to strictly follow these principles, and violating them will not be punished by religious penalties. But you should treat these principles as alarm bells. If one of them is violated, then the alarm bell will ring."

Many people might not be able to deeply understand these principles at the beginning, but it doesn't matter. As your development experience grows, you will gradually be able to understand these principles.
