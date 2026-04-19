---
title: "Delete While Iterator"
---

**1. Using a regular for loop**

While we said this cannot be done in a `foreach` loop, using a regular `for` loop is fine because it doesn't use `Iterator` for traversal, so no fail-fast check is performed.

```java
List<String> userNames = new ArrayList<String>() {{
``` 
add("Hollis");
add("hollis");
add("HollisChuang");
add("H");
```
}};

for (int i = 0; i < userNames.size(); i++) {
``` java
if (userNames.get(i).equals("Hollis")) {
    userNames.remove(i);
    i--; // Adjust index after removal to avoid skipping elements
}
```
}
System.out.println(userNames);
```

This approach has a potential issue: the `remove` operation changes the indices of the elements in the List, which might lead to missing some elements if not handled carefully (e.g., by decrementing the index `i`).

**2. Using Iterator directly**

Besides a regular `for` loop, we can directly use the `remove` method provided by `Iterator`.

```java
List<String> userNames = new ArrayList<String>() {{
``` 
add("Hollis");
add("hollis");
add("HollisChuang");
add("H");
```
}};

Iterator<String> iterator = userNames.iterator();

while (iterator.hasNext()) {
``` 
if (iterator.next().equals("Hollis")) {
    iterator.remove();
}
```
}
System.out.println(userNames);
```

If you use the `remove` method provided by the `Iterator`, it updates the `expectedModCount` value, so no exception will be thrown.

**3. Using Java 8 filter**

In Java 8, you can convert a collection into a stream. Streams offer a `filter` operation that performs a test on the original Stream; elements that pass the test are kept to generate a new Stream.

```java
List<String> userNames = new ArrayList<String>() {{
``` 
add("Hollis");
add("hollis");
add("HollisChuang");
add("H");
```
}};

userNames = userNames.stream().filter(userName -> !userName.equals("Hollis")).collect(Collectors.toList());
System.out.println(userNames);
```

**4. Using an enhanced for loop (under specific conditions)**

If you are absolutely certain that the element to be deleted appears only once in the collection (for example, when operating on a `Set`), you can use an enhanced `for` loop, provided you terminate the loop immediately after the deletion and do not continue the traversal. This prevents the code from executing the next `next()` method call.

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
    break;
}
```
}
System.out.println(userNames);
```

**5. Using fail-safe collection classes**

In Java, besides regular collection classes, there are those that use a fail-safe mechanism. Such collection containers do not access the collection content directly during traversal; instead, they first copy the original collection content and traverse the copy.

Since the traversal is performed on a copy, modifications made to the original collection during traversal are not detected by the iterator, so no `ConcurrentModificationException` is triggered.

```java
ConcurrentLinkedDeque<String> userNames = new ConcurrentLinkedDeque<String>() {{
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
    userNames.remove();
}
```
}
```

The advantage of being based on copied content is avoiding `ConcurrentModificationException`. However, the iterator cannot access the modified content: the iterator traverses the copy of the collection as it was at the moment traversal began, and it is unaware of any modifications made to the original collection during the traversal.

```java
Containers under the `java.util.concurrent` package are generally fail-safe and can be used concurrently across multiple threads with concurrent modifications.
```
