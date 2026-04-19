---
title: "Adapter Pattern"
---

## Concept

GoF defines the Adapter pattern as follows: Convert the interface of a class into another interface that users need. The Adapter pattern allows those classes that could not work together because of incompatible interfaces to work together.

GoF divides the Adapter pattern into class adapter pattern and object adapter pattern. The difference only lies in whether the adapter role's adaptation to the adaptee role is achieved through inheritance or composition. Since multiple inheritance is not supported in Java, and there is a suspicion of damaging encapsulation. And we also advocate [favoring composition over inheritance][2]. So this article mainly introduces the object adapter.

## Usage

I believe everyone has this common sense in life: the models of electronic device chargers we are currently using are different. Currently, the mainstream mobile phone charger ports mainly include Mini USB, Micro USB, and Lightning. Among them, Mini USB is widely seen on card readers, MP3s, digital cameras, and mobile hard drives. Since Micro USB is thinner than Mini USB, it is widely used in mobile phones, commonly seen in Android phones. Another common charger port is the Lightning port commonly used in Apple phones.

Of course, specific models of mobile phones can only use specific models of chargers to charge. For example, iPhone 6 mobile phones can only use Lightning interface chargers to charge. However, if we only have an Android Micro USB charger cable around us, can we charge an Apple phone? The answer is yes, as long as there is an adapter.

<img src="http://www.hollischuang.com/wp-content/uploads/2016/05/adapter-300x300.jpg" alt="adapter" width="300" height="300" class="aligncenter size-medium wp-image-1501" />

Adapters are everywhere in our daily lives. The Adapter pattern precisely solves similar problems.

We may also encounter similar scenarios during the program design process:

> 1. The system needs to use existing classes, and the interfaces of these classes do not meet the needs of the system.
> 
> 2. You want to create a reusable class to work with some classes that don't have much connection with each other, including some classes that may be introduced in the future. These source classes do not necessarily have a consistent interface.
> 
> 3. Through interface conversion, insert one class into another class series. (For example, tigers and birds, now there is a flying tiger. Without adding the demand of entities, add an adapter, which includes a tiger object inside and implements the flying interface.)

The above scenarios are all suitable for using the Adapter pattern.

## Implementation

The Adapter pattern includes the following roles:

> Target: Target abstract class
> 
> Adapter: Adapter class
> 
> Adaptee: Adaptee class
> 
> Client: Client class

<img src="http://www.hollischuang.com/wp-content/uploads/2016/05/Adapter-pattern.jpg" alt="Adapter-pattern" width="724" height="313" class="aligncenter size-full wp-image-1520" />

Here we use the example of the mobile phone charging port introduced at the beginning of the article. We define an adapter whose function is to use an Android charger to charge an Apple device.

First define the interfaces:

``` java
/**
 * MicroUsb charger interface
 */
public interface MicroUsbInterface {
    public void chargeWithMicroUsb();
}
    
/**
 * Lightning charger interface
 */
public interface LightningInterface {
    public void chargeWithLightning();
}
```
    

Define specific implementation classes:

``` java
/**
 * Android device charger
 */
public class AndroidCharger implements MicroUsbInterface {
    @Override
    public void chargeWithMicroUsb() {
        System.out.println("Charging with MicroUsb model charger...");
    }
}
    
/**
 * Apple device charger
 */
public class AppleCharger implements LightningInterface {
    @Override
    public void chargeWithLightning() {
        System.out.println("Charging with Lightning model charger...");
    }
}
```
    

> Because we want to use the Adapter pattern to convert MicroUsb to Lightning, the AppleCharger here is originally unnecessary to define. Because our purpose of using the adapter is to replace creating a new one. It is defined here to make the example more complete.

Define two mobile phones:

``` java
public class Iphone6Plus {
    
    private LightningInterface lightningInterface;
    
    public Iphone6Plus() {
    }
    
    public Iphone6Plus(LightningInterface lightningInterface) {
        this.lightningInterface = lightningInterface;
    }
    
    public void charge() {
        System.out.println("Start charging my Iphone6Plus mobile phone...");
        lightningInterface.chargeWithLightning();
        System.out.println("Finish charging my Iphone6Plus mobile phone...");
    }
    
    public LightningInterface getLightningInterface() {
        return lightningInterface;
    }
    
    public void setLightningInterface(LightningInterface lightningInterface) {
        this.lightningInterface = lightningInterface;
    }
}
    
public class GalaxyS7 {
    
    private MicroUsbInterface microUsbInterface;
    
    public GalaxyS7() {
    }
    
    public GalaxyS7(MicroUsbInterface microUsbInterface) {
        this.microUsbInterface = microUsbInterface;
    }
    
    public void charge(){
        System.out.println("Start charging my GalaxyS7 mobile phone...");
        microUsbInterface.chargeWithMicroUsb();
        System.out.println("Finish charging my GalaxyS7 mobile phone...");
    }
    
    public MicroUsbInterface getMicroUsbInterface() {
        return microUsbInterface;
    }
    
    public void setMicroUsbInterface(MicroUsbInterface microUsbInterface) {
        this.microUsbInterface = microUsbInterface;
    }
}
```
    

The role of defining mobile phones here is to understand the Adapter pattern more conveniently. It does not play any role in this pattern.

Define the adapter:

``` java
/**
 * Adapter, converting MicroUsb interface to Lightning interface
 */
public class Adapter implements LightningInterface {
    private MicroUsbInterface microUsbInterface;
    
    public Adapter() {
    }
    
    public Adapter(MicroUsbInterface microUsbInterface) {
        this.microUsbInterface = microUsbInterface;
    }
    
    @Override
    public void chargeWithLightning() {
        microUsbInterface.chargeWithMicroUsb();
    }
    
    public MicroUsbInterface getMicroUsbInterface() {
        return microUsbInterface;
    }
    
    public void setMicroUsbInterface(MicroUsbInterface microUsbInterface) {
        this.microUsbInterface = microUsbInterface;
    }
}
```
    

The function of this adapter is to convert a MicroUsb to Lightning. The implementation way is to implement the interface of the target class (`LightningInterface`), and then use the composition way to define microUsb in this adapter. Then in the overridden `chargeWithLightning()` method, use the method of microUsb to implement specific details.

Define the client:

``` java
public class Main {
    
    public static void main(String[] args) {
        Iphone6Plus iphone6Plus = new Iphone6Plus(new AppleCharger());
        iphone6Plus.charge();
    
        System.out.println("==============================");
    
        GalaxyS7 galaxyS7 = new GalaxyS7(new AndroidCharger());
        galaxyS7.charge();
    
        System.out.println("==============================");
    
        Adapter adapter  = new Adapter(new AndroidCharger());
        Iphone6Plus newIphone = new Iphone6Plus();
        newIphone.setLightningInterface(adapter);
        newIphone.charge();
    }
}
```
    

Output results:

``` 
Start charging my Iphone6Plus mobile phone...
Charging with Lightning model charger...
Finish charging my Iphone6Plus mobile phone...
==============================
Start charging my GalaxyS7 mobile phone...
Charging with MicroUsb model charger...
Finish charging my GalaxyS7 mobile phone...
==============================
Start charging my Iphone6Plus mobile phone...
Charging with MicroUsb model charger...
Finish charging my Iphone6Plus mobile phone...
```
    

The above example uses an adapter to use a MicroUsb model charger to charge an iPhone. From the code level, it reuses the MicroUsb interface and its implementation class through the adapter. To a large extent, existing code is reused.

## Advantages and Disadvantages

### Advantages

Decouple the target class and the adaptee class, and reuse the existing adaptee class by introducing an adapter class without modifying the original code.

Increase the transparency and reusability of classes. Encapulate the specific implementation in the adaptee class, which is transparent to the client class, and improve the reusability of the adaptee.

Both flexibility and extensibility are very good. By using configuration files, adapters can be easily replaced, and new adapter classes can be added without modifying the original code, which fully conforms to the "Open-Closed Principle".

### Disadvantages

Overuse of adapters will make the system very messy and difficult to grasp as a whole. For example, obviously seeing that the A interface is called, but actually the interior is adapted to the implementation of the B interface. If a system has too many such cases, it is no different from a disaster. Therefore, if it is not very necessary, you can not use an adapter, but directly reconstruct the system.

For class adapters, since JAVA can at most inherit one class, at most one adaptee class can be adapted, and the target class must be an abstract class.

## Summary

Structural patterns describe how to combine classes or objects together to form larger structures.

The Adapter pattern is used to convert one interface into another interface that the customer wants. The Adapter pattern allows those classes with incompatible interfaces to work together. Its alias is Wrapper. The Adapter pattern can serve as both a class structural pattern and an object structural pattern.

The Adapter pattern includes four roles:

> The target abstract class defines the specific domain interface that the customer wants to use;
> 
> The adapter class can call another interface as a converter to adapt the adaptee and the abstract target class. It is the core of the Adapter pattern;
> 
> The adaptee class is the role being adapted. It defines an existing interface that needs to be adapted;
> 
> In the client class, program against the target abstract class and call the business methods defined in the target abstract class.

In the object adapter pattern, the adapter class inherits the target abstract class (or implements the interface) and defines an object instance of the adaptee class. In the inherited target abstract class method, the corresponding business method of the adaptee class is called.

The main advantage of the Adapter pattern is to decouple the target class and the adaptee class, increase the transparency and reusability of classes, and at the same time, the flexibility and extensibility of the system are very good. It is very convenient to replace the adapter or add a new adapter, which conforms to the "[Open-Closed Principle][3]". The disadvantage of the class adapter pattern is that the adapter class cannot adapt multiple adaptee classes at the same time in many programming languages. The disadvantage of the object adapter pattern is that it is difficult to replace the methods of the adaptee class.

Applicable situations of the Adapter pattern include: the system needs to use existing classes, and the interfaces of these classes do not meet the needs of the system; you want to create a reusable class to work with some classes that don't have much connection with each other.

## References

[Adapter Pattern][4]

[Adapter Pattern][5]

All code in the article can be found on [GitHub][6]

 [1]: http://www.hollischuang.com/archives/category/%E7%BB%BC%E5%90%88%E5%BA%94%E7%94%A8/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F
 [2]: http://www.hollischuang.com/archives/1319
 [3]: http://www.hollischuang.com/archives/220
 [4]: http://www.runoob.com/design-pattern/adapter-pattern.html
 [5]: http://design-patterns.readthedocs.io/zh_CN/latest/structural_patterns/adapter.html
 [6]: https://github.com/hollischuang/DesignPattern