---
title: "Why Pass By Reference"
---

### Java's Evaluation Strategy

Previously, we introduced call-by-value, call-by-reference, and a special case of call-by-value called call-by-sharing. So, which evaluation strategy does Java use?

Many people say that Java's primitive data types are passed by value. This is widely accepted and there isn't much to discuss there.

However, many mistakenly believe that object passing in Java is pass-by-reference. This misconception arises mainly because there is a reference relationship between variables and objects in Java. The Java language manipulates objects through their references. Thus, many assume that passing an object means passing its reference.

Many point to the following code example as proof:

```java
public static void main(String[] args) {
Test pt = new Test();
```
 
 User hollis = new User();
 hollis.setName("Hollis");
 hollis.setGender("Male");
 pt.pass(hollis);
 System.out.println("print in main, user is " + hollis);
 }
 
```java
public void pass(User user) {
user.setName("hollischuang");
System.out.println("print in pass, user is " + user);
}
```
 

Output:

 print in pass, user is User{name='hollischuang', gender='Male'}
 print in main, user is User{name='hollischuang', gender='Male'}
 

As seen, after the object type is passed to the `pass` method, its content is changed within the method, and the object in the caller's `main` method also changes.

Therefore, many say this is identical to the behavior of pass-by-reference: changing the parameter's value inside the method affects the caller.

However, this is actually a misunderstanding.

### Object Passing in Java

Many use the phenomenon in the code example to claim that Java objects are passed by reference. Let's start with this phenomenon and refute this viewpoint.

As we mentioned earlier, whether it's pass-by-value or pass-by-reference, they are just types of evaluation strategies. There are many other strategies; for instance, the phenomenon of pass-by-sharing mentioned earlier is identical to pass-by-reference. Why claim that parameter passing in Java must be pass-by-reference instead of pass-by-sharing?

So, what form does object passing in Java actually take? It is indeed pass-by-sharing.

The "The Java(TM) Tutorials" provides an explanation for this. Regarding primitive types:

> Primitive arguments, such as an int or a double, are passed into methods by value. This means that any changes to the values of the parameters exist only within the scope of the method. When the method returns, the parameters are gone and any changes to them are lost.

**That is, primitive arguments are passed to methods by value. This means any changes to the parameter values exist only within the scope of the method. When the method returns, the parameters disappear, and any changes to them are lost.**

Regarding object passing:

> Reference data type parameters, such as objects, are also passed into methods by value. This means that when the method returns, the passed-in reference still references the same object as before. However, the values of the object's fields can be changed in the method, if they have the proper access level.

**In other words, reference data type parameters (such as objects) are also passed to methods by value. This means that when the method returns, the passed-in reference still refers to the same object as before. However, the values of the object's fields can be changed in the method if they have the appropriate access level.**

The official documentation makes it very clear: Java is pass-by-value, it's just that the reference to the object is passed as the value. Think about it - isn't that exactly pass-by-sharing?

**The evaluation strategy used in Java is actually call-by-sharing, meaning Java passes a copy of the object's address to the formal parameter of the called function.** However, the term "call-by-sharing" is not commonly used, so members of the Java community usually say "Java is call-by-value." This is also correct because call-by-sharing is actually a special case of call-by-value.

### Are the Phenomena of Pass-by-Value and Pass-by-Sharing in Conflict?

At this point, many might wonder: if pass-by-sharing is a special case of pass-by-value, why are their behaviors completely different?

In a pass-by-value process, if a value is changed in the called method, could it also affect the caller? When does it affect them, and when does it not?

In fact, there is no conflict. This confusion arises because of a misunderstanding of what "changing a value" means.

Let's go back to the previous example and look at what actually happens during the call:

<img src="http://www.hollischuang.com/wp-content/uploads/2018/04/pass21.png" alt="pass2" width="832" height="732" class="aligncenter size-full wp-image-2307" />

During parameter passing, the actual parameter's address `0X1213456` is copied to the formal parameter. This process is pass-by-value, where the content of the value being passed is the object's reference.

So why did changing the attribute value in `user` affect the original `user`?

It's like this: you copy a key to your house and give it to a friend. After getting the key, your friend doesn't change the key itself but uses it to open your door, enter the house, and smash your TV.

This process has no effect on the key in your hand, but the contents inside the house corresponding to your key have been altered.

In other words, **Java object passing is done by copying the reference relationship. If we don't change the reference relationship itself but find the address it points to and change the content there, it will affect the caller because both point to the same shared object.**

Now, what if we modify the content of the `pass` method:

```java
public void pass(User user) {
user = new User();
user.setName("hollischuang");
user.setGender("Male");
System.out.println("print in pass, user is " + user);
}
```
 

In the code above, we create a new `user` object in the `pass` method and change its value. The output is as follows:

 print in pass, user is User{name='hollischuang', gender='Male'}
 print in main, user is User{name='Hollis', gender='Male'}
 

Let's look at what happens during this process:

<img src="http://www.hollischuang.com/wp-content/uploads/2018/04/pass1.png" alt="pass1" width="859" height="721" class="aligncenter size-full wp-image-2293" />

This is like copying a key for a friend, and after receiving it, your friend takes it to a locksmith to modify it so that it opens their own house instead. At this point, even if they open their own house and set it on fire, it has no impact on your key or your house.

**Therefore, in Java object passing, if the reference is modified, it will not affect the original object. However, if the attributes of the shared object are modified directly, it will affect the original object.**

### Summary

We know that programming languages need to pass parameters between methods, and the strategy for this is called the evaluation strategy.

In programming, there are many evaluation strategies, the most common being pass-by-value and pass-by-reference. There is also a special case of pass-by-value called pass-by-sharing.

The biggest difference between pass-by-value and pass-by-reference is whether a copy is created during the passing process. If a copy is passed, it is pass-by-value; otherwise, it is pass-by-reference.

In Java, parameter passing is implemented through pass-by-value, but for Java objects, the content being passed is the reference to the object.

**We can conclude that Java's evaluation strategy is pass-by-sharing, which is entirely correct.**

However, to ensure everyone understands you, **saying that Java only has pass-by-value - where the content passed is the object's reference - is also perfectly fine.**

But you must never think that Java has pass-by-reference.

That's all for this article. I hope it helped clear up any long-standing doubts you may have had. Feel free to leave a comment with your thoughts.

### References

[The Java(TM) Tutorials][3]

[Evaluation strategy][4]

[Is Java "pass-by-reference" or "pass-by-value"?][5]

[Passing by Value vs. by Reference Visual Explanation][6]

 [3]: https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html
 [4]: https://en.wikipedia.org/wiki/Evaluation_strategy
 [5]: https://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by-value
 [6]: https://blog.penjee.com/passing-by-value-vs-by-reference-java-graphical/