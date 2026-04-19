---
title: "Fail Fast Vs Fail Safe"
---

### What is fail-fast?

First, let's look at the explanation of fail-fast from Wikipedia:

> In systems design, a fail-fast system is one which immediately reports at its interface any condition that is likely to indicate a failure. Fail-fast systems are usually designed to stop normal operation rather than attempt to continue a possibly flawed process. Such designs often check the system's state at several points in an operation, so any failures can be detected early. The responsibility of a fail-fast module is detecting errors, then letting the next-highest level of the system handle them.

In essence, it is a design philosophy: when designing a system, consider exceptional cases first. Once an exception occurs, stop the process immediately and report it.

Here is a simple example of fail-fast:

```java
public int divide(int divisor, int dividend) {
``` 
if (divisor == 0) {
    throw new RuntimeException("divisor can't be zero");
}
return dividend / divisor;
```
}
```

In the code above, the `divide` method performs a simple check on the divisor. If it is 0, it immediately throws an exception with a clear message. This is a practical application of the fail-fast philosophy.

The benefit of this approach is the early identification of error conditions, which avoids executing unnecessary complex code and allows for targeted handling of these exceptions.

As you can see, fail-fast is not a mysterious concept; you likely use it in your daily coding.

Since fail-fast is a good mechanism, why do we say there are "pitfalls"?

The reason is that Java's collection classes utilize the fail-fast mechanism in their design. If used incorrectly, it can trigger unintended behavior.

### fail-fast in Collection Classes

When we talk about the fail-fast mechanism in Java, we usually refer to the error-detection mechanism of Java collections. When multiple threads perform structural modifications on a collection, it may trigger the fail-fast mechanism, throwing a `ConcurrentModificationException` (referred to as CME hereafter).

A `ConcurrentModificationException` is thrown when a method detects concurrent modification of an object when such modification is not permitted.

Many programmers find it confusing when their code throws a CME even though it is not running in a multi-threaded environment. Let's analyze when and why this happens.

### Reproducing the Exception

In Java, if you perform `remove`/`add` operations on certain collection elements within a `foreach` loop, it will trigger the fail-fast mechanism and throw a CME.

Consider the following code:

```java
List<String> userNames = new ArrayList<String>() {{
``` 
add("Hollis");
add("hollis");
add("HollisChuang");
add("H");
```
}};

for (String userName : userNames) {
``` 
if (userName.equals("Hollis")) {
    userNames.remove(userName);
}
```
}

System.out.println(userNames);
```

The code above uses an enhanced `for` loop to iterate through elements and attempts to remove the string "Hollis". Running this code will throw the following exception:

```text
Exception in thread "main" java.util.ConcurrentModificationException
at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:909)
at java.util.ArrayList$Itr.next(ArrayList.java:859)
at com.hollis.ForEach.main(ForEach.java:22)
```

Similarly, attempting to `add` an element within an enhanced `for` loop will also throw this exception.

Before diving into the theory, let's "de-sugar" the `foreach` loop to see how it is implemented. Using a decompiler (like jad), we get:

```java
public static void main(String[] args) {
``` 
List<String> userNames = new ArrayList<String>() {{
    add("Hollis");
    add("hollis");
    add("HollisChuang");
    add("H");
}};

Iterator iterator = userNames.iterator();
do {
    if (!iterator.hasNext())
        break;
    String userName = (String)iterator.next();
    if (userName.equals("Hollis"))
        userNames.remove(userName);
} while (true);
System.out.println(userNames);
```
}
```

As shown, `foreach` is actually implemented using a `while` loop and an `Iterator`.

### The Principle Behind the Exception

From the stack trace, we can see that the exception is thrown by:

```java
java.util.ArrayList$Itr.checkForComodification(ArrayList.java:909)
```

This method is called within `iterator.next()`. Its implementation is as follows:

```java
final void checkForComodification() {
``` 
if (modCount != expectedModCount)
    throw new ConcurrentModificationException();
```
}
```

The method compares `modCount` and `expectedModCount`. If they are not equal, it throws a CME.

What are `modCount` and `expectedModCount`?
- `modCount` is a member variable of `ArrayList` that represents the actual number of times the collection has been modified. It is initialized when the collection is created.
- `expectedModCount` is a member variable of the `Itr` inner class (which implements `Iterator`). It represents the number of modifications the iterator *expects* to see. Its value is initialized when the `Itr` instance is created. It only changes if modifications are made *through the iterator*.

When `userNames.remove(userName);` is called, it only updates `modCount` and does nothing to `expectedModCount`.

Summary: The CME is thrown because the enhanced `for` loop uses an `iterator` for traversal, but the `add`/`remove` operations are performed directly on the collection class itself. When the `iterator` detects that the collection has been modified without its knowledge, it throws an exception to warn the user of a potential concurrent modification.

When you encounter a CME in Java collections, first consider the fail-fast mechanism. It doesn't necessarily mean actual concurrent access occurred; rather, the `Iterator`'s protection mechanism detected an external modification.

### fail-safe

To avoid triggering the fail-fast mechanism, you can use collection classes that employ a fail-safe mechanism.

Fail-safe containers do not operate directly on the collection data during traversal. Instead, they create a copy of the original collection and traverse the copy.

```java
Containers in the `java.util.concurrent` package are fail-safe and can be used and modified concurrently in a multi-threaded environment. They also support `add`/`remove` operations within a `foreach` loop.
```

Let's analyze `CopyOnWriteArrayList`:

```java
public static void main(String[] args) {
``` 
List<String> userNames = new CopyOnWriteArrayList<String>() {{
    add("Hollis");
    add("hollis");
    add("HollisChuang");
    add("H");
}};

for (String userName : userNames) {
    if (userName.equals("Hollis")) {
        userNames.remove(userName);
    }
}

System.out.println(userNames);
```
}
```

Using `CopyOnWriteArrayList` instead of `ArrayList` prevents the exception. Modifications in fail-safe collections are performed on a copy, not the original collection. These modification methods (like `add`/`remove`) use locks to manage concurrency. Thus, the iterator doesn't need to perform fail-fast checks.

However, while creating a copy avoids `ConcurrentModificationException`, the iterator will not reflect modifications made during traversal.

```java
public static void main(String[] args) {
``` 
List<String> userNames = new CopyOnWriteArrayList<String>() {{
    add("Hollis");
    add("hollis");
    add("HollisChuang");
    add("H");
}};

Iterator it = userNames.iterator();

for (String userName : userNames) {
    if (userName.equals("Hollis")) {
        userNames.remove(userName);
    }
}

System.out.println(userNames);

while(it.hasNext()){
    System.out.println(it.next());
}
```
}
```

The output will be:
```text
[hollis, HollisChuang, H]
Hollis
hollis
HollisChuang
H
```
The iterator traverses the collection snapshot taken at the moment it was created; it remains unaware of any subsequent modifications to the original collection.

### Copy-On-Write (COW)

Copy-On-Write is an optimization strategy where everyone shares the same resource initially. A real copy is made only when someone wants to modify it. This is a "lazy" strategy.

A `CopyOnWrite` container is a "copy-on-write" container. When adding an element, it copies the current container to a new one, adds the element to the new container, and then points the reference back to the new one.

In `CopyOnWriteArrayList`, write methods like `add`/`remove` are locked to prevent creating multiple copies during concurrent writes. However, read methods like `get` are not locked.

This allows for concurrent reads, though the data read might not be the most recent (eventual consistency, not strong consistency).

**Therefore, CopyOnWrite containers embody the idea of "Read-Write Separation" by using different containers for reading and writing.** In contrast, `Vector` uses the same container for both, resulting in mutual exclusion where only one operation can occur at a time.