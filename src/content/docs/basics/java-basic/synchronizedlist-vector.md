---
title: "Synchronizedlist Vector"
---

`Vector` is a class in the `java.util` package. `SynchronizedList` is a static inner class within `java.util.Collections`.

In multi-threaded scenarios, you can use the `Vector` class directly or use the `Collections.synchronizedList(List<T> list)` method to return a thread-safe List.

**So, what are the differences between `SynchronizedList` and `Vector`, and why does the Java API provide two different ways to implement a thread-safe List?**

First, we know that both `Vector` and `ArrayList` are subclasses of `List`, and their underlying implementations are identical (both use arrays). Let's compare the differences between `list1` and `list2` below:

```java
List<String> list = new ArrayList<String>();
List<String> list2 = Collections.synchronizedList(list);
Vector<String> list1 = new Vector<String>();
```

## 1. Comparing Key Methods

### 1.1 The `add` Method

**Implementation in `Vector`:**

```java
public void add(int index, E element) {
``` 
insertElementAt(element, index);
```
}

public synchronized void insertElementAt(E obj, int index) {
``` 
modCount++;
if (index > elementCount) {
    throw new ArrayIndexOutOfBoundsException(index + " > " + elementCount);
}
ensureCapacityHelper(elementCount + 1);
System.arraycopy(elementData, index, elementData, index + 1, elementCount - index);
elementData[index] = obj;
elementCount++;
```
}

private void ensureCapacityHelper(int minCapacity) {
``` 
if (minCapacity - elementData.length > 0)
    grow(minCapacity);
```
}
```

**Implementation in `SynchronizedList`:**

```java
public void add(int index, E element) {
   synchronized (mutex) {
       list.add(index, element);
   }
}
```

Here, the `add()` method of the underlying `ArrayList` is called within a synchronized block. The `ArrayList.add` method is implemented as follows:

```java
public void add(int index, E element) {
``` 
rangeCheckForAdd(index);
ensureCapacityInternal(size + 1);  // Increments modCount!!
System.arraycopy(elementData, index, elementData, index + 1, size - index);
elementData[index] = element;
size++;
```
}
```

From the code above, we can identify two main differences:
1.  **Synchronization Mechanism**: `Vector` uses synchronized methods, while `SynchronizedList` uses synchronized blocks.
2.  **Capacity Expansion**: The expansion strategy differs (this is essentially the difference between `ArrayList` and `Vector`).

### 1.2 The `remove` Method

**Implementation in `SynchronizedList`:**

```java
public E remove(int index) {
``` 
synchronized (mutex) { return list.remove(index); }
```
}
```

**Implementation in `Vector`:**

```java
public synchronized E remove(int index) {
``` 
modCount++;
if (index >= elementCount)
    throw new ArrayIndexOutOfBoundsException(index);
E oldValue = elementData(index);

int numMoved = elementCount - index - 1;
if (numMoved > 0)
    System.arraycopy(elementData, index+1, elementData, index, numMoved);
elementData[--elementCount] = null; // Let GC do its work

return oldValue;
```
}
```

Besides the synchronization mechanism (method vs. block), there is almost no difference in the `remove` logic.

> By comparing other methods, we find that `SynchronizedList` mostly wraps the `List` methods within synchronized blocks. If the underlying `List` is an `ArrayList`, the most visible difference between `SynchronizedList` and `Vector` is the choice between synchronized blocks and synchronized methods.

## 2. Analysis of Differences

### Data Growth
`ArrayList` and `Vector` both use internal arrays. When elements exceed the current capacity, the array is resized. By default, `Vector` doubles its size, while `ArrayList` grows by 50%. Thus, `Vector` might be slightly more efficient if you need to store large amounts of data and want to minimize resizing by setting an initial capacity.

### Synchronized Blocks vs. Synchronized Methods
1.  **Scope**: Synchronized blocks can lock a smaller range of code than synchronized methods. Generally, a smaller lock scope leads to better performance.
2.  **Precision**: Blocks allow more precise control over the lock's duration.
3.  **Target Object**: Blocks can lock any object, while instance methods always lock `this`.

> Since `SynchronizedList` simply wraps `ArrayList` methods, and the logic is similar to `Vector`, there isn't a significant difference in locking scope. However, `SynchronizedList` locks a `mutex` object, while `Vector` locks `this`. You can pass a custom object to the `SynchronizedList` constructor to use as the lock; otherwise, it defaults to `this`.

## 3. Key Conclusions

There are a few more important points:
1.  **Iteration**: In `SynchronizedList`, methods like `listIterator()` are **not** synchronized. You must synchronize manually when iterating. `Vector`, however, has method-level locks for these.
2.  **Flexibility**: This is the biggest advantage of `SynchronizedList`. It can make **any** `List` implementation (like `LinkedList`) thread-safe without changing its underlying data structure. `Vector` is tied to an array implementation.

### Summary of Differences:
1.  **Extensibility**: `SynchronizedList` can wrap any `List` subclass to make it thread-safe.
2.  **Manual Synchronization**: You must manually synchronize when iterating over a `SynchronizedList`.
3.  **Locking Object**: `SynchronizedList` allows you to specify the object used for locking.
