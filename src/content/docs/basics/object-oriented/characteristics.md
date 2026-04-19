---
title: "Characteristics"
---

We say that the object-oriented development paradigm is actually an understanding and abstraction method of the real world. So, specifically, how to abstract the real world into code? This requires applying the three major characteristics of object-oriented: encapsulation, inheritance, and polymorphism.

### Encapsulation

The so-called encapsulation is to encapsulate objective things into abstract classes, and a class can let only trusted classes or objects operate its own data and methods, hiding information from untrusted ones.

Simply put, a class is a logical entity that encapsulates data and the code that operates on that data. Inside an object, certain code or data can be private and cannot be accessed from the outside. In this way, the object provides different levels of protection for internal data to prevent accidental changes or erroneous use of the private part of the object by irrelevant parts of the program.

#### Encapsulation Example

For example, if we want to define a rectangle, first define a Rectangle class and put some necessary data into it through encapsulation.

 /**
 * Rectangle
 */
 class Rectangle {
 
 /**
 * Set the length and width of the rectangle
 */
 public Rectangle(int length, int width) {
 this.length = length;
 this.width = width;
 }
 
 /**
 * Length
 */
```java
private int length;
```
 
 /**
 * Width
 */
```java
private int width;
```
 
 /**
 * Get rectangle area
 *
 * @return
 */
 public int area() {
 return this.length * this.width;
 }
 }
 
By means of encapsulation, we defined "length" and "width" for the "rectangle", which completes the first step of the abstraction of the "rectangle" in the real world.
 
### Inheritance

Inheritance refers to the ability to use all functions of an existing class and extend these functions without re-writing the original class.

The new class created through inheritance is called a "subclass" or "derived class", and the inherited class is called a "base class", "parent class", or "superclass". The process of inheritance is a process from general to specific.

#### Inheritance Example

We want to define a square. Since we already have a rectangle, we can directly inherit the Rectangle class, because a square is a special case of a rectangle.


 /**
 * Square, inherits from Rectangle
 */
 class Square extends Rectangle {
 
 /**
 * Set square side length
 *
 * @param length
 */
 public Square(int length) {
 super(length, length);
 }
 }
 
In the real world, a "square" is a special case of a "rectangle", or a square is derived from a rectangle. This derivation relationship can be expressed by inheritance in object-oriented.

### Polymorphism

The so-called polymorphism refers to the same method of a class instance having different forms of expression in different situations. The polymorphism mechanism allows objects with different internal structures to share the same external interface.

This means that although the specific operations for different objects are different, through a common class, they (those operations) can be called in the same way.

The most common polymorphism is passing a subclass into a parent class parameter. When calling a parent class method at runtime, the specific internal structure or behavior is determined by the passed-in subclass.

Regarding examples of polymorphism, we will introduce them in depth in Chapter 2.

After introducing the three basic characteristics of object-oriented encapsulation, inheritance, and polymorphism, we have basically mastered the basic methods of real-world abstraction.

Shakespeare said, "There are a thousand Hamlets in a thousand people's eyes." Speaking of the abstraction of the real world, although the methods are the same, the final results obtained by using the same methods may be very different. So how to evaluate the quality of this abstraction result?

This brings us to the five basic principles of object-oriented. With the five principles, we can refer to them to evaluate the quality of an abstraction.
