---
title: "Builder Pattern"
---

## Concept

The Builder Pattern is a creational design pattern, also known as the Generator pattern. The GoF definition for the Builder pattern is: Separate the construction of a complex object from its representation so that the same construction process can create different representations. This statement is quite abstract. In fact, it means: Decouple the process of building a complex object from the components that make up the object.

## Usage

Suppose we are an online game design company, and now we want to "copy" the game "Fantasy Westward Journey". You are the game character designer of the company. How do you design various characters in the game? In "Fantasy Westward Journey", there are characters of races such as humans, immortals, and demons, and each different race character includes specific characters such as Dragon Prince and Xiaoyaosheng.

As an excellent developer, the character generation system we design should include the following functions and features:

> To ensure game balance, the basic attributes of all characters should be consistent.
>
> Because the character creation process can be very complex, the generation details of the character should not be exposed to the outside.
>
> New characters can be added at any time.
>
> Modifications to a specific character should not affect other characters.

In fact, for character design, we can use the Abstract Factory pattern, treating characters of the same race as a product family. However, doing so may have a problem, which is that we may have to build each character from scratch in its creation process. For example, a character includes a head and a body. The head includes the face and other parts. The face includes eyebrows, mouth, nose, etc. The entire character creation process is extremely complex. It is easy to miss one of the steps.

Then, we can decouple the creation of these specific parts from the creation of the object. This is the Builder Pattern.

## Implementation

The Builder Pattern includes the following roles:

> Builder: Abstract builder (`Builder`)
>
> ConcreteBuilder: Concrete builder (`CommonBuilder`, `SuperBuilder`)
>
> Director: Director (`Director`)
>
> Product: Product role (`Role`)

![Builder](/mind-map-en/architecture.svg)

Here, we use the example of designing characters. For ease of understanding, we only create two characters: a common character and a super character. They both have methods such as setting head, face, body, HP value, MP value, and SP value. It is worth noting that setting the face depends on setting the head, and there must be a sequence.

### Product role: Role

```java
public class Role {
    private String head; // head
    private String face; // face (face depends on head)
    private String body; // body
    private Double hp;   // life value (HP)
    private Double sp;   // energy value (SP)
    private Double mp;   // magic value (MP)

    // setter and getter
    // toString
}
```

### Abstract builder: Builder

```java
public abstract class Builder {
    protected Role role = new Role();
    public abstract void buildHead();
    public abstract void buildFace();
    public abstract void buildBody();
    public abstract void buildHp();
    public abstract void buildSp();
    public abstract void buildMp();
    public Role getResult() {
        return role;
    }
}
```

### Concrete builder

```java
public class CommonRoleBuilder extends Builder {
    private Role role = new Role();
    @Override
    public void buildHead() {
        role.setHead("common head");
    }
    @Override
    public void buildFace() {
        role.setFace("common face");
    }
    @Override
    public void buildBody() {
        role.setBody("common body");
    }
    @Override
    public void buildHp() {
        role.setHp(100d);
    }
    @Override
    public void buildSp() {
        role.setSp(100d);
    }
    @Override
    public void buildMp() {
        role.setMp(100d);
    }
    @Override
    public Role getResult() {
        return role;
    }
}

public class SuperRoleBuilder extends Builder {
    private Role role = new Role();
    @Override
    public void buildHead() {
        role.setHead("super head");
    }
    @Override
    public void buildFace() {
        role.setFace("super face");
    }
    @Override
    public void buildBody() {
        role.setBody("super body");
    }
    @Override
    public void buildHp() {
        role.setHp(120d);
    }
    @Override
    public void buildSp() {
        role.setSp(120d);
    }
    @Override
    public void buildMp() {
        role.setMp(120d);
    }
    @Override
    public Role getResult() {
        return role;
    }
}
```

### Director

```java
public class Director {
    public void construct(Builder builder){
        builder.buildBody();
        builder.buildHead();
        builder.buildFace();
        builder.buildHp();
        builder.buildMp();
        builder.buildSp();
    }
}
```

### Test class

```java
public class Main {
    public static void main(String[] args) {
        Director director = new Director();
        Builder commonBuilder = new CommonRoleBuilder();
        director.construct(commonBuilder);
        Role commonRole = commonBuilder.getResult();
        System.out.println(commonRole);
    }
}
```

Now, a Builder Pattern is completed. Isn't it simple?

---

Returning to the previous requirements, let's see if we satisfy them all.

Because the process of building a character is relatively complex and involves mutual dependencies (such as the face depending on the head), we use the Builder Pattern to decouple the process of building a complex object from the components that make up the object. This ensures that the basic attributes are all consistent (consistency here means all that should be included are included) and also encapsulates the specific implementation details.

At the same time, when modifying a specific character, we only need to modify the corresponding concrete character, and it will not affect other characters.

If you need to add a new character, just add a concrete builder and write the construction code for specific details in that builder.

## Advantages and Disadvantages of Builder Pattern

### Advantages

- **Encapsulation is very good**: Using the Builder Pattern can effectively encapsulate changes. Scenarios where the Builder Pattern is used, the product class and the builder class are generally stable.
- **Client does not need to know details**: Decoupling the product itself from the product creation process.
- **Finer control over the product creation process**: Decomposing the creation steps makes the process clearer.
- **Easy to extend**: Conforms to the Open-Closed Principle.

### Disadvantages

- **Limited scope of use**: Not suitable for products with large differences.
- **Complexity**: If internal changes are complex, it may lead to many concrete builder classes.

## Applicable Environment

- The product object to be generated has a complex internal structure.
- Attributes of the product object to be generated depend on each other and need a specific order.
- The creation process of an object is independent of the class that creates the object.
- Isolate the creation and use of complex objects.

## Difference Between Builder Pattern and Factory Pattern

Compared with the Factory Pattern, the Builder Pattern is generally used to create more complex objects because the creation process is more complex. The Factory Pattern encapsulates the entire creation process in the factory class, while the Builder Pattern delivers the assembly process to the director class.

## Summary

The Builder Pattern separates the construction of a complex object from its representation, making the same construction process create different representations.
