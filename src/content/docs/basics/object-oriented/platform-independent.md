---
title: "Platform Independent"
---

I believe for many Java developers, when they first encountered the Java language, they heard that Java is a cross-platform language, and Java is platform-independent. This is also an important reason why the Java language could rise rapidly and be infinitely glorious. So, what exactly is platform independence? And how does Java achieve platform independence? This article briefly introduces it.

### What is Platform Independence

Platform independence means that the running of a language on a computer is not constrained by the platform: compile once, run anywhere (Write Once, Run Anywhere).

That is to say, executable binary programs created with Java can not be run on multiple platforms without change.

#### Benefits of Platform Independence

As a platform-independent language, Java is very prominent in its own development and user-friendliness for developers.

Because of its platform independence, Java programs can run on a variety of devices, especially some embedded devices such as printers, scanners, fax machines, etc. With the advent of the 5G era, more terminals will access the network, and it is believed that platform-independent Java can also make some contributions.

For Java developers, Java reduces the cost and time of developing and deploying to multiple platforms. Truly achieving compile once, run anywhere.

### Implementation of Platform Independence

Support for Java's platform independence, like support for security and network mobility, is distributed throughout the Java architecture. Important roles are played by the Java Language Specification, Class files, Java Virtual Machine (JVM), etc.

#### Basics of Compilation Principles

When talking about the Java Language Specification, Class files, and the Java Virtual Machine, it is necessary to mention how Java actually runs.

We introduced in [Java Code Compilation and Decompilation][1] that in the computer world, computers only know 0 and 1. So, what is truly executed by the computer is actually binary files composed of 0s and 1s.

However, the C, C++, Java, Python, etc. we use for daily development all belong to high-level languages rather than binary languages. Therefore, to make the computer understand the Java code we write, we need to "translate" it into binary files composed of 0s and 1s. This process is called compilation. The tool responsible for processing this process is called a compiler.

In [Deep Analysis of Java's Compilation Principles][2], we introduced that in the Java platform, to compile Java files into binary files, two steps of compilation are required: frontend compilation and backend compilation:

![][3]

Frontend compilation mainly refers to the part related to the source language but independent of the target machine. In Java, the compilation of `javac` that we are familiar with is frontend compilation. In addition to this, many IDEs we use, such as Eclipse and IDEA, have built-in frontend compilers. The main function is to convert `.java` code into `.class` code.

The `.class` code mentioned here is actually the Class file.

Backend compilation mainly translates intermediate code into machine language. In Java, this step is performed by the Java Virtual Machine.

![][4]

Therefore, the implementation of Java's platform independence mainly acts on the above stages. As shown in the figure below:

![][5]

We introduce these three "actors" from back to front: Java Virtual Machine, Class files, and Java Language Specification.

**Java Virtual Machine**

The so-called platform independence means being able to achieve seamless connection on multiple platforms. However, for different platforms, hardware and operating systems are certainly different.

For different hardware and operating systems, the main difference is different instructions. For example, to execute a+b, the binary instruction corresponding to operating system A might be 10001000, while the instruction corresponding to operating system B might be 11101110. Then, to achieve cross-platform, the most important thing is to be able to generate corresponding binary instructions according to the corresponding hardware and operating system.

This work is mainly completed by our Java Virtual Machine. Although the Java language is platform-independent, the JVM is platform-dependent. Corresponding JVMs need to be installed on different operating systems.

![][6]

The figure above is the guide for downloading JDK from Oracle's official website. Different operating systems need to download corresponding Java Virtual Machines.

With the Java Virtual Machine, to execute the a+b operation, the virtual machine on operating system A will translate the instruction into 10001000, and the virtual machine on operating system B will translate the instruction into 11101110.

![][7] ps: The content in the Class file in the figure is mock content.

Therefore, the reason why Java can achieve cross-platform is that the Java Virtual Machine acts as a bridge. It acts as a buffer between the runtime Java program and its underlying hardware and operating system.

#### Bytecode

Virtual machines on various platforms use a unified program storage format - bytecode (ByteCode) is another cornerstone of platform independence. The Java Virtual Machine only interacts with Class files composed of bytecode.

We say the Java language can Write Once, Run Anywhere. Here "Write" actually refers to the process of generating Class files.

Because Java Class files can be created on any platform and can also be loaded and executed by the Java Virtual Machine of any platform, Java has platform independence.

#### Java Language Specification

With unified Class files and Java Virtual Machines that can translate Class files into corresponding binary files on different platforms, can Java completely achieve cross-platform?

In fact, it's not quite that simple. The Java language has also made some efforts in cross-platform, and these efforts are defined in the Java Language Specification.

For example, the value range and behavior of basic data types in Java are defined by itself. In C/C++, basic data types are determined by their width, which is determined by the platform. Therefore, on different platforms, different behaviors will occur for the compilation results of the same C++ program.

To give a simple example, for the int type, in Java, int occupies 4 bytes, which is fixed.

But in C++, it's not fixed. On a 16-bit computer, the length of the int type might be two bytes; on a 32-bit computer, it might be 4 bytes; when 64-bit computers become popular, the length of the int type might reach 8 bytes. (Everything said here is "might"!)

![][8]

By ensuring the consistency of basic data types across all platforms, the Java language provides strong support for platform independence.

### Summary

Support for Java's platform independence is distributed throughout the Java architecture. Important roles are played by the Java Language Specification, Class files, Java Virtual Machine, etc.

* Java Language Specification 
 * By specifying the range and behavior of basic data types in the Java language.
* Class File 
 * All Java files must be compiled into unified Class files.
* Java Virtual Machine 
 * Translate Class files into binary files of the corresponding platform through the Java Virtual Machine.

Java's platform independence is built on the platform dependence of the Java Virtual Machine, because the Java Virtual Machine shields the differences in underlying operating systems and hardware.

### Language Independence

In fact, Java's independence is not only reflected in platform independence. Extending outward, Java also has language independence.

As we mentioned before, the JVM doesn't actually interact with Java files, but with Class files. That is to say, when the JVM runs, it doesn't actually depend on the Java language.

Up to now, commercial and open-source organizations have developed a large number of languages that can run on the JVM besides the Java language, such as Groovy, Scala, Jython, etc. The reason why they can be supported is that these languages can also be compiled into bytecode (Class files). And the virtual machine doesn't care from which language the bytecode is compiled. For details, see [Awesome, Teach You to Output HelloWorld in Nine Languages on JVM][9].

References

"Inside the Java Virtual Machine (Second Edition)" "Inside the Java Virtual Machine" "The Java Language Specification, Java SE 8 Edition" "The Java Virtual Machine Specification, Java SE 8 Edition"

 [1]: http://www.hollischuang.com/archives/58
 [2]: https://www.hollischuang.com/archives/2322
 [3]: https://www.hollischuang.com/wp-content/uploads/2019/03/15539284762449.jpg
 [4]: https://www.hollischuang.com/wp-content/uploads/2019/03/15539289530245.jpg
 [5]: https://www.hollischuang.com/wp-content/uploads/2019/03/15539291533175.jpg
 [6]: https://www.hollischuang.com/wp-content/uploads/2019/03/15539297082025.jpg
 [7]: https://www.hollischuang.com/wp-content/uploads/2019/03/15539303829914.jpg
 [8]: https://www.hollischuang.com/wp-content/uploads/2021/06/Jietu20210627-141259-2.jpg
 [9]: https://www.hollischuang.com/archives/2938
