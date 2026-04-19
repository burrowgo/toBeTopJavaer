---
title: "Iteration Of Collection"
---

There are several ways to iterate through a `Collection`:

1. Iteration via a regular `for` loop.
2. Iteration via an enhanced `for` loop.
3. Iteration using an `Iterator`.
4. Iteration using `Stream`.

```java
List<String> list = ImmutableList.of("Hollis", "hollischuang");

// Regular for loop traversal
for (int i = 0; i < list.size(); i++) {
``` 
System.out.println(list.get(i));
```
}

// Enhanced for loop traversal
for (String s : list) {
``` 
System.out.println(s);
```
}

// Iterator traversal
Iterator<String> it = list.iterator();
while (it.hasNext()) {
``` 
System.out.println(it.next());
```
}

// Stream traversal
list.forEach(System.out::println);

list.stream().forEach(System.out::println);
```
