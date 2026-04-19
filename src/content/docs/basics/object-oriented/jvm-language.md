---
title: "Jvm Language"
---

As we mentioned in "[Deep Analysis of Java Compilation Principles][1]", to give the Java language excellent cross-platform capabilities, Java ingeniously provides an intermediate code that can be used on all platforms - ByteCode.

With bytecode, any platform (such as Windows, Linux, etc.) can run it directly as long as a virtual machine is installed.

Similarly, bytecode decouples the Java Virtual Machine from the Java language. This might be hard for some to understand; isn't the Java Virtual Machine just for running the Java language? What does this decoupling mean?

Actually, the Java Virtual Machine now supports many languages besides Java, such as Kotlin, Groovy, JRuby, Jython, Scala, and more. This support is possible because these languages can also be compiled into bytecode. The virtual machine does not care which language the bytecode was compiled from.

Developers who frequently use IDEs might notice that when right-clicking to create a Java class in IntelliJ IDEA, the IDE also suggests creating other types of files. these are languages natively supported by the IDE that can run on the JVM. For those not suggested, support can be added via plugins.

<img src="https://www.hollischuang.com/wp-content/uploads/2018/11/languages.png" />

Currently, there are many languages that can run directly on the JVM. Today, we will introduce nine of the most important ones. Each language will be demonstrated with a "HelloWorld" code snippet to see how their syntaxes differ.

### Kotlin

Kotlin is a statically typed programming language that runs on the Java Virtual Machine and can also be compiled into JavaScript source code. Kotlin was designed for high-performance programs, so its performance is comparable to Java. Kotlin can be used as a plugin in the JetBrains IntelliJ IDEA IDE.

#### Hello World in Kotlin

```kotlin
fun main(args: Array<String>) {
``` 
println("Hello, world!")
```
}
```

### Groovy

Apache Groovy is an object-oriented programming language designed for the Java platform. Its syntax is very similar to Java's, allowing Java programmers to become proficient in Groovy quickly. In fact, the Groovy compiler can accept pure Java syntax.

A key feature of Groovy is type inference, which allows the compiler to deduce variable types when not explicitly stated by the programmer. Groovy can use libraries written in other Java languages. Its syntax is so similar to Java's that most Java code matches Groovy's rules, though the semantics might differ.

#### Hello World in Groovy

```groovy
static void main(String[] args) {
``` 
println('Hello, world!');
```
}
```

### Scala

Scala is a multi-paradigm programming language designed to integrate features of object-oriented and functional programming.

Scala is often described as a multi-model language because it blends elements from many programming languages. Regardless, it is fundamentally a pure object-oriented language. Its greatest advantage over traditional languages is the excellent framework it provides for parallel programming. Scala code is well-optimized into bytecode and runs as fast as native Java.

#### Hello World in Scala

```scala
object HelloWorld {
``` 
def main(args: Array[String]) {
   System.out.println("Hello, world!");
}
```
 }
```

### JRuby

JRuby bridges Java and Ruby. It uses a shorter syntax than Groovy, allowing each line of code to perform more tasks. Like Ruby, JRuby provides more than just high-level syntax; it also offers a pure object-oriented implementation, closures, and more. Compared to Ruby itself, JRuby can call many Java-based libraries. While Ruby has many libraries, it cannot match the quantity and breadth of the standard Java libraries.

#### Hello World in JRuby

```ruby
puts 'Hello, world!'
```

### Jython

Jython is a Python interpreter written in Java. It can efficiently generate dynamically compiled Java bytecode using the Python language.

#### Hello World in Jython

```py
print "Hello, world!"
```

### Fantom

Fantom is a general-purpose object-oriented programming language created by Brian and Andy Frank. It runs on the Java Runtime Environment, JavaScript, and the.NET Common Language Runtime. Its primary design goal is to provide a standard library API that abstracts away the question of whether the code will ultimately run on the JRE or CLR.

Fantom is an object-oriented language similar to Groovy and JRuby, but unfortunately, it cannot use Java libraries; instead, it uses its own extended libraries.

#### Hello World in Fantom

```fantom
class Hello {
``` 
static Void main() { echo("Hello, world!") }
```
}
```

### Clojure

Clojure is a modern, functional, and dynamic dialect of the Lisp programming language on the Java platform. Like other Lisps, Clojure treats code as data and has a Lisp macro system.

While Clojure can be compiled directly into Java bytecode, it cannot use dynamic language features or directly call Java libraries. Unlike other JVM scripting languages, Clojure is not considered object-oriented.

#### Hello World in Clojure

```clojure
(defn -main [& args]
``` 
(println "Hello, World!"))
```
```

### Rhino

Rhino is a JavaScript engine written entirely in Java, currently managed by the Mozilla Foundation.

Rhino acts as a shell for JavaScript, embedding it into Java for direct use by Java programmers. Rhino's `JavaAdapters` allow JavaScript to call Java classes to achieve specific functionality.

#### Hello World in Rhino

```js
print('Hello, world!')
```

### Ceylon

Ceylon is an object-oriented, strongly statically typed programming language created by Red Hat, with an emphasis on immutability. Ceylon programs run on the Java Virtual Machine and can be compiled to JavaScript. The language design focuses on source code readability, predictability, extensibility, modularity, and metaprogrammability.

#### Hello World in Ceylon

```ceylon
shared void run() {
``` 
print("Hello, world!");
```
}
```

### Summary

Those are the 9 mainstream languages that currently run on the JVM, making 10 including Java. If you are a Java developer, it is worth mastering one of these to have more options in scenarios with special requirements. Groovy, Scala, or Kotlin are recommended.

[1]: https://www.hollischuang.com/archives/2322