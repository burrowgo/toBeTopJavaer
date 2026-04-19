---
title: "Generics Problem"
---


### 1. When Generics Meet Overloading

```java
public class GenericTypes { 
```
 
 public static void method(List<String> list) { 
 System.out.println("invoke method(List<String> list)"); 
 } 
 
 public static void method(List<Integer> list) { 
 System.out.println("invoke method(List<Integer> list)"); 
 } 
 } 
 

The code above has two overloaded functions, because their parameter types are different, one is `List<String>` and the other is `List<Integer>`, but this code will not compile. Because as we mentioned before, the parameters `List<Integer>` and `List<String>` are erased after compilation, becoming the same raw type `List`, the erasure action causes the signatures of these two methods to become exactly the same.

### 2. When Generics Meet Catch

If we define a custom generic exception class `GenericException<T>`, then do not try to use multiple catch blocks to match different exception types, for example, if you want to capture `GenericException<String>` and `GenericException<Integer>` separately, this is also problematic.

### 3. When Generics Contain Static Variables

```java
public class StaticTest{
public static void main(String[] args){
GT<Integer> gti = new GT<Integer>();
gti.var=1;
GT<String> gts = new GT<String>();
gts.var=2;
System.out.println(gti.var);
}
}
class GT<T>{
public static int var=0;
public void nothing(T x){}
}
```
 

The answer is - 2!

Due to type erasure, all instances of a generic class are associated with the same copy of bytecode, and all static variables of a generic class are shared.
