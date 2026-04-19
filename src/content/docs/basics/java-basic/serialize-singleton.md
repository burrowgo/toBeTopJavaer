---
title: "Serialize Singleton"
---

This article will introduce how serialization breaks the singleton pattern and how to avoid this destruction through examples and by reading the Java source code.

> The singleton pattern is one of the simplest design patterns. Through the singleton pattern, you can ensure that a class in the system has only one instance, and that this instance is easily accessible to the outside world, thereby facilitating control over the number of instances and saving system resources. If you want an object of a certain class to exist only once in the system, the singleton pattern is the best solution. For information on how to use the singleton pattern, you can read [Seven Ways to Write the Singleton Pattern][1].

However, can the singleton pattern really achieve the uniqueness of an instance?

The answer is no. Many people know that reflection can break the singleton pattern. Besides reflection, using serialization and deserialization can also break it.

## Destruction of Singleton by Serialization

First, let's write a singleton class:

code 1

``` java
package com.hollis;
import java.io.Serializable;
/**
 * Created by hollis on 16/2/5.
 * Implementing Singleton using Double-Checked Locking
 */
public class Singleton implements Serializable{
    private volatile static Singleton singleton;
    private Singleton (){}
    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```
    

Next is a test class:

code 2

``` java
package com.hollis;
import java.io.*;
/**
 * Created by hollis on 16/2/5.
 */
public class SerializableDemo1 {
    // For ease of understanding, closing stream operations and deleting file operations are ignored. Do not forget them in real coding.
    // Exceptions are thrown directly.
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        // Write Obj to file
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("tempFile"));
        oos.writeObject(Singleton.getSingleton());
        // Read Obj from file
        File file = new File("tempFile");
        ObjectInputStream ois =  new ObjectInputStream(new FileInputStream(file));
        Singleton newInstance = (Singleton) ois.readObject();
        // Check if it is the same object
        System.out.println(newInstance == Singleton.getSingleton());
    }
}
// false
```
    

The output result is false, which indicates:

> The object obtained through serialization and deserialization of `Singleton` is a new object, which breaks the uniqueness of the `Singleton`.

Before introducing how to solve this problem, let's analyze deeply why this happens. What exactly happens during the deserialization process?

## ObjectInputStream

The serialization process of an object is implemented through `ObjectOutputStream` and `ObjectInputStream`. So, with the question just raised, let's analyze how the `readObject` method of `ObjectInputStream` is executed.

To save space, here is the call stack for `readObject` of `ObjectInputStream`:

<img src="https://www.hollischuang.com/wp-content/uploads/2016/02/640.png" alt="" width="840" height="309" class="aligncenter size-full wp-image-3561" />

Let's look at the key code, a snippet from the `readOrdinaryObject` method:
code 3

``` java
private Object readOrdinaryObject(boolean unshared)
        throws IOException
    {
        // Some code omitted here
    
        Object obj;
        try {
            obj = desc.isInstantiable() ? desc.newInstance() : null;
        } catch (Exception ex) {
            throw (IOException) new InvalidClassException(
                desc.forClass().getName(),
                "unable to create instance").initCause(ex);
        }
    
        // Some code omitted here
    
        if (obj != null &&
            handles.lookupException(passHandle) == null &&
            desc.hasReadResolveMethod())
        {
            Object rep = desc.invokeReadResolve(obj);
            if (unshared && rep.getClass().isArray()) {
                rep = cloneArray(rep);
            }
            if (rep != obj) {
                handles.setObject(passHandle, obj = rep);
            }
        }
    
        return obj;
    }
```
    

In code 3, two main parts are highlighted. Let's analyze the first part:

code 3.1

``` 
Object obj;
try {
    obj = desc.isInstantiable() ? desc.newInstance() : null;
} catch (Exception ex) {
    throw (IOException) new InvalidClassException(desc.forClass().getName(),"unable to create instance").initCause(ex);
}
```
    

The `obj` object created here is the object to be returned by this method, which can also be temporarily understood as the object returned by `ObjectInputStream.readObject`.

<img src="https://www.hollischuang.com/wp-content/uploads/2016/02/641.jpeg" alt="" width="1080" height="336" class="aligncenter size-full wp-image-3563" />

> `isInstantiable`: Returns true if a serializable/externalizable class can be instantiated at runtime. I will introduce serializable and externalizable in other articles.
> 
> `desc.newInstance`: This method creates a new object by calling the no-argument constructor via reflection.

So, at this point, we can explain why serialization can break the singleton pattern:

> Answer: Serialization creates a new object by calling the no-argument constructor via reflection.

Next, let's look at the question left at the beginning: how to prevent serialization/deserialization from breaking the singleton pattern.

## Preventing Serialization from Breaking the Singleton Pattern

First, the solution, then a detailed analysis of the principles:

Defining `readResolve` in the `Singleton` class can solve this problem:

code 4

``` java
package com.hollis;
import java.io.Serializable;
/**
 * Created by hollis on 16/2/5.
 * Implementing Singleton using Double-Checked Locking
 */
public class Singleton implements Serializable{
    private volatile static Singleton singleton;
    private Singleton (){}
    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
    
    private Object readResolve() {
        return singleton;
    }
}
```
    

Run the following test class again:

``` java
package com.hollis;
import java.io.*;
/**
 * Created by hollis on 16/2/5.
 */
public class SerializableDemo1 {
    // For ease of understanding, closing stream operations and deleting file operations are ignored. Do not forget them in real coding.
    // Exceptions are thrown directly.
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        // Write Obj to file
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("tempFile"));
        oos.writeObject(Singleton.getSingleton());
        // Read Obj from file
        File file = new File("tempFile");
        ObjectInputStream ois =  new ObjectInputStream(new FileInputStream(file));
        Singleton newInstance = (Singleton) ois.readObject();
        // Check if it is the same object
        System.out.println(newInstance == Singleton.getSingleton());
    }
}
// true
```
    

The output result this time is true. For the specific principle, let's go back and analyze the second segment of code in code 3:

code 3.2

``` 
if (obj != null &&
            handles.lookupException(passHandle) == null &&
            desc.hasReadResolveMethod())
        {
            Object rep = desc.invokeReadResolve(obj);
            if (unshared && rep.getClass().isArray()) {
                rep = cloneArray(rep);
            }
            if (rep != obj) {
                handles.setObject(passHandle, obj = rep);
            }
        }
```
    

`hasReadResolveMethod`: Returns true if the class implementing `Serializable` or `Externalizable` contains the `readResolve` method.

`invokeReadResolve`: Calls the `readResolve` method of the class to be deserialized via reflection.

So the principle is clear: by defining the `readResolve` method in `Singleton` and specifying the generation strategy of the object to be returned in that method, we can prevent the singleton from being broken.

## Summary

When serialization is involved, pay extra attention to its destruction of the singleton pattern.

## Recommended Reading

[In-depth Analysis of Java Serialization and Deserialization][2]

 [1]: http://www.hollischuang.com/archives/205
 [2]: http://www.hollischuang.com/archives/1140
