---
title: "Diff Serializable Vs Externalizable"
---

Classes in Java enable their serialization functionality by implementing the `java.io.Serializable` interface. Classes that do not implement this interface will not be able to have any of their state serialized or deserialized.

All subtypes of a serializable class are themselves serializable.

The serialization interface has no methods or fields and is only used to identify the semantics of being serializable.

When attempting to serialize an object, if an object that does not support the `Serializable` interface is encountered, a `NotSerializableException` will be thrown.

If the class to be serialized has a parent class, and you want to persist variables defined in the parent class as well, then the parent class should also implement the `java.io.Serializable` interface.

`Externalizable` inherits from `Serializable`. This interface defines two abstract methods: `writeExternal()` and `readExternal()`. When using the `Externalizable` interface for serialization and deserialization, developers need to override the `writeExternal()` and `readExternal()` methods.

If serialization implementation details are not defined in these two methods, then after serialization, the object content will be empty.

Classes implementing the `Externalizable` interface must provide a `public` no-argument constructor.

Therefore, implementing `Externalizable` and providing implementations for `writeExternal()` and `readExternal()` methods allows you to specify which attributes should be serialized.
