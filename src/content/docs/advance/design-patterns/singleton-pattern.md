---
title: "Singleton Pattern"
---

## Concept

The Singleton Pattern is one of the simplest design patterns in Java. This type of design pattern belongs to creational patterns. The definition given in the [GoF book][3] is: Ensure a class only has one instance, and provide a global point of access to it.

The Singleton pattern is generally reflected in the class declaration. The singleton class is responsible for creating its own objects, while ensuring that only a single object is created. This class provides a way to access its unique object, which can be accessed directly without instantiating objects of the class.

## Usage

The Singleton pattern has the following two advantages:

> There is only one instance in memory, reducing memory overhead, especially the frequent creation and destruction of instances (such as website home page cache).
> 
> Avoid multiple occupations of resources (such as file writing operations).

Sometimes, when we choose to use the Singleton pattern, we not only consider the advantages it brings, but also the possibility that some scenarios must be singleton. For example, a situation like "a party can only have one chairman".

## Implementation

We know that the production of an object of a class is completed by the class constructor. If a class provides a `public` constructor to the outside, then the outside can arbitrarily create objects of the class. Therefore, if you want to limit the production of objects, one way is to make the constructor private (at least protected), so that external classes cannot produce objects through references. At the same time, in order to ensure the availability of the class, it must provide an object of its own and a static method to access this object.

[<img src="http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160406-0.png" alt="QQ20160406-0" width="325" height="232" class="alignnone size-full wp-image-1388" />][4]

### Eager Initialization

The following is a simple implementation of a singleton:

 //code 1
```java
public class Singleton {
// Instantiate an instance inside the class
private static Singleton instance = new Singleton();
// Private constructor, inaccessible from outside
private Singleton() {
}
// Provide a static method to the outside to get the instance
public static Singleton getInstance() {
return instance;
}
}
```
 

Use the following code to test:

 //code2
```java
public class SingletonClient {
 
public static void main(String[] args) {
Singleton singleton1 = Singleton.getInstance();
Singleton singleton2 = Singleton.getInstance();
System.out.println(singleton1 == singleton2);
}
}
```
 

Output results:

 true
 

code 1 is a simple implementation of a singleton. This implementation method is called eager initialization (eager style). "Eager" is a vivid metaphor. For an eager person, he hopes that when he wants to use this instance, he can get it immediately without any waiting time. Therefore, through the `static` static initialization way, when the class is loaded for the first time, a `Singleton` instance is created. This ensures that when he wants to use the object for the first time, it has already been initialized.

At the same time, since the instance is created when the class is loaded, thread safety issues are also avoided. (Reasons can be found in: [Deep Analysis of Java's ClassLoader Mechanism (Source Level)][5], [Loading, Linking, and Initialization of Java Classes][6])

There is also a variation of the eager initialization:

 //code 3
```java
public class Singleton2 {
// Define inside the class
private static Singleton2 instance;
static {
// Instantiate the instance
instance = new Singleton2();
}
// Private constructor, inaccessible from outside
private Singleton2() {
}
// Provide a static method to the outside to get the instance
public static Singleton2 getInstance() {
return instance;
}
}
```
 

code 3 and code 1 are actually the same. They both instantiate an object when the class is loaded.

**In eager initialization, the object will be instantiated when the class is loaded. This may cause unnecessary consumption because this instance may not be used at all. Moreover, if this class is loaded multiple times, it will also cause multiple instantiations. In fact, there are many ways to solve this problem. Two solutions are provided below: the first is using a static inner class. The second is using lazy initialization.**

### Static Inner Class Style

First, look at solving the above problem through a static inner class:

 //code 4
```java
public class StaticInnerClassSingleton {
// Initialize the instance object in a static inner class
private static class SingletonHolder {
private static final StaticInnerClassSingleton INSTANCE = new StaticInnerClassSingleton();
}
// Private constructor
private StaticInnerClassSingleton() {
}
// Provide a static method to the outside to get the instance
public static final StaticInnerClassSingleton getInstance() {
return SingletonHolder.INSTANCE;
}
}
```
 

This way also utilizes the ClassLoader mechanism to ensure that there is only one thread when initializing `instance`. It is different from eager initialization (a very subtle difference): in eager initialization, as long as the `Singleton` class is loaded, `instance` will be instantiated (lazy loading effect is not achieved), while in this way, if the `Singleton` class is loaded, `instance` is not necessarily initialized. Because the `SingletonHolder` class is not actively used, the `SingletonHolder` class will only be loaded explicitly when the `getInstance` method is called, thereby instantiating `instance`. Imagine if instantiating `instance` consumes a lot of resources, I want it to be lazily loaded. On the other hand, I don't want to instantiate it when the `Singleton` class is loaded, because I can't ensure that the `Singleton` class might not be actively used and thus loaded elsewhere. At this time, instantiating `instance` is obviously inappropriate. In this case, this way is more reasonable than eager initialization.

### Lazy Initialization

Next, look at another singleton pattern that will be instantiated when the object is truly used - lazy initialization (lazy style).

 //code 5
```java
public class Singleton {
// Define instance
private static Singleton instance;
// Private constructor
private Singleton(){}
// Provide a static method to the outside to get the instance
public static Singleton getInstance() {
// Instantiate only when the object is used
if (instance == null) {
instance = new Singleton();
}
return instance;
}
}
```
 

The singleton above is called lazy initialization. "Lazy" means that the instance will not be created in advance, and the instantiation of the class by itself is delayed until the first time it is referenced. The role of the `getInstance` method is to hope that the object is created when it is first used.

Have you found that code 5, the lazy initialization, actually has a problem, which is the thread safety problem. In a multi-threaded situation, two threads may enter the `if` statement at the same time. Thus, when both threads exit from the `if`, two different objects are created. (Multi-threaded knowledge is not detailed here).

### Thread-Safe Lazy Initialization

For thread-unsafe lazy initialization, the solution is simple: add a lock to the steps of creating objects:

 //code 6
```java
public class SynchronizedSingleton {
// Define instance
private static SynchronizedSingleton instance;
// Private constructor
private SynchronizedSingleton(){}
// Provide a static method to the outside to get the instance, lock this method
public static synchronized SynchronizedSingleton getInstance() {
// Instantiate only when the object is used
if (instance == null) {
instance = new SynchronizedSingleton();
}
return instance;
}
}
```
 

This way of writing can work well in multi-threading, and it seems to have good lazy loading. However, unfortunately, its efficiency is very low because in 99% of cases, synchronization is not needed. (Because the lock range of the `synchronized` above is the entire method, all operations of the method are carried out synchronously. However, for the case of non-first creation of objects, that is, the case of not entering the `if` statement, synchronization operations are not needed at all, and `instance` can be returned directly.)

### Double-Checked Locking

For the problem in code 6, students who know concurrent programming know how to solve it. In fact, the problem in the code above is mainly that the scope of the lock is too large. Just narrow the scope of the lock. So how to narrow the scope of the lock? Compared with synchronous methods, synchronous blocks have a smaller lock range. code 6 can be transformed into:

 //code 7
```java
public class Singleton {
```
 
 private static Singleton singleton;
 
 private Singleton() {
 }
 
 public static Singleton getSingleton() {
 if (singleton == null) {
 synchronized (Singleton.class) {
 if (singleton == null) {
 singleton = new Singleton();
 }
 }
 }
 return singleton;
 }
 }
 

code 7 is an improved way of writing code 6, which reduces the scope of the lock by using a synchronous block. This can greatly improve efficiency. (For cases where `singleton` already exists, no synchronization is needed, just return).

But are things really that easy? The code above seems to have no problem. It implements lazy initialization, solves the synchronization problem, and reduces the scope of the lock, improving efficiency. However, there are still hidden dangers in this code. The cause of the hidden dangers is mainly related to the [Java Memory Model (JMM)][7]. Consider the following sequence of events:

> Thread A finds that the variable has not been initialized, then it acquires the lock and starts the initialization of the variable.
> 
> Due to the semantics of some programming languages, the code generated by the compiler allows updating the variable and pointing it to a partially initialized object before Thread A finishes the initialization of the variable.
> 
> Thread B finds that the shared variable has been initialized and returns the variable. Since Thread B is convinced that the variable has been initialized, it does not acquire the lock. If the shared variable is visible to B before A completes initialization (this is because A has not completed initialization or because some initialized values have not yet passed through the memory (cache consistency) used by B), the program is likely to crash.

(Students who cannot understand the example above, please catch up on Java memory model knowledge)

In [J2SE 1.4][8] or earlier versions, using double-checked locking has potential dangers, and sometimes it will work normally (it is difficult to distinguish between correct implementation and slightly problematic implementation. Depending on the compiler, thread scheduling, and other concurrent system activities, the abnormal results caused by incorrect implementation of double-checked locking may appear intermittently. Reproducing anomalies is very difficult.) In [J2SE 5.0][8], this problem was corrected. The [volatile][9] keyword ensures that multiple threads can correctly handle singleton instances.

So, for code 7, there can be two alternative schemes, code 8 and code 9:

Using `volatile`

 //code 8
```java
public class VolatileSingleton {
private static volatile VolatileSingleton singleton;
```
 
 private VolatileSingleton() {
 }
 
 public static VolatileSingleton getSingleton() {
 if (singleton == null) {
 synchronized (VolatileSingleton.class) {
 if (singleton == null) {
 singleton = new VolatileSingleton();
 }
 }
 }
 return singleton;
 }
 }
 

**The double-checked locking method above is widely used, and it solves all the problems mentioned before.** However, even this seemingly perfect way may have problems, that is, when encountering serialization. Details will be introduced later.

Using `final`

 //code 9
 class FinalWrapper<T> {
 public final T value;
 
 public FinalWrapper(T value) {
 this.value = value;
 }
 }
 
```java
public class FinalSingleton {
private FinalWrapper<FinalSingleton> helperWrapper = null;
```
 
 public FinalSingleton getHelper() {
 FinalWrapper<FinalSingleton> wrapper = helperWrapper;
 
 if (wrapper == null) {
 synchronized (this) {
 if (helperWrapper == null) {
 helperWrapper = new FinalWrapper<FinalSingleton>(new FinalSingleton());
 }
 wrapper = helperWrapper;
 }
 }
 return wrapper.value;
 }
 }
 

### Enumeration style

Before 1.5, there were generally only the above methods to implement singleton. After 1.5, there is another way to implement singleton, which is to use enumeration:

 // code 10
 public enum Singleton {
 
 INSTANCE;
 Singleton() {
 }
 }
 

This way is the way advocated by [Effective Java][10] author `Josh Bloch`. It can not only avoid multi-thread synchronization problems, but also prevent deserialization from re-creating new objects (introduced below). It can be said to be a very strong barrier. Deep Analysis of Java Enumeration Types - Enum's Thread Safety and Serialization Issues has a detailed introduction to enumeration thread safety and serialization issues. However, personally, I think that since the `enum` feature was only added in 1.5, writing in this way inevitably feels unfamiliar. In practical work, I have also rarely seen anyone write like this, but it doesn't mean it's not good.

## Singleton and Serialization

In the article [Singleton and Serialization][11], [Hollis][12] analyzed the relationship between singleton and serialization - serialization can destroy singletons. To prevent the destruction of singletons by serialization, just define `readResolve` in the `Singleton` class to solve the problem:

 //code 11
```java
package com.hollis;
import java.io.Serializable;
/**
* Created by hollis on 16/2/5.
* Implementing singleton using double-checked locking
*/
public class Singleton implements Serializable{
private volatile static Singleton singleton;
private Singleton (){}
public static Singleton getSingleton() {
if (singleton == null) {
synchronized (Singleton.class) {
if (singleton == null) {
singleton = new Singleton();
}
}
}
return singleton;
}
```
 
 private Object readResolve() {
 return singleton;
 }
 }
 

## Summary

This article introduces several methods to implement singleton, mainly including eager initialization, lazy initialization, using static inner classes, double-checked locking, enumeration, etc. It also introduces how to prevent serialization from destroying the singleton of the class.

From the implementation of the singleton, we can find that a simple Singleton Pattern can involve so much knowledge. In the process of continuous improvement, you can understand and apply more knowledge. As the saying goes, learning has no end.

**All code in the article can be found on [GitHub][13]**

## References

[Seven Ways to Write Singleton Pattern][14]

[Double-Checked Locking Pattern][15]

["Head First Design Patterns"][16]

[Singleton Pattern][17]

 [1]: http://www.hollischuang.com/archives/category/%E7%BB%BC%E5%90%88%E5%BA%94%E7%94%A8/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F
 [2]: http://www.hollischuang.com/archives/1368
 [3]: http://s.click.taobao.com/t?e=m%3D2%26s%3DT5l23XuxzMIcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67sqCcISrC8hOF%2FSaKyaJTUZpS4hLH%2FP02ckKYNRBWOBBey11vvWwHXSniyi5vWXIZhtlrJbLMDAQihpQCXu2JnMU7C4KV%2Fo0CcYMXU3NNCg%2F&pvid=10_42.120.73.203_2589754_1459955095482
 [4]: http://www.hollischuang.com/wp-content/uploads/2016/04/QQ20160406-0.png
 [5]: http://www.hollischuang.com/archives/197
 [6]: http://www.hollischuang.com/archives/201
 [7]: http://www.hollischuang.com/archives/1003
 [8]: https://zh.wikipedia.org/wiki/Java_SE
 [9]: https://zh.wikipedia.org/wiki/Volatile%E5%8F%98%E9%87%8F
 [10]: http://s.click.taobao.com/t?e=m=2&s=ix/dAcrx42AcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67vbkYfk%2bHavVTHm2guh0YLtpS4hLH/P02ckKYNRBWOBBey11vvWwHXSniyi5vWXIZtVr9sOV2MxmP1RxEmSieVPs8Gq%2bZDw%2bWcYMXU3NNCg/&pvid=10_42.120.73.203_425_1459957079215
 [11]: http://www.hollischuang.com/archives/1144
 [12]: http://www.hollischuang.com
 [13]: https://github.com/hollischuang/DesignPattern
 [14]: http://www.hollischuang.com/archives/205
 [15]: https://zh.wikipedia.org/wiki/%E5%8F%8C%E9%87%8D%E6%A3%80%E6%9F%A5%E9%94%81%E5%AE%9A%E6%A8%A1%E5%BC%8F
 [16]: http://s.click.taobao.com/t?e=m%3D2%26s%3Detkt7EP2O5scQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67nWAf3rZA5A%2FrumJQoe%2FxcNpS4hLH%2FP02ckKYNRBWOBBey11vvWwHXTpkOAWGyim%2Bw2PNKvM2u52N5aP5%2Bgx7zgh4LxdBQDQSXEqY%2Bakgpmw&pvid=10_42.120.73.203_1238_1459955035603
 [17]: http://www.runoob.com/design-pattern/singleton-pattern.html