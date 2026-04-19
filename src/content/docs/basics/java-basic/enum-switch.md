---
title: "Enum Switch"
---

Before Java 1.7, the available types for switch parameters were short, byte, int, char, and the reason why enumeration types can be used is actually implemented at the compiler level.

The compiler will convert the enumeration switch into something like:

```
switch(s.ordinal()) { 
``` 
case Status.START.ordinal() 
```
}
```

form, so it is essentially still an int parameter type. Those who are interested can write a switch code using enumerations themselves and then look at the bytecode through `javap -v` to understand.
