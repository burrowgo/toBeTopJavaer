---
title: "Value Of Vs To String"
---

We have three ways to convert an `int` type variable into a `String` type. What are the differences between them?

```java
1. int i = 5;
2. String i1 = "" + i;
3. String i2 = String.valueOf(i);
4. String i3 = Integer.toString(i);
```

There is no difference between the third and fourth lines because `String.valueOf(i)` is implemented by calling `Integer.toString(i)`.

The second line of code is actually `String i1 = (new StringBuilder()).append(i).toString();`. It first creates a `StringBuilder` object, then calls the `append` method, and finally calls the `toString` method.
