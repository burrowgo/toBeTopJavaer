---
title: "Object Oriented Vs Procedure Oriented"
---

Many Java developers have heard since they first started with Java that it is an object-oriented development language. So, what is object-oriented programming?

First, object-oriented (OO) refers to a style of programming in software engineering, often called a development paradigm or programming paradigm. Object-oriented is one of many development paradigms. Besides object-oriented, there are also procedure-oriented, imperative programming, functional programming, and more.

While functional programming has become increasingly well-known in recent years, the two paradigms we encounter most frequently are still procedure-oriented and object-oriented.

In the first article of the first chapter of this book, let's briefly introduce what procedure-oriented and object-oriented are.

### What is Procedure-Oriented?

Procedure-Oriented (PO) is a programming thinking centered on processes, a top-down programming model. The most typical procedure-oriented programming language is C.

Simply put, in the procedure-oriented development paradigm, programmers need to decompose the problem into individual steps, implement each step with a function, and call them in sequence.

That is, when doing procedure-oriented programming, you don't need to consider much; just define a function first, and then use various methods such as `if-else` and `for-each` to execute the code. A typical usage is implementing a simple algorithm, such as bubble sort.

Software developed using procedure-oriented methods has flow-based code, where it's clear what the first step is and what the second step is. This method of code execution is very efficient.

However, procedure-oriented programming also faces problems such as low code reusability, poor extensibility, and difficulty in later maintenance.

### What is Object-Oriented?

The prototype of Object-Oriented (OO) first appeared in the Simula language in 1960. At that time, the field of programming was facing a crisis: how could software be well-maintained as hardware and software environments became increasingly complex?

Object-oriented programming solved this problem to some extent by emphasizing repeatability. Currently, the more popular object-oriented languages mainly include Java, C#, C++, Python, Ruby, PHP, and more.

Simply put, in the object-oriented development paradigm, programmers decompose the problem into individual steps, abstract each step accordingly to form objects, and solve the problem through calls and combinations between different objects.

That is, when doing object-oriented programming, you need to encapsulate attributes, behaviors, etc., into objects, and then implement business logic based on these objects and their capabilities. For example: if you want to build a car, you first need to define various attributes of the car and then abstract it into a `Car` class.

The object-oriented programming method is more popular because it conforms more to human thinking. Code written in this way has high extensibility and maintainability.

Rather than saying object-oriented is a development paradigm, it is better to say it is a method of understanding and abstracting the real world. By understanding and abstracting the real world, and using methods such as encapsulation, inheritance, and polymorphism, software is developed by abstracting objects.

What are encapsulation, inheritance, and polymorphism? Specifically, how do you write code in an object-oriented way? Next, we will introduce the three basic characteristics and five basic principles of object-oriented programming.
