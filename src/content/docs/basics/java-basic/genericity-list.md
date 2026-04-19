---
title: "Genericity List"
---

The main difference between the raw type `List` and the parameterized type `List<Object>` is that at compile time, the compiler does not perform type safety checks on the raw type, but it does check the parameterized type.

By using `Object` as the type, you inform the compiler that the method can accept an object of any type, such as `String` or `Integer`.

The second difference between them is that you can pass any parameterized type to the raw type `List`, but you cannot pass a `List<String>` to a method that accepts `List<Object>`, as this will cause a compilation error.
