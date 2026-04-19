---
title: "String Concat"
---

String is the most commonly used data type in Java.

This article is also a supplement to the string-related knowledge in Java, mainly introducing string concatenation. This article is based on jdk1.8.0_181.

### String Concatenation

String concatenation is a common task in Java code, which is to join multiple strings together.

We all know that **String is an immutable class in Java**, so it cannot be modified once it is instantiated.

> Once an instance of an immutable class is created, the values of its member variables cannot be modified. This design has many benefits, such as caching hashcode, easier usage, and better security.

However, since strings are immutable, how does string concatenation work?

**String Immutability and String Concatenation**

Actually, all so-called string concatenations generate a new string. Below is a piece of string concatenation code:

```java
String s = "abcd";
s = s.concat("ef");
```

Actually, the `s` we finally get is already a new string. As shown below:

![][8]

`s` stores a reference to a newly created String object.

So, how exactly is string concatenation performed in Java? There are many ways to concatenate strings. Here are a few commonly used ones.

**Using `+` to concatenate strings**

In Java, the easiest way to concatenate strings is to directly use the symbol `+`. For example:

```java
String wechat = "Hollis";
String introduce = "Daily update of Java-related technical articles";
String hollis = wechat + "," + introduce;
```

**concat**

In addition to using `+` to concatenate strings, you can also use the `concat` method in the `String` class. For example:

```java
String wechat = "Hollis";
String introduce = "Daily update of Java-related technical articles";
String hollis = wechat.concat(",").concat(introduce);
```

**StringBuffer**

Regarding strings, in addition to defining a `String` class that can be used to define **string constants**, Java also provides a `StringBuffer` class that can be used to define **string variables**. Its objects can be expanded and modified.

Using `StringBuffer` can easily concatenate strings. For example:

```java
StringBuffer wechat = new StringBuffer("Hollis");
String introduce = "Daily update of Java-related technical articles";
StringBuffer hollis = wechat.append(",").append(introduce);
```

**StringBuilder**

In addition to `StringBuffer`, another class `StringBuilder` can also be used. Its usage is similar to `StringBuffer`. For example:

```java
StringBuilder wechat = new StringBuilder("Hollis");
String introduce = "Daily update of Java-related technical articles";
StringBuilder hollis = wechat.append(",").append(introduce);
```

**StringUtils.join**

In addition to the built-in string concatenation methods in the JDK, you can also use string concatenation methods provided in some open-source libraries, such as the `StringUtils` class provided in `apache.commons`, whose `join` method can concatenate strings.

```java
String wechat = "Hollis";
String introduce = "Daily update of Java-related technical articles";
System.out.println(StringUtils.join(wechat, ",", introduce));
```

Briefly, the main function of the `join` method provided in `StringUtils` is: concatenating arrays or collections with a certain delimiter to form a new string, such as:

```java
String []list  ={"Hollis","Daily update of Java-related technical articles"};
String result= StringUtils.join(list,",");
System.out.println(result);
// Result: Hollis,Daily update of Java-related technical articles
```

Furthermore, the `String` class in Java 8 also provides a static `join` method, whose usage is similar to `StringUtils.join`.

The above are five commonly used ways to concatenate strings in Java. So which one is better to use? Why is it not recommended in the Alibaba Java Development Manual to use `+` for string concatenation in a loop body?

![Alibaba Java Development Manual regarding string concatenation rules](https://www.hollischuang.com/wp-content/uploads/2019/01/15472850170230.jpg)

(Rules regarding string concatenation in the Alibaba Java Development Manual)

### Implementation Principle of Using `+` for String Concatenation

Regarding this knowledge point, the previous sections introduced it. It is mainly implemented through the `append` method of `StringBuilder`.

### How concat is Implemented

Let's look at the source code of the `concat` method to see how this method is implemented.

```java
public String concat(String str) {
``` 
int otherLen = str.length();
if (otherLen == 0) {
    return this;
}
int len = value.length;
char buf[] = Arrays.copyOf(value, len + otherLen);
str.getChars(buf, len);
return new String(buf, true);
```
}
```

This code first creates a character array with a length equal to the sum of the lengths of the existing string and the string to be concatenated, then copies the values of the two strings into the new character array, and creates a new String object using this character array and returns it.

Through the source code, we can also see that through the `concat` method, a new String is actually `new`ed, which echoes back to the string immutability issue we mentioned earlier.

### StringBuffer and StringBuilder

Next, let's look at the implementation principles of `StringBuffer` and `StringBuilder`.

Similar to the `String` class, the `StringBuilder` class also encapsulates a character array, defined as follows:

```java
char[] value;
```

Different from `String`, it is not `final`, so it can be modified. In addition, different from `String`, not all positions in the character array are necessarily used. It has an instance variable representing the number of characters already used in the array, defined as follows:

```java
int count;
```

Its `append` source code is as follows:

```java
public StringBuilder append(String str) {
``` 
super.append(str);
return this;
```
}
```

This class inherits from the `AbstractStringBuilder` class. Look at its `append` method:

```java
public AbstractStringBuilder append(String str) {
``` 
if (str == null)
    return appendNull();
int len = str.length();
ensureCapacityInternal(count + len);
str.getChars(0, len, value, count);
count += len;
return this;
```
}
```

`append` will directly copy characters into the internal character array. If the character array length is not enough, it will be expanded.

`StringBuffer` is similar to `StringBuilder`. The biggest difference is that `StringBuffer` is thread-safe. Look at the `append` method of `StringBuffer`:

```java
public synchronized StringBuffer append(String str) {
``` 
toStringCache = null;
super.append(str);
return this;
```
}
```

This method is declared with `synchronized`, indicating it is a thread-safe method. `StringBuilder` is not thread-safe.

### How StringUtils.join is Implemented

By checking the source code of `StringUtils.join`, we can find that it is also implemented through `StringBuilder`.

```java
public static String join(final Object[] array, String separator, final int startIndex, final int endIndex) {
``` 
if (array == null) {
    return null;
}
if (separator == null) {
    separator = EMPTY;
}

// endIndex - startIndex > 0:   Len = NofStrings *(len(firstString) + len(separator))
//           (Assuming that all Strings are roughly equally long)
final int noOfItems = endIndex - startIndex;
if (noOfItems <= 0) {
    return EMPTY;
}

final StringBuilder buf = new StringBuilder(noOfItems * 16);

for (int i = startIndex; i < endIndex; i++) {
    if (i > startIndex) {
        buf.append(separator);
    }
    if (array[i] != null) {
        buf.append(array[i]);
    }
}
return buf.toString();
```
}
```

### Efficiency Comparison

Since there are so many string concatenation methods, which one has the highest efficiency? Let's do a simple comparison.

```java
long t1 = System.currentTimeMillis();
// Here is the initial string definition
for (int i = 0; i < 50000; i++) {
``` 
// Here is the string concatenation code
```
}
long t2 = System.currentTimeMillis();
System.out.println("cost:" + (t2 - t1));
```

We use code similar to the above form to test the running time of the five string concatenation codes. The results are as follows:

```
+ cost:5119
StringBuilder cost:3
StringBuffer cost:4
concat cost:3623
StringUtils.join cost:25726
```

From the results, the comparison from short to long time is:

`StringBuilder` < `StringBuffer` < `concat` < `+` < `StringUtils.join`

`StringBuffer` does synchronous processing on top of `StringBuilder`, so it takes relatively more time.

`StringUtils.join` also uses `StringBuilder`, and there are many other operations in it, so it takes a long time, which is easy to understand. Actually, `StringUtils.join` is better at handling concatenations of string arrays or lists.

So the question arises: we analyzed earlier that the implementation principle of using `+` to concatenate strings also uses `StringBuilder`. Why is the difference so large, as high as 1000 times?

Let's decompile the following code:

```java
long t1 = System.currentTimeMillis();
String str = "hollis";
for (int i = 0; i < 50000; i++) {
``` 
String s = String.valueOf(i);
str += s;
```
}
long t2 = System.currentTimeMillis();
System.out.println("+ cost:" + (t2 - t1));
```

The decompiled code is as follows:

```java
long t1 = System.currentTimeMillis();
String str = "hollis";
for(int i = 0; i < 50000; i++)
{
``` 
String s = String.valueOf(i);
str = (new StringBuilder()).append(str).append(s).toString();
```
}

long t2 = System.currentTimeMillis();
System.out.println((new StringBuilder()).append("+ cost:").append(t2 - t1).toString());
```

We can see that the decompiled code `new`s a `StringBuilder` in every `for` loop, then converts `String` to `StringBuilder`, and then performs `append`.

Frequently creating new objects certainly takes a lot of time. Not only will it take time, but frequently creating objects will also cause waste of memory resources.

Therefore, the Alibaba Java Development Manual suggests: in a loop body, for string connection, use the `append` method of `StringBuilder` for expansion instead of using `+`.

### Summary

This article introduced what string concatenation is. Although strings are immutable, they can still be concatenated by creating new strings.

There are five common string concatenation methods: using `+`, using `concat`, using `StringBuilder`, using `StringBuffer`, and using `StringUtils.join`.

Since new objects are created during the string concatenation process, if you want to perform string concatenation in a loop body, you must consider memory issues and efficiency issues.

Therefore, after comparison, we found that using `StringBuilder` directly is the most efficient. Because `StringBuilder` is inherently designed to define mutable strings and string transformation operations.

However, it should be emphasized that:

1. If it's not string concatenation in a loop body, just use `+`.

2. If you are concatenating strings in a concurrent scenario, use `StringBuffer` instead of `StringBuilder`.

 [1]: http://www.hollischuang.com/archives/99
 [2]: http://www.hollischuang.com/archives/1249
 [3]: http://www.hollischuang.com/archives/2517
 [4]: http://www.hollischuang.com/archives/1230
 [5]: http://www.hollischuang.com/archives/1246
 [6]: http://www.hollischuang.com/archives/1232
 [7]: http://www.hollischuang.com/archives/61
 [8]: https://www.hollischuang.com/wp-content/uploads/2019/01/15472897908391.jpg
