---
title: "Java Pass By"
---

The question of what the parameter passing between methods in Java is really like, and why many people say Java only has pass-by-value, has always confused many people. I have even asked many experienced developers during interviews, and it's hard for them to explain it very clearly.

I wrote an article a long time ago, and I thought I had made it clear at that time. However, recently when I was organizing this knowledge point, I found that my understanding at that time was not thorough enough. So I thought about seeing how others understand it through Google. But unfortunately, I didn't find any good material that could speak clearly.

Therefore, I decided to try to summarize this topic and re-understand this issue.

### Rumor-busting Time

Regarding this issue, there have been extensive discussions on StackOverflow. It seems that many programmers have different understandings of this issue, and many even understand it incorrectly. Some people might know that parameter passing in Java is pass-by-value, but they cannot say why.

Before starting to explain in depth, it is necessary to correct those past wrong views. If you have the following ideas, then it is necessary for you to read this article carefully.

> Misunderstanding 1: Pass-by-value and pass-by-reference are distinguished by the content passed. If it is a value, it is pass-by-value. If it is a reference, it is pass-by-reference.
> 
> Misunderstanding 2: Java is pass-by-reference.
> 
> Misunderstanding 3: If the passed parameter is a common type, it is pass-by-value; if it is an object, it is pass-by-reference.

### Actual Parameters and Formal Parameters

```java
We all know that when defining methods in Java, parameters can be defined. For example, the main method in Java, `public static void main(String[] args)`, where args is the parameter. Parameters are divided into formal parameters and actual parameters in programming languages.
```

> Formal parameters: Parameters used when defining function names and function bodies, with the purpose of receiving parameters passed in when calling the function.
> 
> Actual parameters: When calling a function with parameters, there is a data transfer relationship between the calling function and the called function. When calling a function in the calling function, the parameters in the parentheses after the function name are called "actual parameters".

A simple example:

```java
public static void main(String[] args) {
ParamTest pt = new ParamTest();
pt.sout("Hollis");// Actual parameter is Hollis
}
 
public void sout(String name) { // Formal parameter is name
System.out.println(name);
}
```
 

The actual parameter is the content truly passed when calling a method with parameters, and the formal parameter is the parameter used to receive the actual parameter content.

### Evaluation Strategies

We say that when calling a method, the actual parameters need to be passed to the formal parameters. So what exactly is passed during the passing process?

This is actually the concept of **Evaluation strategies** in program design.

In computer science, an evaluation strategy is a set of (usually deterministic) rules that determine the evaluation of expressions in a programming language. The evaluation strategy defines when and in what order to evaluate the actual parameters given to the function, when to substitute them into the function, and in what form the substitution occurs.

Evaluation strategies are divided into two basic categories based on how they handle actual parameters given to a function: strict and non-strict.

#### Strict Evaluation

In "strict evaluation", in the process of function calling, the actual parameters given to the function are always evaluated before applying this function. Most existing programming languages use strict evaluation for functions. Therefore, this article only focuses on strict evaluation.

In strict evaluation, there are several key evaluation strategies that we are concerned about, namely **Call by value** (pass-by-value), **Call by reference** (pass-by-reference), and **Call by sharing** (pass-by-sharing).

* Call by value (pass-by-value) 
 * In call by value, the actual parameters are evaluated first, and then their values are passed to the formal parameters of the called function through copying. Because the formal parameters only get a "local copy", if the value of the formal parameter is changed in the called function, the value of the actual parameter will not be changed.
* Call by reference (pass-by-reference) 
 * In call by reference, what is passed to the function is an implicit reference to its actual parameters instead of a copy of the actual parameters. Because a reference is passed, if the value of the formal parameter is changed in the called function, the change is visible to the caller.
* Call by sharing (pass-by-sharing) 
 * In call by sharing, the address of the actual parameter is obtained first, and then it is copied, and the copy of the address is passed to the formal parameter of the called function. Because the addresses of parameters both point to the same object, we also call it "passing a shared object". Therefore, if the value of the formal parameter is changed in the called function, the caller can see this change.

I wonder if you have found that the process of call by sharing and call by value is almost the same, both performing "evaluation", "copying", and "passing". Think about it, think about it carefully.

![][1]

But the results of call by sharing and call by reference are the same: if the content of the parameter is changed in the called function, then this change will also have an effect on the caller. Think about it again, think about it carefully again.

So, what is the relationship between shared object passing, value passing, and reference passing?

Regarding this issue, we should focus on the process rather than the result. **Because the process of call by sharing and call by value is the same, and both have a key step of "copying", we usually consider call by sharing to be a special case of call by value.**

Let's set call by sharing aside for a moment and look at the main difference between call by value and call by reference again:

**Call by value refers to `copying` a version of the actual parameter and passing it into the function when calling the function; call by reference refers to `directly` passing the reference of the actual parameter into the function when calling the function.**

![pass-by-reference-vs-pass-by-value-animation][2]

Therefore, the most important difference between the two is whether it is passed directly or a copy is passed.

Let's give a vivid example here to further understand call by value and call by reference:

You have a key. When your friend wants to go to your house, if you `directly` give him your key, this is pass-by-reference.

In this case, if he does anything to this key, such as engraving his own name on the key, then when this key is returned to you, your own key will also have his engraved name.

You have a key. When your friend wants to go to your house, you `copy` a new key for him, and keep yours in your own hand. This is pass-by-value.

In this case, whatever he does to this key will not affect the key in your hand.

We have introduced call by value, call by reference, and the special case of call by value, call by sharing. Then, which evaluation strategy is adopted in Java?

We will analyze it in depth in the next article.


 [1]: http://www.hollischuang.com/wp-content/uploads/2020/04/15865905252659.jpg
 [2]: http://www.hollischuang.com/wp-content/uploads/2020/04/pass-by-reference-vs-pass-by-value-animation.gif
