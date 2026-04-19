---
title: "Runtime Constant Pool"
---

The Runtime Constant Pool is a runtime representation of each class or interface's `Constant_Pool`.

It includes several different types of constants: from numeric literals known at compile time to method or field references that must be resolved at runtime. The runtime constant pool plays a role similar to a symbol table in traditional languages, although the range of data it stores is broader than that of a symbol table in the usual sense.

Each runtime constant pool is allocated within the Java Virtual Machine's method area. After the class and interface are loaded into the virtual machine, the corresponding runtime constant pool is created.

The above is the definition of the runtime constant pool in the Java Virtual Machine specification.

### Implementation of the Runtime Constant Pool in Various JDK Versions

According to the Java Virtual Machine specification: each runtime constant pool is allocated in the Java Virtual Machine's method area. After loading classes and interfaces into the virtual machine, the corresponding runtime constant pool is created.

In different versions of the JDK, the location of the runtime constant pool is also different. Taking HotSpot as an example:

Before JDK 1.7, the method area was located in the permanent generation (PermGen) of the heap memory. As part of the method area, the runtime constant pool was also in the permanent generation.

Since using the permanent generation to implement the method area might lead to memory leak problems, the JVM began trying to solve this problem starting from JDK 1.7. In JDK 1.7, the runtime constant pool originally in the permanent generation was moved to the heap memory. (The permanent generation was not completely removed in JDK 1.7; only the runtime constant pool and static variables of the class in the original method area were moved to the heap memory.)

In JDK 1.8, the permanent generation was completely removed, and the method area was implemented through Metaspace. Along with it, the runtime constant pool is also implemented in Metaspace.

### Source of Constants in the Runtime Constant Pool

The runtime constant pool contains several different types of constants:

- Literals and symbolic references known at compile time (from the Class constant pool).
- Constants obtained after runtime resolution (such as the `intern` method of `String`).

Therefore, the content of the runtime constant pool includes: constants in the Class constant pool and the content in the string constant pool.

### Differences and Connections Between the Runtime Constant Pool, Class Constant Pool, and String Constant Pool

During the virtual machine startup process, the constant pools in each Class file are loaded into the runtime constant pool.

Therefore, the Class constant pool is just a medium. When the JVM is actually running, it needs to load the constants in the constant pool into the memory and enter the runtime constant pool.

The string constant pool can be understood as a part separated from the runtime constant pool. When loading, for the static constant pool of the class, if there are strings, they will be loaded into the string constant pool.
