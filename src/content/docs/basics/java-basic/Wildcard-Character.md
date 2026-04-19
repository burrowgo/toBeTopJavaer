---
title: "Wildcard Character"
---

`Bounded Wildcards` place restrictions on types. There are two types of bounded wildcards in generics:

`<? extends T>` represents the upper bound of a type, meaning the type must be T or a subclass of T.
`<? super T>` represents the lower bound of a type, meaning the type must be T or a superclass of T.

Generic types must be initialized with a type within the bounds; otherwise, it will lead to a compilation error.

`Unbounded Wildcards` indicate that any generic type can be used, represented as `<?>`.