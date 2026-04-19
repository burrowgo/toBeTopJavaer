---
title: "Stop Using Equlas In Bigdecimal"
---

```java
`BigDecimal` is familiar to many; many know its usage as a type provided in the `java.math` package for precise calculations.
```

It is well known that in scenarios such as amount representation and calculation, types like `double` and `float` should not be used; instead, `BigDecimal`, which supports precision better, should be used.

Thus, in many businesses like payment, e-commerce, and finance, the use of `BigDecimal` is very frequent. It's a very useful class with many built-in methods for operations like addition, subtraction, multiplication, and division.

Besides using `BigDecimal` for numbers and arithmetic, code often needs to check for equality.

This point is also explained in the latest "Alibaba Java Development Manual":

![][1]

What is the thinking behind this?

In previous CodeReviews, I've seen low-level mistakes like:

```java
if(bigDecimal == bigDecimal1){
``` 
// Two numbers are equal
```
}
```

This error is obvious because **`BigDecimal` is an object, so `==` cannot be used to judge if the values of two numbers are equal.**

After some experience, such issues can be avoided, but consider this line:

```java
if(bigDecimal.equals(bigDecimal1)){
``` 
// Two numbers are equal
```
}
```

It can be clearly stated that this writing may give results different from what you expect!

Let's do an experiment:

```java
BigDecimal bigDecimal = new BigDecimal(1);
BigDecimal bigDecimal1 = new BigDecimal(1);
System.out.println(bigDecimal.equals(bigDecimal1));
    
BigDecimal bigDecimal2 = new BigDecimal(1);
BigDecimal bigDecimal3 = new BigDecimal(1.0);
System.out.println(bigDecimal2.equals(bigDecimal3));
    
BigDecimal bigDecimal4 = new BigDecimal("1");
BigDecimal bigDecimal5 = new BigDecimal("1.0");
System.out.println(bigDecimal4.equals(bigDecimal5));
```

Results:

```
true
true
false
```

### Principle of BigDecimal's equals

We found that when using `BigDecimal.equals` to compare `1` and `1.0`, it is sometimes `true` (when using `int` or `double`) and sometimes `false` (when using `String`). Why?

The JavaDoc for `BigDecimal` explains:

> Compares this BigDecimal with the specified Object for equality. Unlike compareTo, this method considers two BigDecimal objects equal only if they are equal in value and scale (thus 2.0 is not equal to 2.00 when compared by this method)

**`equals` is not the same as `compareTo`; `equals` compares two parts: value and scale.**

Corresponding code is as follows:

![][2]

Thus, `bigDecimal4` and `bigDecimal5` defined with `String` have different scales, so `equals` is `false`. Debugging reveals `bigDecimal4` scale is 0 and `bigDecimal5` is 1.

![][3]

### Why are the scales different?

This involves `BigDecimal`'s scale issue. It's complex, so here's a simple introduction.

There are 4 constructors:
- `BigDecimal(int)`
- `BigDecimal(double)`
- `BigDecimal(long)`
- `BigDecimal(String)`

These four methods create `BigDecimal`s with different scales.

#### BigDecimal(long) and BigDecimal(int)
Scales are 0 for integers.

#### BigDecimal(double)
When using `new BigDecimal(0.1)`, the created value isn't exactly `0.1`, but an approximation due to how `double` works. `new BigDecimal(1.0)` is essentially an integer, so its scale is 0.

#### BigDecimal(String)
`new BigDecimal("0.1")` creates exactly `0.1`, scale is 1. `new BigDecimal("1.0")` scale is 1, `new BigDecimal("1.00")` scale is 2. Thus `equals` is `false`.

### How to compare BigDecimal

If you only want to check if values are equal, use `compareTo`. It returns 0 if values are equal.

```java
BigDecimal bigDecimal4 = new BigDecimal("1");
BigDecimal bigDecimal5 = new BigDecimal("1.0000");
System.out.println(bigDecimal4.compareTo(bigDecimal5));
```

Result: `0`

### Summary
`BigDecimal.equals` should be used with caution because it compares both value and scale. Use `compareTo` for numerical value comparison.

 [1]: https://www.hollischuang.com/wp-content/uploads/2020/09/16004945569932.jpg
 [2]: https://www.hollischuang.com/wp-content/uploads/2020/09/16004955317132.jpg
 [3]: https://www.hollischuang.com/wp-content/uploads/2020/09/16004956382289.jpg
 [4]: https://www.hollischuang.com/wp-content/uploads/2020/09/16004965161081.jpg
 [5]: https://www.hollischuang.com/wp-content/uploads/2020/09/16004972460075.jpg
