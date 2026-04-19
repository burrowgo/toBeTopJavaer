---
title: "Strategy Pattern"
---

## Concept

Anyone who has studied design patterns probably knows the book [Head First Design Patterns][2]. The first pattern introduced in this book is the Strategy Pattern. I believe there are two main reasons for putting the Strategy Pattern first: 1. It is indeed a relatively simple pattern. 2. This pattern fully reflects object-oriented design principles such as "encapsulate what varies", "favor composition over inheritance", and "program to an interface, not an implementation".

> Strategy Pattern: Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it. It is also known as the Policy pattern.

## Usage

Combined with the concept of the Strategy Pattern, let's look at a practical scenario to understand it.

Suppose we are a newly opened bookstore. To attract customers, we launch a membership service. We divide the members in the store into three types: Primary Member, Intermediate Member, and Advanced Member. We give different discounts to members of different levels. Primary members get no discount, Intermediate members get a 10% discount, and Advanced members get a 20% discount.

[<img src="http://www.hollischuang.com/wp-content/uploads/2016/09/bookstore-300x300.jpg" alt="bookstore" width="300" height="300" class="alignright size-medium wp-image-1694" />][3] We hope that when a user pays, as long as they scan the book's barcode and the member scans their membership card, the cashier staff can directly know how much they should charge the customer.

Without using a pattern, we could use `if/else` statements in the settlement method to distinguish between different members and calculate the price.

However, what if we want to change the discount for primary members to 2% off (9.8 discount) one day? What if we want to launch a Super Member one day? What if we want to limit the number of books that intermediate members can get a discount on?

A system designed using `if/else` has all the algorithms written together. As long as there is a change, I have to modify the entire class. We all know that modifying code can introduce problems. To avoid this problem, we can use the Strategy Pattern...

> For the cashier system, when calculating the accounts receivable, a customer can only be one of the Primary, Intermediate, or Advanced members. Different members use different algorithms to calculate the price. The cashier system actually doesn't care about the relationship between specific member types and discounts. It also doesn't want any changes to members and discounts to affect the cashier system.

Before introducing the specific implementation of the Strategy Pattern, let's reinforce several object-oriented design principles: "encapsulate what varies", "favor composition over inheritance", and "program to an interface, not an implementation". Think about how to apply them to the Strategy Pattern and what the benefits are.

## Implementation

The Strategy Pattern includes the following roles:

> Context: Environment class
> 
> Strategy: Abstract strategy class
> 
> ConcreteStrategy: Concrete strategy class

[<img src="http://www.hollischuang.com/wp-content/uploads/2016/09/Strategy.jpg" alt="strategy" width="764" height="329" class="aligncenter size-full wp-image-1692" />][4]

Let's use the Strategy Pattern to implement the bookstore's cashier system. We can abstract the member into a strategy class, and different member types are concrete strategy classes. Different strategy classes implement the algorithm for calculating the price. Then, integrate the members into the cashier through composition.

First, define an interface, which is the abstract strategy class. This interface defines the price calculation method, and the specific implementation is defined by the concrete strategy classes.

``` java
/**
 * Created by hollis on 16/9/19. Member Interface
 */
public interface Member {
    
    /**
     * Calculate payable price
     * @param bookPrice Original book price (for amounts, BigDecimal is recommended; double will lose precision)
     * @return Payable amount
     */
    public double calPrice(double bookPrice);
}
```
    

Define three concrete strategy classes for different members, each of which implements the price calculation method separately.

``` java
/**
 * Created by hollis on 16/9/19. Primary Member
 */
public class PrimaryMember implements Member {
    
    @Override
    public double calPrice(double bookPrice) {
        System.out.println("No discount for primary members");
        return bookPrice;
    }
}
    
    
/**
 * Created by hollis on 16/9/19. Intermediate Member, 10% discount on books
 */
public class IntermediateMember implements Member {
    
    @Override
    public double calPrice(double bookPrice) {
        System.out.println("Discount for intermediate members is 10%");
        return bookPrice * 0.9;
    }
}
    
    
/**
 * Created by hollis on 16/9/19. Advanced Member, 20% discount on books
 */
public class AdvancedMember implements Member {
    
    @Override
    public double calPrice(double bookPrice) {
        System.out.println("Discount for advanced members is 20%");
        return bookPrice * 0.8;
    }
}
```
    

The definitions of the classes above reflect the "encapsulate what varies" design principle. Changes in the specific discount methods of different members will not affect other members.

After defining the abstract strategy class and concrete strategy classes, let's define the environment class. The environment class is the class that integrates the algorithms. In this example, it is the cashier system. It uses composition to integrate members.

``` java
/**
 * Created by hollis on 16/9/19. Book Price Class
 */
public class Cashier {
    
    /**
     * Member, strategy object
     */
    private Member member;
    
    public Cashier(Member member){
        this.member = member;
    }
    
    /**
     * Calculate payable price
     * @param booksPrice
     * @return
     */
    public double quote(double booksPrice) {
        return this.member.calPrice(booksPrice);
    }
}
```
    

This Cashier class is an environment class. The definition of this class reflects the two design principles: "favor composition over inheritance" and "program to an interface, not an implementation". Since composition + interface is used here, we don't need to modify the Cashier class when we launch Super Member later. Just define another `SuperMember implements Member`.

Define a client to test it:

``` java
/**
 * Created by hollis on 16/9/19.
 */
public class BookStore {
    
    public static void main(String[] args) {
    
        // Choose and create the strategy object to be used
        Member strategy = new AdvancedMember();
        // Create environment
        Cashier cashier = new Cashier(strategy);
        // Calculate price
        double quote = cashier.quote(300);
        System.out.println("The final price for advanced member books is: " + quote);
    
        strategy = new IntermediateMember();
        cashier = new Cashier(strategy);
        quote = cashier.quote(300);
        System.out.println("The final price for intermediate member books is: " + quote);
    }
}
    
// Discount for advanced members is 20%
// The final price for advanced member books is: 240.0
// Discount for intermediate members is 10%
// The final price for intermediate member books is: 270.0
```
    

As can be seen from the example above, the Strategy Pattern only encapsulates algorithms and provides new algorithms to be inserted into existing systems. The Strategy Pattern does not decide when to use which algorithm. Under what circumstances to use what algorithm is decided by the client.

*   Focus of the Strategy Pattern
    
    *   The focus of the Strategy Pattern is not how to implement algorithms, but how to organize and invoke these algorithms, making the program structure more flexible and having better maintainability and extensibility.

*   Equality of Algorithms
    
    *   A major feature of the Strategy Pattern is the equality of each strategy algorithm. For a family of concrete strategy algorithms, everyone's status is exactly the same. Because of this equality, algorithms can be replaced with each other. All strategy algorithms are also independent in terms of implementation and have no dependence on each other.
    
    *   Therefore, this family of strategy algorithms can be described as follows: strategy algorithms are different implementations of the same behavior.

*   Uniqueness of Strategy at Runtime
    
    *   During runtime, the Strategy Pattern can only use one concrete strategy implementation object at each moment. Although it can dynamically switch between different strategy implementations, only one can be used at the same time.

*   Common Behaviors
    
    *   It is often seen that all concrete strategy classes have some common behaviors. At this time, these common behaviors should be placed in the common abstract strategy role Strategy class. Of course, in this case, the abstract strategy role must be implemented using a Java abstract class instead of an interface. ([Strategy Pattern in "JAVA and Patterns"][5])

## Advantages and Disadvantages of Strategy Pattern

### Advantages

*   The Strategy Pattern provides perfect support for the "Open-Closed Principle". Users can choose algorithms or behaviors without modifying the original system, and can also flexibly add new algorithms or behaviors.
*   The Strategy Pattern provides a way to manage related families of algorithms. The hierarchy of strategy classes defines a family of algorithms or behaviors. Proper use of inheritance can move common code to the parent class, thereby avoiding code duplication.
*   Using the Strategy Pattern can avoid using multiple condition (if-else) statements. Multiple condition statements are difficult to maintain. They mix the logic of choosing which algorithm or behavior to take with the logic of the algorithm or behavior itself, listing them all in one multiple condition statement, which is more primitive and backward than using inheritance.

### Disadvantages

*   Clients must know all the strategy classes and decide for themselves which strategy class to use. This means that the client must understand the differences between these algorithms in order to choose the appropriate algorithm class at the right time.
*   Since the Strategy Pattern encapsulates each specific strategy implementation as a separate class, if there are many alternative strategies, the number of objects will be considerable. The number of objects can be reduced to some extent by using the Flyweight Pattern.

All code in the article can be found on [GitHub][6]

## References

[Strategy Pattern in "JAVA and Patterns"][5]

 [1]: http://www.hollischuang.com/archives/category/%E7%BB%BC%E5%90%88%E5%BA%94%E7%94%A8/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F
 [2]: http://s.click.taobao.com/DxA2xSx
 [3]: http://www.hollischuang.com/wp-content/uploads/2016/09/bookstore.jpg
 [4]: http://www.hollischuang.com/wp-content/uploads/2016/09/Strategy.jpg
 [5]: http://www.cnblogs.com/java-my-life/archive/2012/05/10/2491891.html
 [6]: https://github.com/hollischuang/DesignPattern