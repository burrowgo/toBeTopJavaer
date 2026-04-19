---
title: "Class"
---

The Java Class class is the foundation of the Java reflection mechanism. Through the Class class, we can obtain information about a class.

java.lang.Class is a special class used to encapsulate information about classes (including classes and interfaces) loaded into the JVM. When a class or interface is loaded into the JVM, an associated java.lang.Class object is created, which can be used to access detailed information about the loaded class.

The virtual machine manages a unique Class object for each type. That is, every class (type) has a Class object. When running a program, the Java Virtual Machine (JVM) first checks whether the Class object corresponding to the class to be loaded has already been loaded. If not, the JVM searches for the .class file based on the class name and loads its Class object.
