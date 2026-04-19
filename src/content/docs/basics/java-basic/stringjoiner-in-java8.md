---
title: "Stringjoiner In Java8"
---

In the previous section, we introduced several ways to concatenate strings in Java, as well as their advantages and disadvantages. Another important and well-established concatenation method is `StringJoiner`, which has been part of the standard library since Java 8. This article will discuss its usage and benefits.

If you want to know how many ways there are to perform string concatenation, here's a simple trick: in IntelliJ IDEA, define a Java Bean and then try to use the shortcut key to automatically generate a `toString` method. IDEA will prompt multiple `toString` generation strategies to choose from.

![toString generation strategies](http://www.hollischuang.com/wp-content/uploads/2019/02/15508994967943.jpg)

Currently, the default `toString` generation strategy of the IDEA I use is to use `StringJoiner` provided by JDK 1.8.

### Introduction

```java
`StringJoiner` is a class in the `java.util` package used to construct a sequence of characters separated by a delimiter (optional), and can start from a provided prefix and end with a provided suffix. Although this can also be achieved by appending a delimiter after each string with the help of the `StringBuilder` class, `StringJoiner` provides an easy way to achieve it without writing a lot of code.
```

The `StringJoiner` class has a total of 2 constructors and 5 public methods. The most commonly used methods are the `add` method and the `toString` method, similar to the `append` method and the `toString` method in `StringBuilder`.

### Usage

The usage of `StringJoiner` is relatively simple. In the code below, we used `StringJoiner` for string concatenation.

```java
public class StringJoinerTest {

``` java
```java
public static void main(String[] args) {
    StringJoiner sj = new StringJoiner("Hollis");
```

    sj.add("hollischuang");
    sj.add("Java-related Insights");
    System.out.println(sj.toString());

    StringJoiner sj1 = new StringJoiner(":", "[", "]");

    sj1.add("Hollis").add("hollischuang").add("Java-related Insights");
    System.out.println(sj1.toString());
}
```
}
```

The output result of the above code:

```
hollischuangHollisJava-related Insights
[Hollis:hollischuang:Java-related Insights]
```

It is worth noting that when we initialize a `StringJoiner` with `StringJoiner(CharSequence delimiter)`, this `delimiter` is actually a delimiter, not the initial value of the mutable string.

The second and third parameters of `StringJoiner(CharSequence delimiter, CharSequence prefix, CharSequence suffix)` are the prefix and suffix of the concatenated string, respectively.

### Principle

After introducing the simple usage, let's look at the principle of `StringJoiner` and how it is implemented. Mainly look at the `add` method:

```java
public StringJoiner add(CharSequence newElement) {
``` 
prepareBuilder().append(newElement);
return this;
```
}

private StringBuilder prepareBuilder() {
``` 
if (value != null) {
    value.append(delimiter);
} else {
    value = new StringBuilder().append(prefix);
}
return value;
```
}
```

We see a familiar figure - `StringBuilder`. Yes, `StringJoiner` actually relies on `StringBuilder`.

When we find that `StringJoiner` is actually implemented through `StringBuilder`, we can probably guess that **its performance loss should be similar to using `StringBuilder` directly**!

### Why StringJoiner is Needed

After understanding the usage and principle of `StringJoiner`, many readers may have a question: since there is already a `StringBuilder`, why define a `StringJoiner` in Java 8? What are the benefits?

If readers know Java 8 well enough, they might guess roughly: it must be related to Stream.

The author also found the answer in the [Java doc][3]:

> A StringJoiner may be employed to create formatted output from a Stream using Collectors.joining(CharSequence)

Imagine in Java, if we have such a List:

```java
List<String> list = ImmutableList.of("Hollis", "hollischuang", "Java-related Insights");
```

If we want to concatenate it into a string of the following form:

```
Hollis,hollischuang,Java-related Insights
```

It can be done in the following way:

```java
StringBuilder builder = new StringBuilder();

if (!list.isEmpty()) {
``` 
builder.append(list.get(0));
for (int i = 1, n = list.size(); i < n; i++) {
    builder.append(",").append(list.get(i));
}
```
}
builder.toString();
```

Can also use:

```java
list.stream().reduce(new StringBuilder(), (sb, s) -> sb.append(s).append(','), StringBuilder::append).toString();
```

But the output result is slightly different and requires secondary processing:

```
Hollis,hollischuang,Java-related Insights,
```

Can also use "+" for concatenation:

```java
list.stream().reduce((a,b)->a + "," + b).get();
```

The above ways are either complex in code, low in performance, or unable to directly get the desired result.

To meet requirements like this, `StringJoiner` provided in Java 8 comes in handy. The above requirement needs only one line of code:

```java
list.stream().collect(Collectors.joining(","))
```

In the expression used above, the source code of `Collectors.joining` is as follows:

```java
public static Collector<CharSequence, ?, String> joining(CharSequence delimiter,
                                                         CharSequence prefix,
                                                         CharSequence suffix) {
``` 
return new CollectorImpl<>(
        () -> new StringJoiner(delimiter, prefix, suffix),
        StringJoiner::add, StringJoiner::merge,
        StringJoiner::toString, CH_NOID);
```
}
```

The implementation principle is to use `StringJoiner`.

Of course, perhaps using `StringBuilder` directly in `Collector` could also achieve similar functions, but it's slightly more troublesome. Therefore, `StringJoiner` is provided in Java 8 to enrich the usage of `Stream`.

And `StringJoiner` can also conveniently add prefix and suffix. For example, if we want the obtained string to be `[Hollis,hollischuang,Java-related Insights]` instead of `Hollis,hollischuang,Java-related Insights`, the advantage of `StringJoiner` is even more obvious.

### Summary

This article introduced the mutable string class - `StringJoiner` - provided in Java 8, which can be used for string concatenation.

`StringJoiner` is actually implemented through `StringBuilder`, so its performance is similar to `StringBuilder`. It is also not thread-safe.

How to choose for string concatenation in daily development?

1. If it's just a simple string concatenation, consider using "+" directly.

2. If concatenating strings in a `for` loop, consider using `StringBuilder` and `StringBuffer`.

3. If concatenating strings through a `List`, consider using `StringJoiner`.

 [1]: http://www.hollischuang.com/archives/3186
 [2]: http://www.hollischuang.com/wp-content/uploads/2019/02/15508994967943.jpg
 [3]: https://docs.oracle.com/javase/8/docs/api/java/util/StringJoiner.html
