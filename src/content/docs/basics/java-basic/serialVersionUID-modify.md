---
title: "Serialversionuid Modify"
---

Regarding `serialVersionUID`. What exactly is this field used for? What happens if it's not set? Why does the "Alibaba Java Development Manual" have the following regulations:

![-w934][4]

### Background Knowledge

**Serializable and Externalizable**

A class enables its serialization functionality by implementing the `java.io.Serializable` interface. **Classes that do not implement this interface will not be able to be serialized or deserialized.** All subtypes of a serializable class are themselves serializable.

If you look at the source code of `Serializable`, you will find that it is just an empty interface with nothing inside. **The `Serializable` interface has no methods or fields and is only used to identify serializable semantics.** However, if a class does not implement this interface and tries to be serialized, it will throw a `java.io.NotSerializableException`.

How does it ensure that only classes implementing this interface can be serialized and deserialized?

The reason is that during the serialization process, the following code is executed:

```java
if (obj instanceof String) {
``` 
writeString((String) obj, unshared);
```
} else if (cl.isArray()) {
``` 
writeArray(obj, desc, unshared);
```
} else if (obj instanceof Enum) {
``` 
writeEnum((Enum<?>) obj, desc, unshared);
```
} else if (obj instanceof Serializable) {
``` 
writeOrdinaryObject(obj, desc, unshared);
```
} else {
``` 
if (extendedDebugInfo) {
    throw new NotSerializableException(
        cl.getName() + "\n" + debugInfoStack.toString());
} else {
    throw new NotSerializableException(cl.getName());
}
```
}
```

In the serialization operation, it checks if the class to be serialized is an `Enum`, `Array`, or `Serializable` type. If not, it throws a `NotSerializableException`.

Java also provides the `Externalizable` interface, which can also be implemented to provide serialization capabilities.

`Externalizable` inherits from `Serializable`. This interface defines two abstract methods: `writeExternal()` and `readExternal()`.

When using the `Externalizable` interface for serialization and deserialization, developers need to override the `writeExternal()` and `readExternal()` methods. Otherwise, all variable values will become default values.

**transient**

The `transient` keyword is used to control variable serialization. Adding this keyword before a variable declaration prevents the variable from being serialized to a file. After deserialization, the value of the `transient` variable is set to its initial value, such as 0 for `int` and `null` for object types.

**Custom Serialization Strategy**

During the serialization process, if `writeObject` and `readObject` methods are defined in the class being serialized, the virtual machine will attempt to call these methods for custom serialization and deserialization.

If no such methods exist, the `defaultWriteObject` method of `ObjectOutputStream` and the `defaultReadObject` method of `ObjectInputStream` are called by default.

Custom `writeObject` and `readObject` methods allow users to control the serialization process, such as dynamically changing serialized values.

Therefore, for some special fields where a serialization strategy needs to be defined, consider using `transient` and overriding `writeObject` and `readObject` methods, as seen in the implementation of `java.util.ArrayList`.

If we look at some classes in Java that implement the serialization interface, such as `String`, `Integer`, etc., we can find a detail: these classes not only implement `Serializable` but also define a `serialVersionUID`![5]

So, what exactly is `serialVersionUID`? Why set such a field?

### What is serialVersionUID

Serialization is the process of converting an object's state information into a form that can be stored or transmitted. We all know that Java objects are stored in the JVM's heap memory. This means that if the JVM heap no longer exists, the objects disappear as well.

Serialization provides a solution that allows you to save objects even when the JVM is shut down, similar to how we use a USB flash drive. By serializing a Java object into a storable or transmittable form (such as a binary stream), for example, by saving it to a file. This way, when the object is needed again, the binary stream can be read from the file and deserialized back into an object.

Whether the virtual machine allows deserialization depends not only on whether the class path and functional code are consistent, but also on a very important point: whether the serialization IDs of the two classes are consistent. This so-called serialization ID is the `serialVersionUID` we define in our code.

### What happens if serialVersionUID changes?

Let's take an example and see what happens if `serialVersionUID` is modified.

```java
public class SerializableDemo1 {
``` java
```java
public static void main(String[] args) {
    // Initializes The Object
    User1 user = new User1();
    user.setName("hollis");
    // Write Obj to File
    ObjectOutputStream oos = null;
    try {
        oos = new ObjectOutputStream(new FileOutputStream("tempFile"));
        oos.writeObject(user);
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        IOUtils.closeQuietly(oos);
    }
}
```
```
}

class User1 implements Serializable {
``` java
private static final long serialVersionUID = 1L;
```java
private String name;
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
```
```
 }
```

We first execute the above code to write a `User1` object to a file. Then we modify the `User1` class and change the value of `serialVersionUID` to `2L`.

```java
class User1 implements Serializable {
``` java
private static final long serialVersionUID = 2L;
```java
private String name;
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
```
```
}
```

Then execute the following code to deserialize the object from the file:

```java
public class SerializableDemo2 {
``` java
```java
public static void main(String[] args) {
    // Read Obj from File
    File file = new File("tempFile");
    ObjectInputStream ois = null;
    try {
        ois = new ObjectInputStream(new FileInputStream(file));
        User1 newUser = (User1) ois.readObject();
        System.out.println(newUser);
    } catch (IOException e) {
        e.printStackTrace();
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    } finally {
        IOUtils.closeQuietly(ois);
        try {
            FileUtils.forceDelete(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
```
}
```

Execution result:

```
java.io.InvalidClassException: com.hollis.User1; local class incompatible: stream classdesc serialVersionUID = 1, local class serialVersionUID = 2
```

As you can see, the above code throws a `java.io.InvalidClassException` and indicates that the `serialVersionUID` is inconsistent.

This is because during deserialization, the JVM compares the `serialVersionUID` in the received byte stream with the `serialVersionUID` of the corresponding local entity class. If they are the same, they are considered consistent and can be deserialized; otherwise, a serialization version inconsistency exception occurs, which is `InvalidClassException`.

This is also why the "Alibaba Java Development Manual" stipulates that in compatibility upgrades, when modifying a class, do not modify the `serialVersionUID` unless it is between two completely incompatible versions. So, **`serialVersionUID` is actually used to verify version consistency.**

If you are interested, you can look at the JDK code for various versions. The `serialVersionUID` of downward-compatible classes has never changed. For example, the `serialVersionUID` of the `String` class has always been `-6849794470754667710L`.

However, the author believes that this specification can be even stricter: if a class implements the `Serializable` interface, it must manually add a `private static final long serialVersionUID` variable and set an initial value.

### Why explicitly define a serialVersionUID?

If we don't explicitly define a `serialVersionUID` in the class, let's see what happens.

Try to modify the demo code above. First, use the following class to define an object, which does not have a `serialVersionUID` defined, and write it to a file.

```java
class User1 implements Serializable {
``` java
```java
private String name;
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
```
```
 }
```

Then we modify the `User1` class by adding an attribute. Then try to read it back from the file and deserialize it.

```java
class User1 implements Serializable {
``` java
```java
private String name;
private int age;
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
public int getAge() {
    return age;
}
public void setAge(int age) {
    this.age = age;
}
```
```
 }
```

Execution result: `java.io.InvalidClassException: com.hollis.User1; local class incompatible: stream classdesc serialVersionUID = -2986778152837257883, local class serialVersionUID = 7961728318907695402`

Similarly, an `InvalidClassException` was thrown, indicating that the two `serialVersionUID`s are different, namely `-2986778152837257883` and `7961728318907695402`.

This shows that the system automatically added a `serialVersionUID`.

Therefore, once a class implements `Serializable`, it is recommended to explicitly define a `serialVersionUID`. Otherwise, exceptions will occur when the class is modified.

There are two explicit ways to generate `serialVersionUID`:
1. The default 1L, for example: `private static final long serialVersionUID = 1L;`
2. Generate a 64-bit hash field based on the class name, interface name, member methods, and attributes, for example: `private static final long serialVersionUID = xxxxL;`

The latter method can be generated using an IDE, which will be introduced later.

### Underlying Principle

To understand why an exception is thrown when the `serialVersionUID` changes, let's look at the source code. How is the default `serialVersionUID` generated when it's not explicitly defined?

To simplify, the deserialization call chain is as follows:

`ObjectInputStream.readObject -> readObject0 -> readOrdinaryObject -> readClassDesc -> readNonProxyDesc -> ObjectStreamClass.initNonProxy`

In `initNonProxy`, the key code is as follows:

![][6]

During the deserialization process, the `serialVersionUID` is compared. If they are found to be unequal, an exception is thrown immediately.

Let's look deeper into the `getSerialVersionUID` method:

```java
public long getSerialVersionUID() {
``` java
// REMIND: synchronize instead of relying on volatile?
if (suid == null) {
    suid = AccessController.doPrivileged(
        new PrivilegedAction<Long>() {
            public Long run() {
                return computeDefaultSUID(cl);
            }
        }
    );
}
return suid.longValue();
```
}
```

When `serialVersionUID` is not defined, the `computeDefaultSUID` method is called to generate a default `serialVersionUID`.

This identifies the root cause of the two problems mentioned above: strict validation is performed in the code.

### IDEA Tip

To ensure we don't forget to define `serialVersionUID`, we can adjust the configuration of IntelliJ IDEA. After implementing the `Serializable` interface, if `serialVersionUID` is not defined, IDEA (and similarly Eclipse) will provide a tip: ![][7]

And you can generate one with one click:

![][8]

Of course, this configuration is not effective by default; it needs to be manually set in IDEA:

![][9]

Check the box at number 3 in the image (the configuration for "Serializable class without serialVersionUID") and save.

### Summary

`serialVersionUID` is used to verify version consistency. Therefore, when performing compatibility upgrades, do not change the value of `serialVersionUID` in the class.

If a class implements the `Serializable` interface, remember to define `serialVersionUID`, otherwise, an exception will occur. You can set it in the IDE to provide tips and quickly generate a `serialVersionUID` with one click.

The reason an exception occurs is that validation is performed during deserialization, and if it is not explicitly defined, it will be automatically generated based on the class's attributes.

 [1]: http://www.hollischuang.com/archives/1150
 [2]: http://www.hollischuang.com/archives/1140
 [3]: http://www.hollischuang.com/archives/1144
 [4]: http://www.hollischuang.com/wp-content/uploads/2018/12/15455608799770.jpg
 [5]: http://www.hollischuang.com/wp-content/uploads/2018/12/15455622116411.jpg
 [6]: http://www.hollischuang.com/wp-content/uploads/2018/12/15455655236269.jpg
 [7]: http://www.hollischuang.com/wp-content/uploads/2018/12/15455657868672.jpg
 [8]: http://www.hollischuang.com/wp-content/uploads/2018/12/15455658088098.jpg
 [9]: http://www.hollischuang.com/wp-content/uploads/2018/12/15455659620042.jpg
