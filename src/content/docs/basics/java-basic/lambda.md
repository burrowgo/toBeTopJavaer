---
title: "Lambda"
---

Lambda expressions, also known as closures, are the most important new feature driving the release of Java 8.

Lambda allows a function to be used as an argument to a method (passing a function into a method).

Using Lambda expressions can make code more concise and compact.

### Syntax
The syntax format of a Lambda expression is as follows:
```
(parameters) -> expression
or
(parameters) -> { statements; }
```

The following are important features of Lambda expressions:

* **Optional type declaration:** No need to declare parameter types; the compiler can identify parameter values uniformly.
* **Optional parameter parentheses:** A single parameter does not need parentheses, but multiple parameters do.
* **Optional curly braces:** If the body contains only one statement, curly braces are not needed.
* **Optional return keyword:** If the body has only one expression that returns a value, the compiler will automatically return it. Curly braces are needed to specify that an expression returns a value.

### Lambda Expression Examples

```java
// 1. No parameters required, returns 5
() -> 5  
  
// 2. Receives one parameter (numeric type), returns twice its value
x -> 2 * x  
  
// 3. Receives two parameters (numeric), and returns their difference
(x, y) -> x - y  
  
// 4. Receives two int integers, returns their sum
(int x, int y) -> x + y  
  
// 5. Receives a String object and prints it to the console, returns nothing (looks like void)
(String s) -> System.out.print(s)
```

Lambda expressions are mainly used to define inline executable method-type interfaces, for example, a simple functional interface. In the example above, we use various types of Lambda expressions to define the methods of the `MathOperation` interface. Then we defined the execution of `sayMessage`.

Lambda expressions eliminate the trouble of using anonymous methods and give Java simple but powerful functional programming capabilities.

### Variable Scope

Lambda expressions can only reference outer local variables marked as `final`. This means you cannot modify local variables defined outside the scope inside a Lambda; otherwise, a compilation error will occur. For example, the following code will fail to compile:

```java
String first = "";  
Comparator<String> comparator = (first, second) -> Integer.compare(first.length(), second.length()); 
```

Original address: [https://www.runoob.com/java/java8-lambda-expressions.html](https://www.runoob.com/java/java8-lambda-expressions.html)
