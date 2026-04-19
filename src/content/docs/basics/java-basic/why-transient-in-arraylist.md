---
title: "Why Transient In Arraylist"
---

`ArrayList` uses the `transient` keyword for storage optimization, while `Vector` does not. Why?

### ArrayList

```java
/** 
 * Save the state of the <tt>ArrayList</tt> instance to a stream (that 
 * is, serialize it). 
 * 
 * @serialData The length of the array backing the <tt>ArrayList</tt> 
 *             instance is emitted (int), followed by all of its elements 
 *             (each an <tt>Object</tt>) in the proper order. 
 */  
private void writeObject(java.io.ObjectOutputStream s)  
``` 
throws java.io.IOException{  
// Write out element count, and any hidden stuff  
int expectedModCount = modCount;  
s.defaultWriteObject();  

// Write out array length  
s.writeInt(elementData.length);  

// Write out all elements in the proper order.  
for (int i=0; i<size; i++)  
    s.writeObject(elementData[i]);  

if (modCount != expectedModCount) {  
    throw new ConcurrentModificationException();  
}  
```
}  
```

ArrayList implements the `writeObject` method. As seen, it only saves the data at non-null positions in the array, i.e., `elementData` up to the `size` of the list. One point to note is that the implementation of ArrayList provides a fail-fast mechanism, offering weak consistency.

### Vector

```java
/**
 * Save the state of the {@code Vector} instance to a stream (that
 * is, serialize it).
 * This method performs synchronization to ensure the consistency
 * of the serialized data.
 */
private void writeObject(java.io.ObjectOutputStream s)
        throws java.io.IOException {
``` 
final java.io.ObjectOutputStream.PutField fields = s.putFields();
final Object[] data;
synchronized (this) {
    fields.put("capacityIncrement", capacityIncrement);
    fields.put("elementCount", elementCount);
    data = elementData.clone();
}
fields.put("elementData", data);
s.writeFields();
```
}
```

Vector also implements the `writeObject` method, but it does not optimize storage like ArrayList. The implementation statement is:

`data = elementData.clone();`

When `clone()` is called, null values are also copied. Therefore, a Vector storing the same content as an ArrayList will occupy more bytes than the ArrayList.

You can test this by serializing a Vector and an ArrayList with the same content into text files:
* Vector requires 243 bytes
* ArrayList requires 135 bytes

**Analysis:**

ArrayList is a more efficient data structure (compared to Vector) for single-threaded environments because it is not synchronized. It provides weak consistency through a modification record field (`modCount`), mainly used in iterators, without synchronized methods. This is the fail-fast mechanism mentioned above. The storage structure of ArrayList is defined as `transient`, and `writeObject` is overridden to implement custom serialization, optimizing storage.

Vector is a more reliable data structure in multi-threaded environments, with all methods being synchronized.

### Differences

> **Synchronization:** Vector is synchronized, while ArrayList is not.
> **Expansion:** By default, Vector doubles the length of the array, while ArrayList increases it by 50%.
> ArrayList: `int newCapacity = oldCapacity + (oldCapacity >> 1);`
> ArrayList automatically expands its capacity to 1.5 times the original. During implementation, the method receives an expected minimum capacity; if the expanded capacity is still smaller than the minimum, it becomes the minimum capacity. The `Arrays.copyOf` method used during expansion eventually calls a native method for new array creation and data copying.
>  
> Vector: `int newCapacity = oldCapacity + ((capacityIncrement > 0) ? capacityIncrement : oldCapacity);`
> If `initialCapacity` and `capacityIncrement` are specified for Vector initialization, it grows by `capacityIncrement` each time.