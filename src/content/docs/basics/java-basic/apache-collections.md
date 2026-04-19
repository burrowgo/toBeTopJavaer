---
title: "Apache Collections"
---

Commons Collections enhances the Java Collections Framework. It provides several features that make collection handling easy. It offers many new interfaces, implementations, and utility classes. The main features of Commons Collections are as follows:

* Bag - The Bag interface simplifies collections where each object has multiple copies.

* BidiMap - The BidiMap interface provides bi-directional maps that can be used to look up values using keys or keys using values.

* MapIterator - The MapIterator interface provides simple and easy iteration over maps.

* Transforming Decorators - Transforming decorators can change each object in a collection as it is added to the collection.

* Composite Collections - Composite collections are used when multiple collections need to be handled uniformly.

* Ordered Map - Ordered maps maintain the order in which elements are added.

* Ordered Set - Ordered sets maintain the order in which elements are added.

* Reference map - Reference maps allow keys/values to be garbage collected under close control.

* Comparator implementations - Many Comparator implementations are available.

* Iterator implementations - Many Iterator implementations are available.

* Adapter Classes - Adapter classes can be used to convert arrays and enumerations into collections.

* Utilities - Utilities are available for testing or creating typical set-theory properties of collections, such as union and intersection. Supports closures.

### Commons Collections - Bag

A Bag defines a collection that counts the number of times an object appears in the set. For example, if a Bag contains {a, a, b, c}, then getCount("a") will return 2, and uniqueSet() will return the unique values.

```java
import org.apache.commons.collections4.Bag;
import org.apache.commons.collections4.bag.HashBag;
public class BagTester {
   public static void main(String[] args) {
      Bag<String> bag = new HashBag<>();
      //add "a" two times to the bag.
      bag.add("a" , 2);
      //add "b" one time to the bag.
      bag.add("b");
      //add "c" one time to the bag.
      bag.add("c");
      //add "d" three times to the bag.
      bag.add("d",3);
      //get the count of "d" present in bag.
      System.out.println("d is present " + bag.getCount("d") + " times.");
      System.out.println("bag: " +bag);
      //get the set of unique values from the bag
      System.out.println("Unique Set: " +bag.uniqueSet());
      //remove 2 occurrences of "d" from the bag
      bag.remove("d",2);
      System.out.println("2 occurences of d removed from bag: " +bag);
      System.out.println("d is present " + bag.getCount("d") + " times.");
      System.out.println("bag: " +bag);
      System.out.println("Unique Set: " +bag.uniqueSet());
   }
}
```

It will print the following results:

```
d is present 3 times.
bag: [2:a,1:b,1:c,3:d]
Unique Set: [a, b, c, d]
2 occurences of d removed from bag: [2:a,1:b,1:c,1:d]
d is present 1 times.
bag: [2:a,1:b,1:c,1:d]
Unique Set: [a, b, c, d]
```

### Commons Collections - BidiMap

With bi-directional maps, you can look up keys using values and easily look up values using keys.

```java
import org.apache.commons.collections4.BidiMap;
import org.apache.commons.collections4.bidimap.TreeBidiMap;
public class BidiMapTester {
   public static void main(String[] args) {
      BidiMap<String, String> bidi = new TreeBidiMap<>();
      bidi.put("One", "1");
      bidi.put("Two", "2");
      bidi.put("Three", "3");
      System.out.println(bidi.get("One")); 
      System.out.println(bidi.getKey("1"));
      System.out.println("Original Map: " + bidi);
      bidi.removeValue("1"); 
      System.out.println("Modified Map: " + bidi);
      BidiMap<String, String> inversedMap = bidi.inverseBidiMap();  
      System.out.println("Inversed Map: " + inversedMap);
   }
}
```

It will print the following results:
```
1
One
Original Map: {One=1, Three=3, Two=2}
Modified Map: {Three=3, Two=2}
Inversed Map: {2=Two, 3=Three}
```

### Commons Collections - MapIterator

The JDK Map interface is difficult to iterate over because iteration must be done on EntrySet or KeySet objects. MapIterator provides a simple iteration over Maps.

```java
import org.apache.commons.collections4.IterableMap;
import org.apache.commons.collections4.MapIterator;
import org.apache.commons.collections4.map.HashedMap;
public class MapIteratorTester {
   public static void main(String[] args) {
      IterableMap<String, String> map = new HashedMap<>();
      map.put("1", "One");
      map.put("2", "Two");
      map.put("3", "Three");
      map.put("4", "Four");
      map.put("5", "Five");
      MapIterator<String, String> iterator = map.mapIterator();
      while (iterator.hasNext()) {
         Object key = iterator.next();
         Object value = iterator.getValue();
         System.out.println("key: " + key);
         System.out.println("Value: " + value);
         iterator.setValue(value + "_");
      }
      System.out.println(map);
   }
}
```

It will print the following results:
```
key: 3
Value: Three
key: 5
Value: Five
key: 2
Value: Two
key: 4
Value: Four
key: 1
Value: One
{3=Three_, 5=Five_, 2=Two_, 4=Four_, 1=One_}
```

### Commons Collections - OrderedMap

OrderedMap is a new interface for maps that preserves the order in which elements are added. LinkedMap and ListOrderedMap are two available implementations. This interface supports Map iterators and allows bi-directional iteration (forward or backward) in the Map.

```java
import org.apache.commons.collections4.OrderedMap;
import org.apache.commons.collections4.map.LinkedMap;
public class OrderedMapTester {
   public static void main(String[] args) {
      OrderedMap<String, String> map = new LinkedMap<String, String>();
      map.put("One", "1");
      map.put("Two", "2");
      map.put("Three", "3");
      System.out.println(map.firstKey());
      System.out.println(map.nextKey("One"));
      System.out.println(map.nextKey("Two"));  
   }
}
```

It will print the following results:

```
One
Two
Three
```

### Commons Collections - Ignore NULL

The CollectionUtils class of the Apache Commons Collections library provides various utility methods for common operations, covering a wide range of use cases. It helps avoid writing boilerplate code. This library was very useful before JDK 8, as Java 8's Stream API now provides similar functionality.

```java
import java.util.LinkedList;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      List<String> list = new LinkedList<String>();
      CollectionUtils.addIgnoreNull(list, null);
      CollectionUtils.addIgnoreNull(list, "a");
      System.out.println(list);
      if(list.contains(null)) {
         System.out.println("Null value is present");
      } else {
         System.out.println("Null value is not present");
      }
   }
}
```

It will print the following results:
```
[a]
Null value is not present
```

### Merge & Sort

The CollectionUtils class of the Apache Commons Collections library provides various utility methods for common operations, covering a wide range of use cases. It helps avoid writing boilerplate code. This library was very useful before JDK 8, as Java 8's Stream API now provides similar functionality.

```java
import java.util.Arrays;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      List<String> sortedList1 = Arrays.asList("A","C","E");
      List<String> sortedList2 = Arrays.asList("B","D","F");
      List<String> mergedList = CollectionUtils.collate(sortedList1, sortedList2);
      System.out.println(mergedList); 
   }
}
```

It will print the following results:
```
[A, B, C, D, E, F]
```

### Safe Empty Checks

The CollectionUtils class of the Apache Commons Collections library provides various utility methods for common operations, covering a wide range of use cases. It helps avoid writing boilerplate code. This library was very useful before JDK 8, as Java 8's Stream API now provides similar functionality.

```java
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      List<String> list = getList();
      System.out.println("Non-Empty List Check: " + checkNotEmpty1(list));
      System.out.println("Non-Empty List Check: " + checkNotEmpty1(list));
   }
   static List<String> getList() {
      return null;
   } 
   static boolean checkNotEmpty1(List<String> list) {
      return !(list == null || list.isEmpty());
   }
   static boolean checkNotEmpty2(List<String> list) {
      return CollectionUtils.isNotEmpty(list);
   } 
}
```

It will print the following results:
```
Non-Empty List Check: false
Non-Empty List Check: false
```

### Commons Collections - Inclusion

Check if a list is part of another list.

```java
import java.util.Arrays;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      //checking inclusion
      List<String> list1 = Arrays.asList("A","A","A","C","B","B");
      List<String> list2 = Arrays.asList("A","A","B","B");
      System.out.println("List 1: " + list1);
      System.out.println("List 2: " + list2);
      System.out.println("Is List 2 contained in List 1: " 
         + CollectionUtils.isSubCollection(list2, list1));
   }
}
```

It will print the following results:

```
List 1: [A, A, A, C, B, B]
List 2: [A, A, B, B]
Is List 2 contained in List 1: true
```

### Commons Collections - Intersection

Used to get the common objects between two sets (intersection).

```java
import java.util.Arrays;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      //checking inclusion
      List<String> list1 = Arrays.asList("A","A","A","C","B","B");
      List<String> list2 = Arrays.asList("A","A","B","B");
      System.out.println("List 1: " + list1);
      System.out.println("List 2: " + list2);
      System.out.println("Commons Objects of List 1 and List 2: " 
         + CollectionUtils.intersection(list1, list2));
   }
}
```

It will print the following results:

```
List 1: [A, A, A, C, B, B]
List 2: [A, A, B, B]
Commons Objects of List 1 and List 2: [A, A, B, B]
```

### Commons Collections - Subtraction
Get a new collection by subtracting objects of one collection from another collection.

```java
import java.util.Arrays;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      //checking inclusion
      List<String> list1 = Arrays.asList("A","A","A","C","B","B");
      List<String> list2 = Arrays.asList("A","A","B","B");
      System.out.println("List 1: " + list1);
      System.out.println("List 2: " + list2);
      System.out.println("List 1 - List 2: " 
         + CollectionUtils.subtract(list1, list2));
   }
}
```

It will print the following results:
```
List 1: [A, A, A, C, B, B]
List 2: [A, A, B, B]
List 1 - List 2: [A, C]
```

### Commons Collections - Union

Used to get the union of two collections.

```java
import java.util.Arrays;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
public class CollectionUtilsTester {
   public static void main(String[] args) {
      //checking inclusion
      List<String> list1 = Arrays.asList("A","A","A","C","B","B");
      List<String> list2 = Arrays.asList("A","A","B","B");
      System.out.println("List 1: " + list1);
      System.out.println("List 2: " + list2);
      System.out.println("Union of List 1 and List 2: " 
         + CollectionUtils.union(list1, list2));
   }
}
```

It will print the following results:
```
List 1: [A, A, A, C, B, B]
List 2: [A, A, B, B]
Union of List 1 and List 2: [A, A, A, B, B, C]
```

Original address: https://iowiki.com/commons_collections/commons_collections_index.html