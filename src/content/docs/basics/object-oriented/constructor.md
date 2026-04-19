---
title: "Constructor"
---

A constructor is a special kind of method. It is mainly used to initialize an object when it is created, that is, to assign initial values to the object's member variables. It is always used together with the `new` operator in the statement for creating an object.

``` java
/**
* Rectangle
*/
class Rectangle {
    
     /**
      * Constructor
      */
     public Rectangle(int length, int width) {
         this.length = length;
         this.width = width;
     }
         
     public static void main (String []args){
        // Use constructor to create object
        Rectangle rectangle = new Rectangle(10,5);
            
     }
}
```

Specifically, a class can have multiple constructors, which can be distinguished according to their different number of parameters or different parameter types, that is, the overloading of constructors.
         

A constructor is very similar to a general instance method; but unlike other methods, a constructor has no return type, will not be inherited, and can have an access modifier.

The function name of the constructor must be the same as the name of the class it belongs to. It undertakes the task of initializing object data members.

If a constructor is not specifically written when writing an instantiable class, most programming languages will automatically generate a default constructor (default constructor). A default constructor generally initializes the values of member variables to default values, such as int -> 0, Integer -> null.


In Java, by default, a default parameterless constructor will be automatically generated in a Java class if no constructor is specifically written. A default constructor generally initializes the values of member variables to default values, such as int -> 0, Integer -> null.

However, if we manually define a constructor with parameters in a class, then this default parameterless constructor will not be automatically added. It needs to be created manually!

``` java
/**
* Rectangle
*/
class Rectangle {
    
     /**
      * Constructor
      */
     public Rectangle(int length, int width) {
         this.length = length;
         this.width = width;
     }
         
     /**
      * Parameterless constructor
      */
     public Rectangle() {
             
     }
}
```
