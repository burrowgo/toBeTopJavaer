---
title: "Stream"
---

In Java, collections and arrays are data structures we frequently use, requiring regular operations such as adding, deleting, modifying, querying, aggregating, statistics, and filtering. In contrast, relational databases also have these operations, but before Java 8, processing collections and arrays was not very convenient.

However, this issue was improved in Java 8. The Java 8 API added a new abstraction called Stream, which allows you to process data in a declarative way. This article introduces how to use Stream. Specifically, the performance and principles of Stream are not the focus of this article; if you are interested, a separate article will be released later.

### Introduction to Stream

Stream provides a high-level abstraction for Java collection operations and expressions by providing an intuitive way similar to using SQL statements to query data from a database.

The Stream API can greatly increase the productivity of Java programmers, allowing them to write efficient, clean, and concise code.

This style treats the collection of elements to be processed as a stream, which is transmitted through a pipeline and can be processed at the nodes of the pipeline, such as filtering, sorting, and aggregating.

Stream has the following characteristics and advantages:

* **No storage.** Stream is not a data structure; it is just a view of some data source, which can be an array, a Java container, or an I/O channel, etc.
* **Born for functional programming.** Any modification to a Stream will not modify the underlying data source. For example, performing a filtering operation on a Stream will not delete the filtered elements, but will produce a new Stream that does not contain the filtered elements.
* **Lazy execution.** Operations on a Stream are not executed immediately; they are only executed when the user actually needs the result.
* **Consumability.** A Stream can only be "consumed" once. Once traversed, it becomes invalid, much like the iterator of a container. To traverse it again, it must be regenerated.

Let's take an example to see what Stream can actually do:

![][1]

In the example above, some colored plastic balls are obtained as a data source. First, the red ones are filtered out and melted into random triangles. Then they are filtered again to remove small triangles. Finally, the perimeter of the remaining shapes is calculated.

As shown above, for stream processing, there are mainly three critical operations: stream creation, intermediate operations, and terminal operations.

### Creation of Stream

In Java 8, there are multiple ways to create a stream.

**1. Create a stream through an existing collection**

In Java 8, in addition to adding many Stream-related classes, enhancements were also made to the collection classes themselves, adding a `stream` method that can convert a collection class into a stream.

```java
List<String> strings = Arrays.asList("Hollis", "HollisChuang", "hollis", "Hello", "HelloWorld", "Hollis");
Stream<String> stream = strings.stream();
```

Above, a stream is created through an existing List. In addition, there is a `parallelStream` method that can create a parallel stream for a collection.

This method of creating a Stream through a collection is also a relatively common method.

**2. Create a stream through Stream**

You can use methods provided by the `Stream` class to directly return a stream composed of specified elements.

```java
Stream<String> stream = Stream.of("Hollis", "HollisChuang", "hollis", "Hello", "HelloWorld", "Hollis");
```

As in the code above, a Stream is created and returned directly through the `of` method.

### Stream Intermediate Operations

Stream has many intermediate operations, which can be connected to form a pipeline. Each intermediate operation is like a worker on an assembly line; each worker can process the stream, and the result obtained after processing is still a stream.

![][2]

The following is a list of commonly used intermediate operations:

![][3]

**filter**

The `filter` method is used to filter out elements based on set conditions. The following code snippet uses the `filter` method to filter out empty strings:

```java
List<String> strings = Arrays.asList("Hollis", "", "HollisChuang", "H", "hollis");
strings.stream().filter(string -> !string.isEmpty()).forEach(System.out::println);
//Hollis, HollisChuang, H, hollis
```

**map**

The `map` method is used to map each element to a corresponding result. The following code snippet uses `map` to output the square of each element:

```java
List<Integer> numbers = Arrays.asList(3, 2, 2, 3, 7, 3, 5);
numbers.stream().map(i -> i*i).forEach(System.out::println);
//9,4,4,9,49,9,25
```

**limit/skip**

`limit` returns the first n elements of the Stream; `skip` discards the first n elements. The following code snippet uses the `limit` method to keep 4 elements:

```java
List<Integer> numbers = Arrays.asList(3, 2, 2, 3, 7, 3, 5);
numbers.stream().limit(4).forEach(System.out::println);
//3,2,2,3
```

**sorted**

The `sorted` method is used to sort the stream. The following code snippet uses the `sorted` method for sorting:

```java
List<Integer> numbers = Arrays.asList(3, 2, 2, 3, 7, 3, 5);
numbers.stream().sorted().forEach(System.out::println);
//2,2,3,3,3,5,7
```

**distinct**

`distinct` is mainly used for deduplication. The following code snippet uses `distinct` to deduplicate elements:

```java
List<Integer> numbers = Arrays.asList(3, 2, 2, 3, 7, 3, 5);
numbers.stream().distinct().forEach(System.out::println);
//3,2,7,5
```

Next, let's demonstrate through an example and a diagram what happens when a Stream is processed by `filter`, `map`, `sort`, `limit`, and `distinct` in sequence.

Code as follows:

```java
List<String> strings = Arrays.asList("Hollis", "HollisChuang", "hollis", "Hello", "HelloWorld", "Hollis");
Stream s = strings.stream().filter(string -> string.length()<= 6).map(String::length).sorted().limit(3)
            .distinct();
```

The process and the results obtained at each step are shown in the figure below:

![][4]

### Stream Terminal Operations

The result obtained by intermediate operations of a Stream is still a Stream. So how do we convert a Stream into the type we need? For example, calculating the number of elements in the stream, converting the stream into a collection, etc. This requires a terminal operation.

A terminal operation consumes the stream and produces a final result. That is to say, after a terminal operation, the stream cannot be used again, nor can any intermediate operations be used; otherwise, an exception will be thrown:

```
java.lang.IllegalStateException: stream has already been operated upon or closed
```

As the saying goes, "you can never step into the same river twice," and this is exactly what it means.

Common terminal operations are shown in the figure below:

![][5]

**forEach**

Stream provides the `forEach` method to iterate over each piece of data in the stream. The following code snippet uses `forEach` to output 10 random numbers:

```java
Random random = new Random();
random.ints().limit(10).forEach(System.out::println);
```

**count**

`count` is used to count the number of elements in the stream.

```java
List<String> strings = Arrays.asList("Hollis", "HollisChuang", "hollis", "Hollis666", "Hello", "HelloWorld", "Hollis");
System.out.println(strings.stream().count());
//7
```

**collect**

`collect` is a reduction operation that can accept various practices as parameters to accumulate the elements in the stream into a summary result:

```java
List<String> strings = Arrays.asList("Hollis", "HollisChuang", "hollis","Hollis666", "Hello", "HelloWorld", "Hollis");
strings  = strings.stream().filter(string -> string.startsWith("Hollis")).collect(Collectors.toList());
System.out.println(strings);
//Hollis, HollisChuang, Hollis666, Hollis
```

Next, let's use another diagram to demonstrate what kind of results can be obtained when different terminal operations are used after a Stream has been processed by `filter`, `map`, `sort`, `limit`, and `distinct` in the previous example:

The figure below shows the positions, inputs, and outputs of all the operations introduced in the text, and displays the results using a case study.

![][6]

### Summary

This article introduces the uses and advantages of Stream in Java 8. It also introduces several ways to use Stream, namely Stream creation, intermediate operations, and terminal operations.

There are two ways to create a Stream: through the `stream` method of a collection class and through the `of` method of `Stream`.

Intermediate operations of Stream can be used to process a Stream; the input and output of intermediate operations are both Streams. Intermediate operations can be filtering, transformation, sorting, etc.

Terminal operations of Stream can convert a Stream into other forms, such as calculating the number of elements in the stream, converting the stream into a collection, and traversing elements.

 [1]: https://www.hollischuang.com/wp-content/uploads/2019/03/15521192454583.jpg
 [2]: https://www.hollischuang.com/wp-content/uploads/2019/03/15521194075219.jpg
 [3]: https://www.hollischuang.com/wp-content/uploads/2019/03/15521194556484.jpg
 [4]: https://www.hollischuang.com/wp-content/uploads/2019/03/15521242025506.jpg
 [5]: https://www.hollischuang.com/wp-content/uploads/2019/03/15521194606851.jpg
 [6]: https://www.hollischuang.com/wp-content/uploads/2019/03/15521245463720.jpg
