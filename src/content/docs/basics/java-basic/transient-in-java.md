---
title: "Transient In Java"
---

While studying Java collection classes, we find that both `ArrayList` and `Vector` are implemented with arrays. However, the `elementData` attribute differs in its definition: `ArrayList` uses the `transient` keyword.

```java
private transient Object[] elementData;  
protected Object[] elementData;  
```

So, what is the role of the `transient` keyword?

### transient

> `transient` is a keyword and variable modifier in Java. When an instance variable is declared with `transient`, its value is not maintained when the object is stored. In this context, "object storage" refers to the persistence mechanism provided by Java serialization. When an object is serialized, the values of `transient` variables are excluded from the serialized state, whereas non-transient variables are included. 
> 
> Use case: When persisting an object, you might have a specific data member that you do not want to save via serialization. To disable serialization for a specific field, you add the `transient` keyword before it.

Simply put, a member variable modified by `transient` will be ignored during serialization. Upon deserialization, the `transient` variable is set to its default value (e.g., `0` for `int`, `null` for object types).
