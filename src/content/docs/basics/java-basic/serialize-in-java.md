---
title: "Serialize In Java"
---


## Java Object Serialization and Deserialization

In Java, we can create objects in multiple ways, and as long as an object is not garbage collected, we can reuse it. However, these Java objects exist in the JVM's heap memory. These objects can only exist as long as the JVM is running. Once the JVM stops, the state of these objects is lost.

In real application scenarios, we need to persist these objects and be able to read them back when needed. Java object serialization helps us achieve this.

Object serialization is a built-in object persistence method in the Java language. Through object serialization, an object's state can be saved as a byte array, which can be converted back into an object through deserialization when needed. Object serialization allows for easy conversion between active objects in the JVM and byte arrays (streams).

In Java, object serialization and deserialization are widely used in RMI (Remote Method Invocation) and network transmission.

## Related Interfaces and Classes

Java provides a set of convenient APIs for serialization and deserialization:

- `java.io.Serializable`
- `java.io.Externalizable`
- `ObjectOutput`
- `ObjectInput`
- `ObjectOutputStream`
- `ObjectInputStream`

## Serializable Interface

A class enables its serialization functionality by implementing the `java.io.Serializable` interface. Classes that do not implement this interface will not be able to have any of their states serialized or deserialized. All subtypes of a serializable class are themselves serializable. **The serialization interface has no methods or fields and is only used to identify serializable semantics.**

If an object that does not support the `Serializable` interface is encountered during serialization, a `NotSerializableException` will be thrown.

If a class being serialized has a parent class, the parent class should also implement the `java.io.Serializable` interface if you want to persist variables defined in the parent class.

(Example class `User1` implementing `Serializable`)

```java
package com.hollischaung.serialization.SerializableDemos;
import java.io.Serializable;
/**
 * Created by hollis on 16/2/17.
 * Implement Serializable interface
 */
public class User1 implements Serializable {
    
``` java
```java
private String name;
private int age;
```
    
public String getName() {
    return name;
}
    
```java
public void setName(String name) {
    this.name = name;
}
```
    
public int getAge() {
    return age;
}
    
```java
public void setAge(int age) {
    this.age = age;
}
    
@Override
public String toString() {
    return "User{" +
            "name='" + name + '\'' +
            ", age=" + age +
            '}';
}
```
```
}
```

(Serialization and deserialization code example)

```java
package com.hollischaung.serialization.SerializableDemos;
    
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
    
import java.io.*;
/**
 * Created by hollis on 16/2/17.
 */
public class SerializableDemo1 {
    
``` java
```java
public static void main(String[] args) {
    // Initializes The Object
    User1 user = new User1();
    user.setName("hollis");
    user.setAge(23);
    System.out.println(user);
```
    
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
}
    
// Output:
// User{name='hollis', age=23}
// User{name='hollis', age=23}
```

## Externalizable Interface

Besides `Serializable`, Java provides another serialization interface: `Externalizable`.

To understand the difference between `Externalizable` and `Serializable`, let's look at some code where we modify the above example to use `Externalizable`.

```java
package com.hollischaung.serialization.ExternalizableDemos;
    
import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
    
/**
 * Created by hollis on 16/2/17.
 * Implement Externalizable interface
 */
public class User1 implements Externalizable {
    
``` java
```java
private String name;
private int age;
```
    
public String getName() {
    return name;
}
    
```java
public void setName(String name) {
    this.name = name;
}
```
    
public int getAge() {
    return age;
}
    
```java
public void setAge(int age) {
    this.age = age;
}
    
public void writeExternal(ObjectOutput out) throws IOException {
    
}
    
public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
    
}
    
@Override
public String toString() {
    return "User{" +
            "name='" + name + '\'' +
            ", age=" + age +
            '}';
}
```
```
}
```

```java
package com.hollischaung.serialization.ExternalizableDemos;
    
import java.io.*;
    
/**
 * Created by hollis on 16/2/17.
 */
public class ExternalizableDemo1 {
    
``` java
```java
public static void main(String[] args) throws IOException, ClassNotFoundException {
    // Write Obj to file
    ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("tempFile"));
    User1 user = new User1();
    user.setName("hollis");
    user.setAge(23);
    oos.writeObject(user);
    // Read Obj from file
    File file = new File("tempFile");
    ObjectInputStream ois =  new ObjectInputStream(new FileInputStream(file));
    User1 newInstance = (User1) ois.readObject();
    // Output
    System.out.println(newInstance);
}
```
```
}
// Output:
// User{name='null', age=0}
```

From the above example, we can see that all attribute values of the object obtained after serializing and deserializing the `User1` class have become default values. This means the object's state was not persisted. This is the difference:

`Externalizable` inherits from `Serializable` and defines two abstract methods: `writeExternal()` and `readExternal()`. When using `Externalizable`, developers need to override these methods. In the code above, since no implementation details were defined in these methods, the output is empty. Also note: when using `Externalizable`, during deserialization, the no-argument constructor of the serialized class is called to create a new object, and then the field values are filled. Therefore, a class implementing `Externalizable` must provide a public no-argument constructor.

(Corrected example `User2` and `ExternalizableDemo2`)

```java
public void writeExternal(ObjectOutput out) throws IOException {
``` 
out.writeObject(name);
out.writeInt(age);
```
}

public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
``` 
name = (String) in.readObject();
age = in.readInt();
```
}
```

Result: `User{name='hollis', age=23}`

If the class does not have a no-argument constructor, a `java.io.InvalidClassException` will be thrown at runtime.

## References

[Wikipedia][6]

[Understanding Java Object Serialization][7]

[Advanced Understanding of Java Serialization][8]

 [1]: http://www.hollischuang.com/archives/1140#What%20Serializable%20Did
 [6]: https://en.wikipedia.org/wiki/Serialization
 [7]: http://www.blogjava.net/jiangshachina/archive/2012/02/13/369898.html
 [8]: https://www.ibm.com/developerworks/cn/java/j-lo-serial/
