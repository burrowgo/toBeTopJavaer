---
title: "Enum Usage"
---

### 1 Background

Before the `java` language introduced the enum type, the common pattern for representing enum types was to declare a set of `int` constants. Previously, we usually used the code defined by the `public final static` method as follows, using 1 to represent spring, 2 for summer, 3 for autumn, and 4 for winter.

```java
public class Season {
``` java
public static final int SPRING = 1;
public static final int SUMMER = 2;
public static final int AUTUMN = 3;
public static final int WINTER = 4;
```
}
```

This method is called the int enum pattern. But what's the problem with this pattern? We've used it for so long, it should be fine. Usually, the code we write considers its **security**, **ease of use**, and **readability**. First, let's consider its type **security**. Of course, **this pattern is not type-safe**. For example, we design a function that requires passing in a value for spring, summer, autumn, or winter. But using the `int` type, we cannot guarantee that the passed value is legal. The code is as follows:

```java
private String getChineseSeason(int season){
``` 
StringBuffer result = new StringBuffer();
switch(season){
    case Season.SPRING :
        result.append("Spring");
        break;
    case Season.SUMMER :
        result.append("Summer");
        break;
    case Season.AUTUMN :
        result.append("Autumn");
        break;
    case Season.WINTER :
        result.append("Winter");
        break;
    default :
        result.append("Non-existent season");
        break;
}
return result.toString();
```
}

public void doSomething(){
``` 
System.out.println(this.getChineseSeason(Season.SPRING));// This is a normal scenario

System.out.println(this.getChineseSeason(5));// This is an abnormal scenario, which leads to type safety problems
```
}
```

The program `getChineseSeason(Season.SPRING)` is our expected usage method. But `getChineseSeason(5)` is obviously not, and it will pass compilation. We don't know what will happen at runtime. This obviously does not conform to the type safety of `Java` programs.

Next, let's consider the **readability** of this pattern. In most occasions using enums, I need to conveniently get the string representation of the enum type. If `int` enum constants are printed, what we see is a group of numbers, which is not very useful. We might think of using `String` constants instead of `int` constants. Although it provides printable strings for these constants, it leads to performance problems because it relies on string comparison operations, so this pattern is also not what we expect. Considering both **type safety** and **program readability**, the shortcomings of `int` and `String` enum patterns are revealed. Fortunately, starting from the `Java 1.5` release version, another alternative solution was proposed that can avoid the shortcomings of `int` and `String` enum patterns and provides many additional benefits. That is the enum type (`enum type`). The following sections will introduce the definition, characteristics, application scenarios, and advantages and disadvantages of enum types.

### 2 Definition

An enum type (`enum type`) refers to a legal type composed of a fixed set of constants. In `Java`, an enum type is defined by the keyword `enum`. Below is the definition of a `java` enum type.

```java
public enum Season {
``` 
SPRING, SUMMER, AUTUMN, WINTER;
```
}
```

### 3 Characteristics

`Java`'s statements for defining enum types are very concise. It has the following characteristics:

> 1) Use the keyword `enum`
> 2) Type name, such as `Season` here
> 3) A string of allowed values, such as the four seasons defined above
> 4) Enums can be defined separately in a file, or embedded in other `Java` classes

In addition to such basic requirements, users have some other options:

> 5) Enums can implement one or more interfaces
> 6) Can define new variables
> 7) Can define new methods
> 8) Can define classes that vary according to specific enum values

### 4 Application Scenarios

Taking the type safety mentioned in the background as an example, rewrite that code using enum types. The code is as follows:

```java
public enum Season {
``` java
SPRING(1), SUMMER(2), AUTUMN(3), WINTER(4);

```java
private int code;
private Season(int code){
    this.code = code;
}
```

public int getCode(){
    return code;
}
```
}

public class UseSeason {
``` java
/**
 * Convert English seasons to Chinese seasons
 * @param season
 * @return
 */
public String getChineseSeason(Season season){
    StringBuffer result = new StringBuffer();
    switch(season){
        case SPRING :
            result.append("[Chinese: Spring, Enum Constant:" + season.name() + ", Data:" + season.getCode() + "]");
            break;
        case AUTUMN :
            result.append("[Chinese: Autumn, Enum Constant:" + season.name() + ", Data:" + season.getCode() + "]");
            break;
        case SUMMER : 
            result.append("[Chinese: Summer, Enum Constant:" + season.name() + ", Data:" + season.getCode() + "]");
            break;
        case WINTER :
            result.append("[Chinese: Winter, Enum Constant:" + season.name() + ", Data:" + season.getCode() + "]");
            break;
        default :
            result.append("Non-existent season " + season.name());
            break;
    }
    return result.toString();
}

```java
public void doSomething(){
    for(Season s : Season.values()){
        System.out.println(getChineseSeason(s));// This is a normal scenario
    }
    // System.out.println(getChineseSeason(5));
    // Here, it fails to compile, which guarantees type safety
}

public static void main(String[] arg){
    UseSeason useSeason = new UseSeason();
    useSeason.doSomething();
}
```
```
}
```

[Chinese: Spring, Enum Constant:SPRING, Data:1]
[Chinese: Summer, Enum Constant:SUMMER, Data:2]
[Chinese: Autumn, Enum Constant:AUTUMN, Data:3]
[Chinese: Winter, Enum Constant:WINTER, Data:4]

Here is a question: why do I need to add fields to the enum type? The purpose is to associate data with its constants. For example, 1 represents spring, and 2 represents summer.

### 5 Summary

So when should enums be used? Whenever a set of fixed constants is needed, such as the days of a week, the four seasons of a year, etc. Or when the set of all values is known before compilation. Java 1.5's enums can meet the requirements of most programmers; its concise and easy-to-use characteristics are very prominent.

### 6 Usage

#### Usage 1: Constants

```java
public enum Color {  
  RED, GREEN, BLANK, YELLOW  
}  
```

#### Usage 2: switch

```java
enum Signal {  
``` 
GREEN, YELLOW, RED  
```
}  
public class TrafficLight {  
``` java
Signal color = Signal.RED;  
```java
public void change() {  
    switch (color) {  
    case RED:  
        color = Signal.GREEN;  
        break;  
    case YELLOW:  
        color = Signal.RED;  
        break;  
    case GREEN:  
        color = Signal.YELLOW;  
        break;  
    }  
}  
```
```
}  
```

#### Usage 3: Adding new methods to enums

```java
public enum Color {  
``` java
RED("Red", 1), GREEN("Green", 2), BLANK("White", 3), YELLO("Yellow", 4);  
// Member variables  
```java
private String name;  
private int index;  
// Constructor  
private Color(String name, int index) {  
    this.name = name;  
    this.index = index;  
}  
// Ordinary method  
public static String getName(int index) {  
    for (Color c : Color.values()) {  
        if (c.getIndex() == index) {  
            return c.name;  
        }  
    }  
    return null;  
}  
// Getters and Setters
public String getName() {  
    return name;  
}  
public void setName(String name) {  
    this.name = name;  
}  
public int getIndex() {  
    return index;  
}  
public void setIndex(int index) {  
    this.index = index;  
}  
```
```
}  
```

#### Usage 4: Overriding enum methods

```java
public enum Color {  
``` java
RED("Red", 1), GREEN("Green", 2), BLANK("White", 3), YELLO("Yellow", 4);  
// Member variables  
```java
private String name;  
private int index;  
// Constructor  
private Color(String name, int index) {  
    this.name = name;  
    this.index = index;  
}  
// Overriding method  
@Override  
public String toString() {  
    return this.index+"_"+this.name;  
}  
```
```
}  
```

#### Usage 5: Implementing interfaces

```java
public interface Behaviour {  
``` java
void print();  
String getInfo();  
```
}  
public enum Color implements Behaviour{  
``` java
RED("Red", 1), GREEN("Green", 2), BLANK("White", 3), YELLO("Yellow", 4);  
// Member variables  
```java
private String name;  
private int index;  
// Constructor  
private Color(String name, int index) {  
    this.name = name;  
    this.index = index;  
}  
// Interface method  
@Override  
public String getInfo() {  
    return this.name;  
}  
// Interface method  
@Override  
public void print() {  
    System.out.println(this.index+":"+this.name);  
}  
```
```
}  
```

#### Usage 6: Using interfaces to organize enums

```java
public interface Food {  
``` 
enum Coffee implements Food{  
    BLACK_COFFEE, DECAF_COFFEE, LATTE, CAPPUCCINO  
}  
enum Dessert implements Food{  
    FRUIT, CAKE, GELATO  
}  
```
}
```
