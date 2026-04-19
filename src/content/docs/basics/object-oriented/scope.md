---
title: "Scope"
---

We use encapsulation to wrap member variables, methods, etc., in a class. So, can these member variables and methods encapsulated in the class be accessed externally? Who can access them?

This characteristic of whether they can be accessed and who can access them is implemented in Java through access control modifiers. In Java, access control modifiers can be used to protect access to classes, variables, methods, and constructors. Java supports 4 different access permissions.

Regarding the scope of member variables and methods, the differences between `public`, `protected`, `private`, and not writing anything (default):


`public` : Indicates that the member variable or method is visible to all classes or objects. All classes or objects can access it directly.

`private` : Indicates that the member variable or method is private. Only the current class has access to it. Other than that, no other classes or objects have access permission. Subclasses also have no access permission.

`protected` : Indicates that the member variable or method is visible to the class itself and other classes in the same package. Classes in other packages cannot access it unless it is a subclass.

`default` : Indicates that the member variable or method is visible only to itself and those located in the same package. Classes in other packages cannot access it, even its subclasses.
