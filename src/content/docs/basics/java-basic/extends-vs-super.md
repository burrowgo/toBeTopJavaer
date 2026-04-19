---
title: "Extends Vs Super"
---

`<? extends T>` and `<? super T>` are concepts of "wildcards" and "bounds" in Java generics.

`<? extends T>`: Refers to "Upper Bounded Wildcards," meaning the class in the generic must be a subclass of the current class or the current class itself.

`<? super T>`: Refers to "Lower Bounded Wildcards," meaning the class in the generic must be the current class or its parent class.

Let's look at an example:

```java
public class Food {}
public class Fruit extends Food {}
public class Apple extends Fruit {}
public class Banana extends Fruit{}

public class GenericTest {

``` java
```java
public void testExtends(List<? extends Fruit> list){
```

    // Error: extends is an upper bound wildcard, you can only get values, not put them.
    // Because subclasses of Fruit include not only Apple but also Banana, it cannot be determined whether the specific generic is Apple or Banana. Therefore, putting either type will result in an error.
    // list.add(new Apple());

    // Can get normally
    Fruit fruit = list.get(1);
}

```java
public void testSuper(List<? super Fruit> list){
```

    // super is a lower bound wildcard, you can store elements, but only instances of the current class or its subclasses.
    // In this example, it cannot be determined whether the parent class of Fruit is only Food (Object is the super parent class).
    // Therefore, putting an instance of Food will not compile.
    list.add(new Apple());
```
//        list.add(new Food());

        Object object = list.get(1);
``` 
}
```
}
```

In the `testExtends` method, because `extends` is used in the generic, when storing elements in the list, we cannot determine the specific type of the elements in the `List` (e.g., it could be `Apple` or `Banana`). Therefore, when calling the `add` method, a compilation error will occur regardless of whether `new Apple()` or `new Banana()` is passed.

After understanding `extends`, `super` is easy to understand. We cannot determine which parent class of `Fruit` the generic in the parameters of the `testSuper` method is. Therefore, when calling the `get` method, only the `Object` type can be returned. Combined with `extends`, it can be seen that when obtaining generic elements, using `extends` gets the type of the upper bound in the generic (in this example, `Fruit`), which has a smaller range.

When using generics, use `super` when storing elements and `extends` when obtaining elements.

For frequent reading, use the upper bound `extends`. For frequent insertion, use the lower bound `super`.

This article is from: https://juejin.im/post/5c653fe06fb9a049e3089d88
