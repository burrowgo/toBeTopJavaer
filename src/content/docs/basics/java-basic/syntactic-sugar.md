---
title: "Syntactic Sugar"
---

Syntactic Sugar, also known as sugar-coated syntax, is a term invented by British computer scientist Peter J. Landin. It refers to a certain syntax added to a computer language. This syntax has no effect on the functions of the language, but it is more convenient for programmers to use.

This Chat delves into the principles and usage of syntactic sugar in Java from the perspective of Java compilation principles, bytecode, and class files, helping everyone understand the principles behind these syntactic sugars while learning how to use them. The main contents are as follows:

- What is syntactic sugar
- Sugar cube 1 - switch support for String and Enum
- Sugar cube 2 - Generics and type erasure
- Sugar cube 3 - Autoboxing and unboxing
-......
- Sugar cube 11 - try-with-resources
- Sugar cube 12 - lambda expressions
- Sugar-coated bullets - points to note when using syntactic sugar
- Comprehensive application


### Syntactic Sugar

Syntactic Sugar, also known as sugar-coated syntax, is a term invented by British computer scientist Peter J. Landin. It refers to a certain syntax added to a computer language. This syntax has no effect on the functions of the language, but it is more convenient for programmers to use. In short, syntactic sugar makes programs more concise and highly readable.

> Interestingly, in the field of programming, in addition to syntactic sugar, there are also terms like syntactic salt and syntactic saccharin. Due to space limitations, we will not expand on them here.

Almost all the programming languages we are familiar with have syntactic sugar. The author believes that the amount of syntactic sugar is one of the criteria for judging whether a language is powerful enough. Many people say that Java is a "low-sugar language". In fact, since Java 7, the Java language level has been adding various sugars, mainly developed under the "Project Coin" project. Although some people still think that Java is low-sugar now, it will continue to develop in the direction of "high-sugar" in the future.

### Desugaring

As mentioned before, the existence of syntactic sugar is mainly for the convenience of developers. But in fact, the Java Virtual Machine does not support these syntactic sugars. These syntactic sugars will be restored to simple basic syntax structures during the compilation phase, and this process is called desugaring.

Speaking of compilation, you must know that in the Java language, the `javac` command can compile source files with the suffix `.java` into bytecode with the suffix `.class` that can run on the Java Virtual Machine. If you look at the source code of `com.sun.tools.javac.main.JavaCompiler`, you will find that there is a step in `compile()` that calls `desugar()`, which is responsible for the implementation of desugaring.

The most commonly used syntactic sugars in Java mainly include generics, variable parameters, conditional compilation, automatic boxing and unboxing, inner classes, etc. This article mainly analyzes the principles behind these syntactic sugars. Peel off the sugar coating step by step and see its essence.

### Sugar Cube 1: switch supports String and Enum

As mentioned before, since Java 7, the syntactic sugar in the Java language has been gradually enriched, one of the more important of which is that `switch` in Java 7 began to support `String`.

Before starting coding, let's popularize some knowledge. `switch` in Java originally supports basic types, such as `int`, `char`, etc. For `int` types, numerical comparisons are performed directly. For `char` types, their ASCII codes are compared. Therefore, for the compiler, only integers can actually be used in `switch`, and any type comparison must be converted to an integer. For example, `byte`, `short`, `char` (ASCII code is an integer), and `int`.

Next, let's look at the support for `String` in `switch`, with the following code:

```java
public class switchDemoString {
public static void main(String[] args) {
String str = "world";
switch (str) {
case "hello":
System.out.println("hello");
break;
case "world":
System.out.println("world");
break;
default:
break;
}
}
}
```


After [decompilation][1], the content is as follows:

```java
public class switchDemoString
{
public switchDemoString()
{
}
public static void main(String args[])
{
String str = "world";
String s;
switch((s = str).hashCode())
{
default:
break;
case 99162322:
if(s.equals("hello"))
System.out.println("hello");
break;
case 113318802:
if(s.equals("world"))
System.out.println("world");
break;
}
}
}
```


By looking at this code, you know that **string switch is implemented through the `equals()` and `hashCode()` methods.** Fortunately, the `hashCode()` method returns an `int` instead of a `long`.

> Looking closely, you can find that it is the hash value that is actually `switch`ed, and then the security check is performed using the `equals` method. This check is necessary because hash collisions may occur. Therefore, its performance is not as good as using an enum for switch or using pure integer constants, but it is not bad either.

### Sugar Cube 2: Generics

We all know that many languages support generics, but what many people don't know is that different compilers handle generics in different ways. Usually, a compiler has two ways to handle generics: `Code specialization` and `Code sharing`. C++ and C# use the `Code specialization` processing mechanism, while Java uses the `Code sharing` mechanism.

> The Code sharing method creates a unique bytecode representation for each generic type and maps instances of that generic type to this unique bytecode representation. Mapping multiple generic type instances to a unique bytecode representation is achieved through type erasure (`type erasure`).

That is to say, **for the Java Virtual Machine, it does not recognize syntax like `Map<String, String> map` at all. It needs to be desugared through type erasure during the compilation phase.**

The main process of type erasure is as follows: 1. Replace all generic parameters with their leftmost bound (the topmost parent type) type. 2. Remove all type parameters.

The following code:

 Map<String, String> map = new HashMap<String, String>();
 map.put("name", "hollis");
 map.put("wechat", "Hollis");
 map.put("blog", "www.hollischuang.com");


After desugaring, it will become:

 Map map = new HashMap();
 map.put("name", "hollis");
 map.put("wechat", "Hollis");
 map.put("blog", "www.hollischuang.com");


The following code:

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


After type erasure, it will become:

 public static Comparable max(Collection xs){
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


**There are no generics in the virtual machine, only ordinary classes and ordinary methods. All type parameters of generic classes will be erased during compilation. Generic classes do not have their own unique `Class` objects. For example, `List<String>.class` or `List<Integer>.class` do not exist, only `List.class` exists.**

### Sugar Cube 3: Autoboxing and Unboxing

Autoboxing is Java's automatic conversion of primitive types to corresponding objects, such as converting an int variable to an Integer object. This process is called boxing. Conversely, converting an Integer object to an int type value is called unboxing. Because boxing and unboxing here are automatic, non-manual conversions, they are called autoboxing and unboxing. The encapsulation classes corresponding to primitive types byte, short, char, int, long, float, double and boolean are Byte, Short, Character, Integer, Long, Float, Double, Boolean.

Let's look at a code snippet for autoboxing:

```java
public static void main(String[] args) {
int i = 10;
Integer n = i;
}
```


After decompilation, the code is as follows:

```java
public static void main(String args[])
{
int i = 10;
Integer n = Integer.valueOf(i);
}
```


Now let's look at a code snippet for autounboxing:

```java
public static void main(String[] args) {
```

 Integer i = 10;
 int n = i;
 }


After decompilation, the code is as follows:

```java
public static void main(String args[])
{
Integer i = Integer.valueOf(10);
int n = i.intValue();
}
```


From the decompiled content, we can see that when boxing, `Integer.valueOf(int)` is called automatically. When unboxing, the `intValue` method of `Integer` is called automatically.

So, **the boxing process is implemented by calling the valueOf method of the wrapper, and the unboxing process is implemented by calling the xxxValue method of the wrapper.**

### Sugar Cube 4: Variable Arguments

Variable arguments (`variable arguments`) is a feature introduced in Java 1.5. It allows a method to take any number of values as arguments.

Look at the following variable argument code, where the print method receives variable arguments:

```java
public static void main(String[] args)
{
print("Holis", "Official Account: Hollis", "Blog: www.hollischuang.com", "QQ: 907607222");
}
```

 public static void print(String... strs)
 {
 for (int i = 0; i < strs.length; i++)
 {
 System.out.println(strs[i]);
 }
 }


Decompiled code:

```java
public static void main(String args[])
{
print(new String[] {
"Holis", "\u516C\u4F17\u53F7:Hollis", "\u535A\u5BA2\uFF1Awww.hollischuang.com", "QQ\uFF1A907607222"
});
}
```

 public static transient void print(String strs[])
 {
 for(int i = 0; i < strs.length; i++)
 System.out.println(strs[i]);

 }


From the decompiled code, it can be seen that when variable arguments are used, an array is first created. The length of the array is the number of actual parameters passed when calling the method. Then all the parameter values are put into this array, and then this array is passed as a parameter to the called method.

> PS: There is a transient identifier in the declaration of the decompiled print method. Isn't it strange? Can't transient modify methods? Isn't transient related to serialization? What is the function of transient here? Since this is not closely related to this article, we will not analyze it in depth here. Interested students can follow my WeChat official account or blog.

### Sugar Cube 5: Enum

Java SE5 provides a new type - Java's enumeration type. The keyword `enum` can create a finite set of named values as a new type, and these named values can be used as regular program components. This is a very useful function.

To see the source code, you must first have a class. What class is the enumeration type? Is it `enum`? The answer is obviously no. `enum` is just a keyword like `class`, it is not a class. Then what class is used to maintain the enumeration? Let's simply write an enumeration:

 public enum t {
 SPRING,SUMMER;
 }


Then we use decompilation to see how this code is implemented. The decompiled code content is as follows:

 public final class T extends Enum
 {
 private T(String s, int i)
 {
 super(s, i);
 }
 public static T[] values()
 {
 T at[];
 int i;
 T at1[];
 System.arraycopy(at = ENUM$VALUES, 0, at1 = new T[i = at.length], 0, i);
 return at1;
 }

 public static T valueOf(String s)
 {
 return (T)Enum.valueOf(demo/T, s);
 }

 public static final T SPRING;
 public static final T SUMMER;
 private static final T ENUM$VALUES[];
 static
 {
 SPRING = new T("SPRING", 0);
 SUMMER = new T("SUMMER", 1);
 ENUM$VALUES = (new T[] {
 SPRING, SUMMER
 });
 }
 }


Through the decompiled code, we can see `public final class T extends Enum`, which shows that this class inherits from the `Enum` class. At the same time, the `final` keyword tells us that this class cannot be inherited. **When we use `enum` to define an enumeration type, the compiler will automatically help us create a `final` class that inherits from the `Enum` class, so the enumeration type cannot be inherited.**

### Sugar Cube 6: Inner Class

Inner classes, also known as nested classes, can be understood as a common member of an outer class.

**Inner classes are also syntactic sugar because they are merely a compile-time concept. An inner class `inner` is defined in `outer.java`. Once compiled successfully, two completely different `.class` files will be generated, which are `outer.class` and `outer$inner.class`. Therefore, the name of the inner class can be exactly the same as the name of its outer class.**

```java
public class OutterClass {
private String userName;
```

 public String getUserName() {
 return userName;
 }

```java
public void setUserName(String userName) {
this.userName = userName;
}

public static void main(String[] args) {

}
```

 class InnerClass{
```java
private String name;
```

 public String getName() {
 return name;
 }

```java
public void setName(String name) {
this.name = name;
}
}
}
```


After the above code is compiled, two class files will be generated: `OutterClass$InnerClass.class` and `OutterClass.class`. When we try to decompile the `OutterClass.class` file, the command line will print the following content: `Parsing OutterClass.class...Parsing inner class OutterClass$InnerClass.class... Generating OutterClass.jad`. It will decompile both files and generate an `OutterClass.jad` file together. The file content is as follows:

```java
public class OutterClass
{
class InnerClass
{
public String getName()
{
return name;
}
public void setName(String name)
{
this.name = name;
}
private String name;
final OutterClass this$0;
```

 InnerClass()
 {
 this.this$0 = OutterClass.this;
 super();
 }
 }

 public OutterClass()
 {
 }
 public String getUserName()
 {
 return userName;
 }
```java
public void setUserName(String userName){
this.userName = userName;
}
public static void main(String args1[])
{
}
private String userName;
}
```


### Sugar Cube 7: Conditional Compilation

Under normal circumstances, every line of code in a program should participate in compilation. But sometimes for the sake of program code optimization, we hope to compile only part of it. At this time, conditions need to be added to the program so that the compiler only compiles the code that meets the conditions and discards the code that does not. This is conditional compilation.

For example, in C or CPP, conditional compilation can be achieved through preprocessing statements. In fact, conditional compilation can also be achieved in Java. Let's look at a piece of code first:

```java
public class ConditionalCompilation {
public static void main(String[] args) {
final boolean DEBUG = true;
if(DEBUG) {
System.out.println("Hello, DEBUG!");
}
```

 final boolean ONLINE = false;

 if(ONLINE){
 System.out.println("Hello, ONLINE!");
 }
 }
 }


The decompiled code is as follows:

```java
public class ConditionalCompilation
{
```

 public ConditionalCompilation()
 {
 }

```java
public static void main(String args[])
{
boolean DEBUG = true;
System.out.println("Hello, DEBUG!");
boolean ONLINE = false;
}
}
```


First, we found that there is no `System.out.println("Hello, ONLINE!");` in the decompiled code, which is actually conditional compilation. When `if(ONLINE)` is false, the compiler does not compile the code inside it.

So, **conditional compilation in Java syntax is achieved through if statements where the conditions are constants. Its principle is also a syntactic sugar of the Java language. According to the truth of the if judgment condition, the compiler directly eliminates the code block where the branch is false. Conditional compilation implemented this way must be implemented within the method body, and cannot be performed on the structure of the entire Java class or on the attributes of the class. Compared with C/C++ conditional compilation, it is indeed more limited. Conditional compilation was not introduced at the beginning of the Java language design. Although there are limitations, it is better than nothing.**

### Sugar Cube 8: Assertion

In Java, the `assert` keyword was introduced from JAVA SE 1.4. In order to avoid errors caused by using the `assert` keyword in older versions of Java code, Java does not enable assertion checks by default when executing (at this time, all assertion statements will be ignored!). If you want to enable assertion checking, you need to use the switch `-enableassertions` or `-ea` to turn it on.

Look at a piece of code that contains an assertion:

```java
public class AssertTest {
public static void main(String args[]) {
int a = 1;
int b = 1;
assert a == b;
System.out.println("Official Account: Hollis");
assert a != b: "Hollis";
System.out.println("Blog: www.hollischuang.com");
}
}
```


The decompiled code is as follows:

```java
public class AssertTest {
public AssertTest()
{
}
public static void main(String args[])
{
int a = 1;
int b = 1;
if(!$assertionsDisabled && a != b)
throw new AssertionError();
System.out.println("\u516C\u4F17\u53F7\uFF1AHollis");
if(!$assertionsDisabled && a == b)
{
throw new AssertionError("Hollis");
} else
{
System.out.println("\u535A\u5BA2\uFF1Awww.hollischuang.com");
return;
}
}
```

 static final boolean $assertionsDisabled = !com/hollis/suguar/AssertTest.desiredAssertionStatus();


 }


Obviously, the decompiled code is much more complicated than our own code. So, by using the syntactic sugar of assert, we saved a lot of code. **In fact, the underlying implementation of assertions is the if statement. If the assertion result is true, nothing is done and the program continues to execute. If the assertion result is false, the program throws an AssertError to interrupt the execution of the program.** `-enableassertions` will set the value of the $assertionsDisabled field.

### Sugar Cube 9: Numeric Literals

In Java 7, numeric literals, whether integers or floating-point numbers, allow any number of underscores to be inserted between numbers. These underscores will not affect the value of the literal, the purpose is to facilitate reading.

For example:

```java
public class Test {
public static void main(String... args) {
int i = 10_000;
System.out.println(i);
}
}
```


After decompilation:

```java
public class Test
{
public static void main(String[] args)
{
int i = 10000;
System.out.println(i);
}
}
```


After decompilation, the `_` is deleted. That is to say, **the compiler does not recognize the `_` in numeric literals, and it needs to be removed during the compilation phase.**

### Sugar Cube 10: for-each

I believe everyone is familiar with the enhanced for loop (`for-each`), which is often used in daily development. It writes much less code than the for loop. So how is this syntactic sugar implemented behind the scenes?

```java
public static void main(String... args) {
String[] strs = {"Hollis", "Official Account: Hollis", "Blog: www.hollischuang.com"};
for (String s: strs) {
System.out.println(s);
}
List<String> strList = ImmutableList.of("Hollis", "Official Account: Hollis", "Blog: www.hollischuang.com");
for (String s: strList) {
System.out.println(s);
}
}
```


The decompiled code is as follows:

 public static transient void main(String args[])
 {
 String strs[] = {
 "Hollis", "\u516C\u4F17\u53F7:Hollis", "\u535A\u5BA2:www.hollischuang.com"
 };
 String args1[] = strs;
 int i = args1.length;
 for(int j = 0; j < i; j++)
 {
 String s = args1[j];
 System.out.println(s);
 }

 List strList = ImmutableList.of("Hollis", "\u516C\u4F17\u53F7:Hollis", "\u535A\u5BA2:www.hollischuang.com");
 String s;
 for(Iterator iterator = strList.iterator(); iterator.hasNext(); System.out.println(s))
 s = (String)iterator.next();

 }


The code is very simple. **The implementation principle of for-each is actually using ordinary for loops and iterators.**

### Sugar Cube 11: try-with-resources

In Java, for resources with very expensive overhead such as file operation IO streams and database connections, they must be closed in time through the close method after use, otherwise the resources will always be in an open state, which may cause memory leaks and other problems.

The common way to close resources is to release them in the `finally` block, that is, to call the `close` method. For example, we often write code like this:

```java
public static void main(String[] args) {
BufferedReader br = null;
try {
String line;
br = new BufferedReader(new FileReader("d:\\hollischuang.xml"));
while ((line = br.readLine()) != null) {
System.out.println(line);
}
} catch (IOException e) {
// handle exception
} finally {
try {
if (br != null) {
br.close();
}
} catch (IOException ex) {
// handle exception
}
}
}
```


Since Java 7, the JDK has provided a better way to close resources using the `try-with-resources` statement. Rewriting the above code results in:

```java
public static void main(String... args) {
try (BufferedReader br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"))) {
String line;
while ((line = br.readLine()) != null) {
System.out.println(line);
}
} catch (IOException e) {
// handle exception
}
}
```


See, this is a great boon. Although I usually used `IOUtils` to close streams and didn't write much code in `finally`, this new syntactic sugar looks much more elegant. Let's see what's behind it:

 public static transient void main(String args[])
 {
 BufferedReader br;
 Throwable throwable;
 br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"));
 throwable = null;
 String line;
 try
 {
 while((line = br.readLine()) != null)
 System.out.println(line);
 }
 catch(Throwable throwable2)
 {
 throwable = throwable2;
 throw throwable2;
 }
 if(br != null)
 if(throwable != null)
 try
 {
 br.close();
 }
 catch(Throwable throwable1)
 {
 throwable.addSuppressed(throwable1);
 }
 else
 br.close();
 break MISSING_BLOCK_LABEL_113;
 Exception exception;
 exception;
 if(br != null)
 if(throwable != null)
 try
 {
 br.close();
 }
 catch(Throwable throwable3)
 {
 throwable.addSuppressed(throwable3);
 }
 else
 br.close();
 throw exception;
 IOException ioexception;
 ioexception;
 }
 }


**In fact, the principle behind it is also very simple. The compiler did all the resource-closing operations that we didn't do. Therefore, it confirms once again that the function of syntactic sugar is to facilitate the use of programmers, but it eventually has to be converted into a language that the compiler knows.**

### Sugar Cube 12: Lambda Expressions

Regarding lambda expressions, some people may have doubts because some people on the Internet say that they are not syntactic sugar. In fact, I want to correct this statement. **Lambda expressions are not syntactic sugar for anonymous inner classes, but they are also a syntactic sugar. The implementation method actually relies on several lambda-related APIs provided by the underlying JVM.**

Let's look at a simple lambda expression. Traverse a list:

```java
public static void main(String... args) {
List<String> strList = ImmutableList.of("Hollis", "Official Account: Hollis", "Blog: www.hollischuang.com");
```

 strList.forEach( s -> { System.out.println(s); } );
 }


Why say it is not syntactic sugar for inner classes? As mentioned before, inner classes will have two class files after compilation. However, the class containing the lambda expression has only one file after compilation.

Decompiled code is as follows:

 public static /* varargs */ void main(String... args) {
 ImmutableList strList = ImmutableList.of((Object)"Hollis", (Object)"\u516c\u4f17\u53f7:Hollis", (Object)"\u535a\u5ba2:www.hollischuang.com");
 strList.forEach((Consumer<String>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)V, lambda$main$0(java.lang.String ), (Ljava/lang/String;)V)());
 }

 private static /* synthetic */ void lambda$main$0(String s) {
 System.out.println(s);
 }


It can be seen that in the `forEach` method, `java.lang.invoke.LambdaMetafactory#metafactory` is actually called. The fourth parameter `implMethod` of this method specifies the method implementation. It can be seen that a `lambda$main$0` method is actually called for output here.

Let's look at a slightly more complicated one. Filter the List first and then output:

```java
public static void main(String... args) {
List<String> strList = ImmutableList.of("Hollis", "Official Account: Hollis", "Blog: www.hollischuang.com");
```

 List HollisList = strList.stream().filter(string -> string.contains("Hollis")).collect(Collectors.toList());

 HollisList.forEach( s -> { System.out.println(s); } );
 }


Decompiled code is as follows:

 public static /* varargs */ void main(String... args) {
 ImmutableList strList = ImmutableList.of((Object)"Hollis", (Object)"\u516c\u4f17\u53f7:Hollis", (Object)"\u535a\u5ba2:www.hollischuang.com");
 List<Object> HollisList = strList.stream().filter((Predicate<String>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)Z, lambda$main$0(java.lang.String ), (Ljava/lang/String;)Z)()).collect(Collectors.toList());
 HollisList.forEach((Consumer<Object>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)V, lambda$main$1(java.lang.Object ), (Ljava/lang/Object;)V)());
 }

 private static /* synthetic */ void lambda$main$1(Object s) {
 System.out.println(s);
 }

 private static /* synthetic */ boolean lambda$main$0(String string) {
 return string.contains("Hollis");
 }


The two lambda expressions respectively call the two methods `lambda$main$1` and `lambda$main$0`.

**So, the implementation of lambda expressions actually relies on some low-level APIs. During the compilation stage, the compiler desugars the lambda expression and converts it into a way of calling internal APIs.**

### Possible Pitfalls

#### Generics

**1. When generics meet overloading**
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


The above code has two overloaded functions because their parameter types are different, one is `List<String>` and the other is `List<Integer>`, but this code will not compile. Because as we mentioned before, the parameters `List<Integer>` and `List<String>` are erased after compilation, becoming the same raw type `List`. The erasure action causes the signatures of these two methods to become exactly the same.

**2. When generics meet catch**
Generic type parameters cannot be used in catch statements for Java exception handling. This is because exception handling is performed by the JVM at runtime. Since type information is erased, the JVM cannot distinguish between two exception types `MyException<String>` and `MyException<Integer>`.

**3. When generics contain static variables**

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


The output of the above code is: 2! Due to type erasure, all instances of generic classes are associated with the same copy of bytecode, and all static variables of generic classes are shared.

#### Autoboxing and Unboxing

**Object equality comparison**

```java
public class BoxingTest {

 public static void main(String[] args) {
 Integer a = 1000;
 Integer b = 1000;
 Integer c = 100;
 Integer d = 100;
 System.out.println("a == b is " + (a == b));
 System.out.println(("c == d is " + (c == d)));
 }
```


Output results:

 a == b is false
 c == d is true


In Java 5, a new feature was introduced to Integer operations to save memory and improve performance. Integer objects achieve caching and reuse by using the same object references.

> Applicable to the integer value interval -128 to +127.
>
> Only applicable to autoboxing. Using constructors to create objects is not applicable.

#### Enhanced for loop

**ConcurrentModificationException**

 for (Student stu: students) {
 if (stu.getId() == 2)
 students.remove(stu);
 }


A `ConcurrentModificationException` exception will be thrown.

Iterator works in a separate thread and has a mutex lock. After the Iterator is created, a single-chain index table pointing to the original object will be established. When the number of original objects changes, the contents of this index table will not change synchronously. Therefore, when the index pointer moves backward, the object to be iterated cannot be found. Therefore, according to the fail-fast principle, Iterator will immediately throw a `java.util.ConcurrentModificationException` exception.

Therefore, `Iterator` is not allowed to change the iterated object while working. But you can use the `remove()` method of `Iterator` itself to delete the object. The `Iterator.remove()` method will delete the current iteration object and maintain the consistency of the index.

### Summary

Twelve commonly used syntactic sugars in Java were introduced. Syntactic sugar is just a syntax provided to developers for easy development. But this syntax is only recognized by developers. To be executed, it needs to be desugared, that is, converted into a syntax that the JVM recognizes. When we desugar the syntactic sugar, you will find that the convenient syntax we use daily is actually composed of other simpler syntaxes.

With these syntactic sugars, we can greatly improve efficiency in daily development, but at the same time we should avoid overusing them. It is best to understand the principles before use to avoid falling into pitfalls.

References:
[Java Decompilation][1]
[Implementation details of Switch in Java for integer, character, and string types][2]
[In-depth analysis of Java's enumeration types - Thread safety and serialization issues of enumerations][3]
[Introduction to the usage of Java enumeration types][4]
[Implementation principle and pitfalls of enhanced for loop in Java (for each)][5]
[Understanding Generics in Java][6]
[Caching mechanism of integers in Java][7]
[Variable arguments in Java][8]

 [1]: http://www.hollischuang.com/archives/58
 [2]: http://www.hollischuang.com/archives/61
 [3]: http://www.hollischuang.com/archives/197
 [4]: http://www.hollischuang.com/archives/195
 [5]: http://www.hollischuang.com/archives/1776
 [6]: http://www.hollischuang.com/archives/230
 [7]: http://www.hollischuang.com/archives/1174
 [8]: http://www.hollischuang.com/archives/1271
