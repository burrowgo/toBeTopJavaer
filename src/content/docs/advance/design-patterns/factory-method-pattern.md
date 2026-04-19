---
title: "Factory Method Pattern"
---

## Concept

The Factory Method Pattern is also known as the Factory Pattern, Virtual Constructor Pattern, or Polymorphic Factory Pattern. It belongs to the class creational patterns.

The Factory Method Pattern is an object-oriented design pattern that implements the "factory" concept. Like other creational patterns, it addresses the problem of creating objects without specifying their exact type.

> The essence of the Factory Method Pattern is to "define an interface for creating an object, but let the classes that implement this interface decide which class to instantiate. The Factory Method allows the instantiation of a class to be deferred to its subclasses."

## Purpose

Although both the Factory Method Pattern and the [Simple Factory Pattern][2] create objects through a factory, the biggest difference between them is that the **Factory Method Pattern perfectly complies with the "[Open-Closed Principle][3]" in its design.**

The Factory Method Pattern can be used in the following situations:

> A class does not know the class of the object it needs: In the Factory Method Pattern, the client does not need to know the class name of the specific product; it only needs to know the corresponding factory. The specific product object is created by the specific factory class. The client needs to know the factory class that creates the specific product.
> 
> A class specifies which object to create through its subclasses: In the Factory Method Pattern, for the abstract factory class, it only needs to provide an interface for creating products, while its subclasses determine the specific object to be created. Utilizing object-oriented polymorphism and the [Liskov Substitution Principle][3], at runtime, the subclass object will replace the parent object, making the system easier to extend.
> 
> The task of creating objects is delegated to one of multiple factory subclasses. When using it, the client does not need to care which factory subclass creates the product subclass. It can be specified dynamically when needed, and the class name of the specific factory class can be stored in a configuration file or database.

## Implementation

The Factory Method Pattern includes the following roles:

> Product: Abstract product (`Operation`)
> 
> ConcreteProduct: Specific product (`OperationAdd`)
> 
> Factory: Abstract factory (`IFactory`)
> 
> ConcreteFactory: Specific factory (`AddFactory`)

[<img src="http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160412-0.png" alt="QQ20160412-0" width="798" height="518" class="alignnone size-full wp-image-1402" />][4]

Here, the calculator example is used again. While keeping the methods like `Operation`, `OperationAdd`, `OperationDiv`, `OperationSub`, `OperationMul` unchanged, modify the factory class in the simple factory pattern (`OperationFactory`). Instead of the original "all-powerful" large factory class, the factory method is used here:

``` java
// Factory interface
public interface IFactory {
    Operation CreateOption();
}
    
// Addition factory
public class AddFactory implements IFactory {
    
    public Operation CreateOption() {
        return new OperationAdd();
    }
}
    
// Division factory
public class DivFactory implements IFactory {
    
    public Operation CreateOption() {
        return new OperationDiv();
    }
}
    
// Multiplication factory
public class MulFactory implements IFactory {
    
    public Operation CreateOption() {
        return new OperationMul();
    }
}
    
// Subtraction factory
public class SubFactory implements IFactory {
    
    public Operation CreateOption() {
        return new OperationSub();
    }
}
```
    

Thus, when the client wants to perform an addition operation, it uses the following way:

``` java
public class Main {
    
    public static void main(String[] args) {
        IFactory factory = new AddFactory();
        Operation operationAdd =  factory.CreateOption();
        operationAdd.setValue1(10);
        operationAdd.setValue2(5);
        System.out.println(operationAdd.getResult());
    }
}
```
    

At this point, a Factory Method Pattern has been written.

* * *

From the perspective of code volume, the Factory Method Pattern is more complex than the Simple Factory Pattern. There is a corresponding factory for each different Operation class. Many people may have the following questions:

> Does the Factory Method Pattern seem much more complex than the Simple Factory Pattern?
> 
> Is there any difference between the Factory Method Pattern and creating objects by myself? Why bother creating more factories?

Let's dive into these two questions to better understand the Factory Method Pattern.

## Pros and Cons of Factory Method Pattern

### Why use a factory to create objects?

> Encapsulate the object creation process

In the Factory Method Pattern, the factory method is used to create the products needed by the customer, while **hiding the details of which specific product class will be instantiated. The user only needs to care about the factory corresponding to the desired product, without worrying about the creation details, or even knowing the class name of the specific product.**

Polymorphic design based on factory and product roles is key to the Factory Method Pattern. **It enables the factory to independently determine which product object to create, while the details of how to create this object are completely encapsulated within the specific factory.** The Factory Method Pattern is also called the Polymorphic Factory Pattern because all specific factory classes have the same abstract parent class.

### Why have a separate factory for each type of object?

> Complies with the "[Open-Closed Principle][5]"

The main purpose is decoupling. When adding a new product to the system, there is no need to modify the interfaces provided by the abstract factory and abstract product, no need to modify the client, and no need to modify other specific factories and specific products. You only need to add a specific factory and a specific product. In this way, the system's scalability becomes very good, fully complying with the "[Open-Closed Principle][3]".

These are the advantages of the Factory Method Pattern. However, there are also some drawbacks:

> When adding a new product, a new specific product class must be written along with its corresponding specific factory class. The number of classes in the system will increase in pairs, increasing the system's complexity to some extent. More classes need to be compiled and run, bringing some extra overhead to the system.
> 
> Due to the consideration of system scalability, an abstraction layer needs to be introduced, and the abstraction layer is used for definition in the client code, increasing the system's abstraction and difficulty in understanding. Technologies like DOM and reflection may be needed during implementation, increasing the difficulty of implementation.

## Difference Between Factory Method and Simple Factory

The Factory Method Pattern overcomes the disadvantage of the Simple Factory Pattern violating the [Open-Closed Principle][3], while maintaining the advantage of encapsulating the object creation process.

Both centrally encapsulate object creation, making it possible to replace objects without major changes, reducing the coupling between the client and the product object.

## Summary

The Factory Method Pattern is a further abstraction and promotion of the Simple Factory Pattern.

Due to the use of object-oriented polymorphism, the Factory Method Pattern maintains the advantages of the Simple Factory Pattern and overcomes its disadvantages.

In the Factory Method Pattern, the core factory class is no longer responsible for creating all products, but leaves the specific creation work to subclasses. This core class is only responsible for providing the interface that specific factories must implement, and is not responsible for the details of product class instantiation. This allows the Factory Method Pattern to allow the system to introduce new products without modifying the factory roles.

The main advantage of the Factory Method Pattern is that there is no need to modify the existing system when adding new product classes, and the creation details of product objects are encapsulated. The system has good flexibility and scalability. Its disadvantage is that adding a new product requires adding a new factory, leading to a pair-wise increase in the number of classes, increasing the system's complexity to some extent.

All code in this article can be found on [GitHub][6].

## References

[Big Talk Design Patterns][7]

[Head First Design Patterns][8]

[Factory Method Pattern][9]

 [1]: http://www.hollischuang.com/archives/category/%E7%BB%BC%E5%90%88%E5%BA%94%E7%94%A8/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F
 [2]: http://www.hollischuang.com/archives/1391
 [3]: http://www.hollischuang.com/archives/220
 [4]: http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160412-0.png
 [5]: http://www.hollischuang.com/archives/220http://
 [6]: https://github.com/hollischuang/DesignPattern
 [7]: http://s.click.taobao.com/t?e=m=2&s=R5B/xd29JVMcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67jN2wQzI0ZBVHBMajAjK1gBpS4hLH/P02ckKYNRBWOBBey11vvWwHXSniyi5vWXIZkKWZZq7zWpCC8X3k5aQlui0qVGgqDL2o8YMXU3NNCg/&pvid=10_42.120.73.203_224_1460382841310
 [8]: http://s.click.taobao.com/t?e=m%3D2%26s%3DObpq8Qxse2EcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67utJaEGcptl2kfkm8XrrgBtpS4hLH%2FP02ckKYNRBWOBBey11vvWwHXTpkOAWGyim%2Bw2PNKvM2u52N5aP5%2Bgx7zgh4LxdBQDQSXEqY%2Bakgpmw&pvid=10_121.0.29.199_322_1460465025379
 [9]: http://design-patterns.readthedocs.org/zh_CN/latest/creational_patterns/factory_method.html#id11