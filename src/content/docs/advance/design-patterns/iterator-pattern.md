---
title: "Iterator Pattern"
---

## Concept

Many people may feel unfamiliar when they mention the Iterator Pattern. However, in fact, the Iterator Pattern is the simplest and most commonly used design pattern among all design patterns. Because it is so common, many people overlook its existence.

> The Iterator Pattern provides a way to access each element in a container without exposing the internal details of the object.

So, what is the container mentioned here? It is actually a data structure that can contain a group of objects, such as `Collection` and `Set` in Java.

## Usage

From the concept of the Iterator Pattern, we can also see that an important use of the Iterator Pattern is to help us traverse containers. Take List as an example. If we want to traverse it, there are usually the following ways:

        for (int i = 0; i < list.size(); i++) {
            System.out.print(list.get(i) + ",");
        }
    
        Iterator iterator = list.iterator();
        while (iterator.hasNext()) {
            System.out.print(iterator.next() + ",");
        }
    
        for (Integer i : list) {
            System.out.print(i + ",");
        }
    

In fact, both the second and [third][2] ways are implemented based on the Iterator Pattern. This article focuses on introducing the Iterator Pattern, so we will not introduce the built-in iterator in Java for now. We will try to implement the Iterator Pattern ourselves, which will help us thoroughly understand the Iterator Pattern.

## Implementation

The Iterator Pattern includes the following roles:

> Iterator: Abstract iterator
> 
> ConcreteIterator: Concrete iterator
> 
> Aggregate: Abstract container
> 
> ConcreteAggregate: Concrete container

[<img src="http://www.hollischuang.com/wp-content/uploads/2017/02/iterator.jpg" alt="iterator" width="542" height="287" class="aligncenter size-full wp-image-1767" />][3]

Here we give an example of a menu. We have a menu, and we want to display the names and price information of all dishes in the menu.

First define the abstract iterator:

``` java
public interface Iterator<E> {
    
    boolean hasNext();
    
    E next();
    
    default void remove() {
        throw new UnsupportedOperationException("remove");
    }
}
```
    

The iterator here provides three methods, including the hasNext method, the next method, and the remove method.

> hasNext: Returns whether there are still unvisited elements in the iterator.
> 
> next: Returns the next element in the iterator.

Define a concrete iterator:

``` java
public class MenuIterator implements Iterator {
    
    String[] foods;
    int      position = 0;
    
    public MenuIterator(String[] foods){
        this.foods = foods;
    }
    
    @Override
    public boolean hasNext() {
    
        return position != foods.length;
    }
    
    @Override
    public Object next() {
        String food = foods[position];
        position += 1;
        return food;
    }
}
```
    

This concrete class implements the Iterator interface and its methods. The specific implementation is not detailed (please ignore thread safety issues).

Next, define an abstract container:

``` java
/**
 * Created by hollis on 17/2/18.
 */
public interface Menu {
    
    void add(String name);
    
    Iterator getIterator();
}
```
    

Here a menu interface is defined, which only provides two methods: an add method and a getIterator method, used to return an iterator.

Then define a concrete container to implement the Menu interface:

``` java
public class ChineseFoodMenu implements Menu {
    
    private String[] foods    = new String[4];
    private int      position = 0;
    
    @Override
    public void add(String name) {
        foods[position] = name;
        position += 1;
    }
    
    @Override
    public Iterator getIterator() {
        return new MenuIterator(this.foods);
    }
}
```
    

The implementation of this class is also relatively simple. So far, we have all the roles needed for an Iterator Pattern. Next, write a test class to see the specific use:

``` java
public class Main {
    
    public static void main(String[] args) {
        ChineseFoodMenu chineseFoodMenu = new ChineseFoodMenu();
        chineseFoodMenu.add("Kung Pao Chicken");
        chineseFoodMenu.add("Cumin Mutton");
        chineseFoodMenu.add("Boiled Fish");
        chineseFoodMenu.add("Peking Duck");
    
        Iterator iterator = chineseFoodMenu.getIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}
//output:
//Kung Pao Chicken
//Cumin Mutton
//Boiled Fish
//Peking Duck
```
    

We have implemented the traversal of a container (Menu) through the iterator way. The benefit of the iterator is that when we use Menu in the Main class, we don't know its underlying implementation at all, and only need to traverse it through the iterator.

## Summary

Iterators are widely used now because Java provides java.util.Iterator. Moreover, many containers (Collection, Set) in Java also provide support for iterators.

The Iterator Pattern can even be removed from the 23 design patterns because it has commonly become known as a tool.

Finally, the Iterator Pattern is very useful. This article introduces how to write the Iterator Pattern. However, if you are doing Java development, please use the Iterator provided by Java directly.

All code in the article can be found on [GitHub][4]

 [1]: http://www.hollischuang.com/archives/1691
 [2]: http://www.hollischuang.com/archives/1776
 [3]: http://www.hollischuang.com/wp-content/uploads/2017/02/iterator.jpg
 [4]: https://github.com/hollischuang/DesignPattern