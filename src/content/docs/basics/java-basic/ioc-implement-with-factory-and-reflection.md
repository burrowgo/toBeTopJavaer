---
title: "Ioc Implement With Factory And Reflection"
---

This article is a reprint. Original address: https://blog.csdn.net/fuzhongmin05/article/details/61614873

### Concept of Reflection Mechanism

Consider a scenario: during program execution, if an object wants to inspect its own member attributes, how should it operate? Consider another scenario: if we want to obtain the Class information of a certain class (such as its attributes, constructors, and general methods) at runtime and then decide whether to create its object, what should we do? This requires the use of reflection!

Our `.java` files turn into `.class` files after compilation. This is like a mirror; the original is `.java`, and in the mirror is `.class`. They are actually the same. Similarly, if we see the reflection in the mirror is `.class`, we can understand the original appearance of the `.java` file through decompilation.

For reflection, the official concept is: Reflection is a feature of the Java language that allows programs to perform self-inspection and operate on internal members at runtime (note: not during compilation). For example, it allows a Java class to obtain all its member variables and methods and display them.

Reflection mainly refers to the ability of a program to access, detect, and modify its own state or behavior, and can adjust or modify the state of the behavior described by the application and related semantics according to the state and result of its own behavior. In Java, as long as the name of the class is given, all information about the class can be obtained through the reflection mechanism.

Reflection is a powerful tool in Java that allows us to conveniently create flexible code that can be assembled at runtime without the need for source code linking between components. However, improper use of reflection can be very costly! Whatever information is in the class can be obtained using the reflection mechanism, provided you know the name of the class.

### Role of Reflection Mechanism

1. Determine the class an arbitrary object belongs to at runtime;
2. Obtain the object of a class at runtime;
3. Access attributes, methods, constructors, etc., of a Java object at runtime.

First, clarify why use the reflection mechanism? Wouldn't it be enough to create objects directly? This involves the concepts of dynamic and static.

Static Compilation: Determine the type and bind the object at compile time, i.e., passing.

Dynamic Compilation: Determine the type and bind the object at runtime. Dynamic compilation maximizes Java's flexibility and reflects the application of polymorphism to reduce coupling between classes.

### Advantages and Disadvantages of Reflection Mechanism

Advantages of reflection mechanism: It can realize dynamic creation and compilation of objects, showing great flexibility (especially in J2EE development). Through the reflection mechanism, we can obtain various contents of classes and perform decompilation. For a language like JAVA that is compiled before running, the reflection mechanism can make the code more flexible and easier to implement object-oriented.

For example, for a large software, it is impossible to design it perfectly at once. After compiling and releasing the program, when we find that certain functions need to be updated, it is impossible to ask users to uninstall the previous one and reinstall the new version. If so, not many people will use this software. If static is used, the entire program needs to be recompiled once to achieve function updates. If the reflection mechanism is used, it does not need to be uninstalled; it only needs to dynamically create and compile at runtime to achieve the function.

Disadvantages of reflection mechanism: It has an impact on performance. Using reflection is basically an interpretative operation; we can tell the JVM what we want to do and let it meet our requirements. This type of operation is always slower than directly performing the same operation.

### Reflection and Factory Pattern to Implement IoC

The implementation principle of IoC in Spring is the factory pattern plus the reflection mechanism. Let's first look at the factory pattern without the reflection mechanism:

```java
interface fruit{
``` java
public abstract void eat();
```
} 
class Apple implements fruit{
     public void eat(){
         System.out.println("Apple");
     }
} 
class Orange implements fruit{
     public void eat(){
         System.out.println("Orange");
     }
}
// Construct factory class
// That is to say, in the future, if we add other instances, we only need to modify the factory class
class Factory{
     public static fruit getInstance(String fruitName){
         fruit f=null;
         if("Apple".equals(fruitName)){
             f=new Apple();
         }
         if("Orange".equals(fruitName)){
             f=new Orange();
         }
         return f;
     }
}
class hello{
     public static void main(String[] a){
         fruit f=Factory.getInstance("Orange");
         f.eat();
     }
}
```

The disadvantage of the above writing is that when we add a subclass, we need to modify the factory class. If we add too many subclasses, there will be many changes. Below, we implement the factory pattern using the reflection mechanism:

```java
interface fruit{
     public abstract void eat();
}
class Apple implements fruit{
public void eat(){
         System.out.println("Apple");
     }
}
class Orange implements fruit{
public void eat(){
        System.out.println("Orange");
``` 
}
```
}
class Factory{
``` java
public static fruit getInstance(String ClassName){
    fruit f=null;
    try{
        f=(fruit)Class.forName(ClassName).newInstance();
    }catch (Exception e) {
        e.printStackTrace();
    }
    return f;
}
```
}
class hello{
``` java
```java
public static void main(String[] a){
    fruit f=Factory.getInstance("Reflect.Apple");
    if(f!=null){
        f.eat();
    }
}
```
```
}
```

```java
Now, even if we add any number of subclasses, the factory class does not need to be modified. The factory pattern implemented using the reflection mechanism can obtain instances of the interface through reflection, but the complete package and class name need to be passed in. Moreover, the user cannot know how many subclasses an interface has that can be used, so we configure the required subclasses in the form of a property file.
```

Below, we write a factory pattern (i.e., IoC) using the reflection mechanism combined with a property file. First, create a `fruit.properties` resource file:

```properties
apple=Reflect.Apple
orange=Reflect.Orange
```

Then write the main class code:

```java
interface fruit{
``` java
public abstract void eat();
```
}
class Apple implements fruit{
``` java
```java
public void eat(){
    System.out.println("Apple");
}
```
```
}
class Orange implements fruit{
``` java
```java
public void eat(){
    System.out.println("Orange");
}
```
```
}
// Operation property file class
class init{
``` java
public static Properties getPro() throws FileNotFoundException, IOException{
    Properties pro=new Properties();
    File f=new File("fruit.properties");
    if(f.exists()){
        pro.load(new FileInputStream(f));
    }else{
        pro.setProperty("apple", "Reflect.Apple");
        pro.setProperty("orange", "Reflect.Orange");
        pro.store(new FileOutputStream(f), "FRUIT CLASS");
    }
    return pro;
}
```
}
class Factory{
``` java
public static fruit getInstance(String ClassName){
    fruit f=null;
    try{
        f=(fruit)Class.forName(ClassName).newInstance();
    }catch (Exception e) {
        e.printStackTrace();
    }
    return f;
}
```
}
class hello{
``` java
```java
public static void main(String[] a) throws FileNotFoundException, IOException{
    Properties pro=init.getPro();
    fruit f=Factory.getInstance(pro.getProperty("apple"));
    if(f!=null){
        f.eat();
    }
}
```
```
}
```

Running result: Apple

### Technical Analysis of IOC Container

The most basic technology in IOC is "Reflection" programming. In layman's terms, it is to dynamically generate objects according to the given class name (in string form). This programming method allows objects to be decided as to which object they are only when they are generated. Any objects produced in Spring must be defined in the configuration file, with the aim of improving flexibility and maintainability.

Currently, languages such as C#, Java, and PHP5 all support reflection. In PHP5 technical books, it is sometimes translated as "mapping". Everyone should be very clear about the concept and usage of reflection. The application of reflection is very wide. Many mature frameworks, such as Hibernate and Spring in Java, and NHibernate and Spring.NET in .NET, all use "reflection" as the most basic technical means.

Reflection technology actually appeared very early, but it has been neglected and not further utilized. At that time, the reflection programming method was at least 10 times slower than the normal object generation method. Nowadays, reflection technology has been improved and optimized and is very mature. The speed of generating objects by reflection and the usual object generation method is not much different, about 1-2 times.

We can regard the working mode of the IOC container as an escalation of the factory pattern. We can regard the IOC container as a factory. The objects to be produced in this factory are defined in the configuration file, and then the reflection mechanism provided by the programming language is used to generate the corresponding objects according to the class names given in the configuration file. From the implementation point of view, IOC changes the object generation code that was previously hard-coded in the factory method to be defined by the configuration file, i.e., separating the factory and object generation independently, with the aim of improving flexibility and maintainability.

### What to Pay Attention to When Using IOC Framework

Using IOC framework products can bring great benefits to our development process, but we must also fully recognize the shortcomings of introducing the IOC framework, have a clear idea, and eliminate the abuse of the framework.

1) In the software system, due to the introduction of a third-party IOC container, the steps of generating objects become somewhat complicated. It was originally a matter between the two, but an extra procedure is added out of thin air. Therefore, when we first start using the IOC framework, we will feel that the system becomes less intuitive. Therefore, the introduction of a completely new framework will increase the training cost for team members to learn and understand, and in future operations and maintenance, new joiners must have the same knowledge system.

2) Since the IOC container generates objects through reflection, there is a certain loss in running efficiency. If you want to pursue running efficiency, you must balance this.

3) Specifically for IOC framework products (such as Spring), a large amount of configuration work is required, which is relatively cumbersome. For some small projects, it may objectively increase some work costs.

4) The maturity of the IOC framework product itself needs to be evaluated. If an immature IOC framework product is introduced, it will affect the entire project, so this is also a hidden risk.

We can roughly draw such a conclusion: some projects or products with small workloads are not suitable for using IOC framework products. In addition, if the team members lack knowledge and ability and lack an in-depth understanding of IOC framework products, do not introduce them rashly. Finally, projects or products that particularly emphasize running efficiency are also not suitable for introducing IOC framework products, as is the case with WEB 2.0 websites.
