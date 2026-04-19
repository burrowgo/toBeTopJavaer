---
title: "Type Erasure"
---

### 1. How Compilers in Various Languages Handle Generics

Generally, a compiler has two ways to handle generics:

1. `Code specialization`. Every time a generic class or generic method is instantiated, new target code (bytecode or binary code) is generated. For example, for a generic `List`, three target codes might be generated for `String`, `Integer`, and `Float`.

2. `Code sharing`. Only one target code is generated for each generic class; all instances of that generic class are mapped to this target code, and type checking and type conversion are performed when needed.

**C++** templates are a typical implementation of `Code specialization`. The **C++** compiler generates an execution code for each generic class instance. In the execution code, `Integer List` and `String List` are two different types. This leads to **code bloat**. In **C#**, generics exist in the program source code, in the compiled `IL` (Intermediate Language, where generics are placeholders), and in the CLR at runtime. `List<Integer>` and `List<String>` are two different types; they are generated at runtime and have their own virtual method tables and type data. This implementation is also called type expansion, and generics implemented based on this method are called `reified generics`. Generics in the **Java** language are different. They only exist in the source code. In the compiled bytecode file, they have been replaced by the original raw types (Raw Type), and cast code is inserted in appropriate places. Therefore, for the Java language at runtime, `ArrayList<Integer>` and `ArrayList<String>` are the same class. So generics are actually a "syntactic sugar" of the Java language. The generic implementation method in the Java language is called **type erasure**, and generics implemented based on this method are called `pseudo-generics`.

`C++` and `C#` use the `Code specialization` mechanism. As mentioned earlier, it has a disadvantage: it leads to **code bloat**. Another drawback is that in a reference type system, space is wasted because elements in a reference type collection are essentially pointers. There's no need to generate execution code for each type. This is also the main reason why the Java compiler uses `Code sharing`.

The `Java` compiler creates a unique bytecode representation for each generic type through `Code sharing` and maps instances of the generic type to this unique bytecode representation. Mapping multiple generic type instances to a unique bytecode representation is achieved through **type erasure** (type erasure).

---

### 2. What is Type Erasure?

We have mentioned the term **type erasure** many times. What exactly is it?

> Type erasure refers to associating generic type instances with the same bytecode through type parameter merging. The compiler only generates one bytecode for the generic type and associates its instances with this bytecode. The key to type erasure is to clear the information related to type parameters from the generic type and add type checking and type conversion methods when necessary. Type erasure can be simply understood as converting generic Java code into ordinary Java code, except the compiler is more direct and converts generic Java code directly into ordinary Java bytecode. The main process of type erasure is as follows: 1. Replace all generic parameters with their leftmost bound (the top-level parent type). (For this part, see: [Understanding extends and super in Java generics][2]) 2. Remove all type parameters.

---

### 3. Java Compiler Process for Handling Generics

**code 1:**

```java
public static void main(String[] args) {  
``` 
Map<String, String> map = new HashMap<String, String>();  
map.put("name", "hollis");  
map.put("age", "22");  
System.out.println(map.get("name"));  
System.out.println(map.get("age"));  
```
}  
```

**code 1 after decompilation:**

```java
public static void main(String[] args) {  
``` 
Map map = new HashMap();  
map.put("name", "hollis");  
map.put("age", "22"); 
System.out.println((String) map.get("name"));  
System.out.println((String) map.get("age"));  
```
}  
```

We found that the generics are gone, and the program has returned to the way Java was before generics appeared. Generic types have returned to raw types.

---

**code 2:**

```java
interface Comparable<A> {
``` java
public int compareTo(A that);
```
}

public final class NumericValue implements Comparable<NumericValue> {
``` java
```java
private byte value;
```

public NumericValue(byte value) {
    this.value = value;
}

public byte getValue() {
    return value;
}

public int compareTo(NumericValue that) {
    return this.value - that.value;
}
```
}
```

**code 2 after decompilation:**

```java
interface Comparable {
  public int compareTo(Object that);
} 

public final class NumericValue
``` 
implements Comparable
```
{
``` java
public NumericValue(byte value)
{
    this.value = value;
}
public byte getValue()
{
    return value;
}
public int compareTo(NumericValue that)
{
    return value - that.value;
}
public volatile int compareTo(Object obj)
{
    return compareTo((NumericValue)obj);
}
```java
private byte value;
```
```
}
```

---

**code 3:**

```java
public class Collections {
``` java
public static <A extends Comparable<A>> A max(Collection<A> xs) {
    Iterator<A> xi = xs.iterator();
    A w = xi.next();
    while (xi.hasNext()) {
        A x = xi.next();
        if (w.compareTo(x) < 0)
            w = x;
    }
    return w;
}
```
}
```

**code 3 after decompilation:**

```java
public class Collections
{
``` java
public Collections()
{
}
public static Comparable max(Collection xs)
{
    Iterator xi = xs.iterator();
    Comparable w = (Comparable)xi.next();
    while(xi.hasNext())
    {
        Comparable x = (Comparable)xi.next();
        if(w.compareTo(x) < 0)
            w = x;
    }
    return w;
}
```
}
```

In the second example, after `Comparable<A>` is erased, `A` is replaced by the leftmost bound `Object`. The type parameter `NumericValue` of `Comparable<NumericValue>` is erased, but this directly leads to `NumericValue` not implementing the `Comparable.compareTo(Object that)` method. So the compiler adds a **bridge method**. In the third example, the bound of the type parameter is limited to `<A extends Comparable<A>> A`. `A` must be a subclass of `Comparable<A>`. According to the process of type erasure, all type parameters are first replaced with the leftmost bound `Comparable`, and then the parameter type `A` is removed to get the final result after erasure.

---

### 4. Problems Caused by Generics

**1. When generics meet overloading:**

```java
public class GenericTypes {  

``` java
public static void method(List<String> list) {  
    System.out.println("invoke method(List<String> list)");  
}  

public static void method(List<Integer> list) {  
    System.out.println("invoke method(List<Integer> list)");  
}  
```
}  
```

In the code above, there are two overloaded functions. Because their parameter types are different, one is `List<String>` and the other is `List<Integer>`, but this code will not compile. Because as we mentioned earlier, `List<Integer>` and `List<String>` are both erased after compilation and become the same raw type `List`. The erasure action causes the signatures of these two methods to be exactly the same.

**2. When generics meet catch:**

If we customize a generic exception class `GenericException<T>`, then do not try to use multiple `catch` blocks to match different exception types. For example, trying to catch `GenericException<String>` and `GenericException<Integer>` separately is problematic.

**3. When generics contain static variables**

```java
public class StaticTest{
``` java
```java
public static void main(String[] args){
    GT<Integer> gti = new GT<Integer>();
    gti.var=1;
    GT<String> gts = new GT<String>();
    gts.var=2;
    System.out.println(gti.var);
}
```
```
}
class GT<T>{
``` java
public static int var=0;
```java
public void nothing(T x){}
```
```
}
```

The answer is - 2! Since all generic class instances are associated with the same bytecode after type erasure, all static variables of the generic class are shared.

---

### 5. Summary

1. There are no generics in the virtual machine, only ordinary classes and methods. All type parameters of generic classes will be erased during compilation. Generic classes do not have their own unique `Class` objects. For example, `List<String>.class` or `List<Integer>.class` do not exist; only `List.class` exists.
2. Please specify the type when creating generic objects to let the compiler check parameters as early as possible (**Effective Java, Item 26: Don't use raw types**).
3. Do not ignore the compiler's warning information; it means a potential `ClassCastException` is waiting for you.
4. Static variables are shared by all instances of a generic class. For a class declared as `MyClass<T>`, the method to access its static variables is still `MyClass.myStaticVar`. Whether objects are created through `new MyClass<String>` or `new MyClass<Integer>`, they share the same static variable.
5. Generic type parameters cannot be used in the `catch` statement of Java exception handling. This is because exception handling is performed by the JVM at runtime. Since type information is erased, the JVM cannot distinguish between the two exception types `MyException<String>` and `MyException<Integer>`. For the JVM, they are both of the `MyException` type. Therefore, it cannot execute the `catch` statement corresponding to the exception.

[1]: http://docs.oracle.com/javase/tutorial/java/generics/erasure.html
[2]: /archives/255
