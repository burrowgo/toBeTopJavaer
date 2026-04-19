---
title: "Abstract Factory Pattern"
---

## Concept

Abstract Factory Pattern: Provide an interface for creating families of related or dependent objects without specifying their concrete classes. The Abstract Factory pattern is also known as the Kit pattern and belongs to object creational patterns.

The Abstract Factory Pattern provides a way to encapsulate individual factories with a common product family. In normal use, the client program needs to create a concrete implementation of the abstract factory and then use the abstract factory as an interface to create concrete objects for this theme. The client program does not need to know (or care) about the specific types of objects it gets from these internal factory methods, because the client program only uses the general interface of these objects. The Abstract Factory Pattern separates the implementation details of a group of objects from their general use.

### Product Family

Let's understand what a product family is: a family consisting of functionally related products located in different product hierarchy structures. As in the following example, there are two product families: sports car family and business car family.

[<img src="http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160419-0.png" alt="QQ20160419-0" width="637" height="408" class="alignnone size-full wp-image-1421" />][5]

## Usage

The Abstract Factory Pattern, like the Factory Method Pattern, conforms to the Open-Closed Principle. However, the difference is that in the Factory Method Pattern, when adding a specific product, a corresponding factory must be added. But the Abstract Factory Pattern only needs to add a factory when adding a new type of specific product. That is to say, one factory in the Factory Method Pattern can only create one specific product. While one factory in the Abstract Factory Pattern can create multiple specific products belonging to a type of category. The number of products created by the factory is between the Simple Factory Pattern and the Factory Method Pattern.

The Abstract Factory Pattern can be used in the following situations:

> A system should not depend on the details of how product class instances are created, combined, and expressed. This is important for all types of factory patterns.
> 
> There is more than one product family in the system, and only one product family is used at a time.
> 
> Products belonging to the same product family will be used together, and this constraint must be reflected in the design of the system.
> 
> The system provides a library of product classes, and all products appear with the same interface, so that the client does not depend on the specific implementation.

## Implementation

The Abstract Factory Pattern includes the following roles:

> AbstractFactory: Used to declare methods for generating abstract products.
> 
> ConcreteFactory: Implements the methods declared by the abstract factory to generate abstract products, generating a set of concrete products that constitute a product family. Each product is located in a certain product hierarchy structure.
> 
> AbstractProduct: Declares interfaces for each product and defines abstract business methods of the products in the abstract product.
> 
> Product: Defines specific product objects produced by specific factories and implements the business methods defined in the abstract product interface.

The example in this article uses an example of a car OEM factory building cars. Suppose we are a car OEM manufacturer, and we are responsible for building cars for two companies, Mercedes-Benz and Tesla. We simply understand Mercedes-Benz cars as cars that need to be refueled and Tesla as cars that need to be charged. Among them, Mercedes-Benz cars include sports cars and business cars, and Tesla also includes sports cars and business cars.

[<img src="http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160419-1.png" alt="QQ20160419-1" width="657" height="554" class="alignnone size-full wp-image-1422" />][6]

In the above scenario, we can treat sports cars and business cars separately, with separate factories for sports cars and separate factories for business cars. Thus, in the future, no matter what other manufacturers build cars for, as long as it is a sports car or a business car, we don't need to introduce a factory. Similarly, if we want to add another type of car, such as an off-road vehicle, we don't need to make any modifications to sports cars or business cars.

Below are the abstract products, Mercedes-Benz cars and Tesla cars:

``` java
public interface BenzCar {
    
    // Refuel with gasoline
    public void gasUp();
    
}
    
public interface TeslaCar {
    
    // Charge
    public void charge();
}
```
    

Below are specific products: Mercedes-Benz sports car, Mercedes-Benz business car, Tesla sports car, Tesla business car:

``` java
public class BenzSportCar implements BenzCar {
    public void gasUp() {
        System.out.println("Fill my Mercedes-Benz sports car with the best gasoline");
    }
}
    
public class BenzBusinessCar implements BenzCar{
    public void gasUp() {
        System.out.println("Fill my Mercedes-Benz business car with common gasoline");
    }
}
    
public class TeslaSportCar implements TeslaCar {
    public void charge() {
        System.out.println("Charge my Tesla sports car fully");
    }
}
    
public class TeslaBusinessCar implements TeslaCar {
    public void charge() {
        System.out.println("Don't need to fully charge my Tesla business car");
    }
}
```
    

Below is the abstract factory:

``` java
public interface CarFactory {
    
    public BenzCar getBenzCar();
    public TeslaCar getTeslaCar();
}
```
    

Below are concrete factories:

``` java
public class SportCarFactory implements CarFactory {
    public BenzCar getBenzCar() {
        return new BenzSportCar();
    }
    
    public TeslaCar getTeslaCar() {
        return new TeslaSportCar();
    }
}
    
public class BusinessCarFactory implements CarFactory {
    public BenzCar getBenzCar() {
        return new BenzBusinessCar();
    }
    
    public TeslaCar getTeslaCar() {
        return new TeslaBusinessCar();
    }
}
```
    

## Tilt of "Open-Closed Principle"

The "Open-Closed Principle" requires the system to be open to expansion and closed to modification, achieving the purpose of enhancing its functions through expansion. For systems involving multiple product families and multiple product hierarchy structures, its function enhancement includes two aspects:

> Adding product families: For adding new product families, the Factory Method Pattern supports the "Open-Closed Principle" very well. For newly added product families, only a new concrete factory needs to be added correspondingly, without any modification to existing code.
> 
> Adding new product hierarchy structures: For adding new product hierarchy structures, all factory roles need to be modified, including abstract factory classes. In all factory classes, methods for producing new products need to be added, which cannot support the "Open-Closed Principle" well.

This nature of the Abstract Factory Pattern is called the tilt of the "Open-Closed Principle". The Abstract Factory Pattern supports adding new products in a tilted way. It provides convenience for adding new product families but cannot provide such convenience for adding new product hierarchy structures.

## Relationship Between Three Factory Patterns

When each concrete factory class in the Abstract Factory Pattern only creates one product object, that is, when there is only one product hierarchy structure, the Abstract Factory Pattern degenerates into the Factory Method Pattern.

The biggest difference between the Abstract Factory Pattern and the Factory Method Pattern is that the Factory Method Pattern targets one product hierarchy structure, while the Abstract Factory Pattern needs to face multiple product hierarchy structures.

When the abstract factory and concrete factory in the Factory Method Pattern merge to provide a unified factory to create product objects, and the factory method for creating objects is designed as a static method, the Factory Method Pattern degenerates into the Simple Factory Pattern.

## Summary

Abstract Factory Pattern: Provide an interface for creating families of related or dependent objects without specifying their concrete classes. The Abstract Factory pattern is also known as the Kit pattern and belongs to object creational patterns.

The Abstract Factory Pattern is the most abstract and general form of all forms of factory patterns.

The main advantage of the Abstract Factory Pattern is that it isolates the generation of concrete classes, so that customers do not need to know what is being created. Moreover, multiple objects in a product family can be created through concrete factory classes each time. It is convenient to add or replace product families, and it is very convenient to add new concrete factories and product families. The main disadvantage is that adding a new product hierarchy structure is very complex and requires modifying the abstract factory and all concrete factory classes, showing tilt in supporting the "Open-Closed Principle".

All code in the article can be found on [GitHub][7]

## References

["Dahua Design Patterns"][8]

["Head First Design Patterns"][9]

[Abstract Factory Pattern (Abstract Factory Pattern)][10]

 [1]: http://www.hollischuang.com/archives/category/%E7%BB%BC%E5%90%88%E5%BA%94%E7%94%A8/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F
 [2]: http://www.hollischuang.com/archives/1401
 [3]: http://www.hollischuang.com/archives/1408
 [4]: http://www.hollischuang.com/archives/1391
 [5]: http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160419-0.png
 [6]: http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160419-1.png
 [7]: https://github.com/hollischuang/DesignPattern
 [8]: http://s.click.taobao.com/t?e=m=2&s=R5B/xd29JVMcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67jN2wQzI0ZBVHBMajAjK1gBpS4hLH/P02ckKYNRBWOBBey11vvWwHXSniyi5vWXIZkKWZZq7zWpCC8X3k5aQlui0qVGgqDL2o8YMXU3NNCg/&pvid=10_42.120.73.203_224_1460382841310
 [9]: http://s.click.taobao.com/t?e=m%3D2%26s%3DObpq8Qxse2EcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67utJaEGcptl2kfkm8XrrgBtpS4hLH%2FP02ckKYNRBWOBBey11vvWwHXTpkOAWGyim%2Bw2PNKvM2u52N5aP5%2Bgx7zgh4LxdBQDQSXEqY%2Bakgpmw&pvid=10_121.0.29.199_322_1460465025379
 [10]: http://design-patterns.readthedocs.org/zh_CN/latest/creational_patterns/abstract_factory.html#id14