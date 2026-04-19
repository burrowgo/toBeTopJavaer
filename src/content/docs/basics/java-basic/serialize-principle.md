---
title: "Serialize Principle"
---

Serialization is a means of object persistence. It is widely used in network transmission, RMI, and other scenarios. This article introduces the content related to Java serialization by analyzing the serialization of `ArrayList`. It primarily involves the following questions:

> How is Java serialization implemented?
> 
> Why must a class implement the `java.io.Serializable` interface to be serialized?
> 
> What is the role of `transient`?
> 
> How to customize a serialization strategy?
> 
> How is a custom serialization strategy called?
> 
> What are the benefits of `ArrayList`'s implementation of serialization?

## Serialization of Java Objects

The Java platform allows us to create reusable Java objects in memory, but generally, these objects only exist while the JVM is running; that is, the lifecycle of these objects is not longer than that of the JVM. However, in practical applications, it might be required to save (persist) specific objects after the JVM stops running and reload them in the future. Java object serialization helps us achieve this functionality.

Using Java object serialization, when an object is saved, its state is saved as a group of bytes, which can be reassembled into the object in the future. It is important to note that object serialization saves the "state" of the object, namely its member variables. From this, it can be seen that **object serialization does not focus on static variables in the class**.

In addition to being used when persisting objects, object serialization is also used when using RMI (Remote Method Invocation) or passing objects over a network. The Java Serialization API provides a standard mechanism for handling object serialization, and this API is simple and easy to use.

## How to Serialize and Deserialize Java Objects

In Java, any class that implements the `java.io.Serializable` interface can be serialized. Here is some code:

code 1 Create a User class for serialization and deserialization

``` java
package com.hollis;
import java.io.Serializable;
import java.util.Date;
    
/**
 * Created by hollis on 16/2/2.
 */
public class User implements Serializable{
    private String name;
    private int age;
    private Date birthday;
    private transient String gender;
    private static final long serialVersionUID = -6849794470754667710L;
    
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
    
    public Date getBirthday() {
        return birthday;
    }
    
    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", gender=" + gender +
                ", birthday=" + birthday +
                '}';
    }
}
```
    

code 2 Demo of serializing and deserializing User

``` java
package com.hollis;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import java.io.*;
import java.util.Date;
    
/**
 * Created by hollis on 16/2/2.
 */
public class SerializableDemo {
    
    public static void main(String[] args) {
        // Initializes The Object
        User user = new User();
        user.setName("hollis");
        user.setGender("male");
        user.setAge(23);
        user.setBirthday(new Date());
        System.out.println(user);
    
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
            User newUser = (User) ois.readObject();
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
}
// output 
// User{name='hollis', age=23, gender=male, birthday=Tue Feb 02 17:37:38 CST 2016}
// User{name='hollis', age=23, gender=null, birthday=Tue Feb 02 17:37:38 CST 2016}
```
    

## Knowledge Related to Serialization and Deserialization

1. In Java, as long as a class implements the `java.io.Serializable` interface, it can be serialized.

2. Serialize and deserialize objects through `ObjectOutputStream` and `ObjectInputStream`.

3. Whether the virtual machine allows deserialization depends not only on whether the class path and function code are consistent; a very important point is whether the serialization IDs of the two classes are consistent (the `private static final long serialVersionUID`).

4. Serialization does not save static variables.

5. To serialize a parent class object, the parent class must also implement the `Serializable` interface.

6. The role of the `transient` keyword is to control the serialization of variables. Adding this keyword before a variable declaration prevents the variable from being serialized into a file. After deserialization, the value of a `transient` variable is set to its initial value, such as 0 for `int` and `null` for objects.

7. When the server sends serialized object data to the client, some data in the object might be sensitive, such as password strings. It is desired to encrypt such password fields during serialization. If the client has the decryption key, the password can be read only when the client performs deserialization. This can ensure the data security of serialized objects to a certain extent.

## Serialization of ArrayList

Before introducing `ArrayList` serialization, let's consider a question:

> **How to customize serialization and deserialization strategies?**

With this question in mind, let's look at the source code of `java.util.ArrayList`.

code 3

``` java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    private static final long serialVersionUID = 8683452581122892189L;
    transient Object[] elementData; // non-private to simplify nested class access
    private int size;
}
```
    

The author has omitted other member variables. From the code above, we know that `ArrayList` implements the `java.io.Serializable` interface, so we can serialize and deserialize it. Because `elementData` is `transient`, we would assume that this member variable will not be serialized and retained. Let's write a Demo to verify our idea:

code 4

``` java
public static void main(String[] args) throws IOException, ClassNotFoundException {
        List<String> stringList = new ArrayList<String>();
        stringList.add("hello");
        stringList.add("world");
        stringList.add("hollis");
        stringList.add("chuang");
        System.out.println("init StringList" + stringList);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("stringlist"));
        objectOutputStream.writeObject(stringList);
    
        IOUtils.close(objectOutputStream);
        File file = new File("stringlist");
        ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(file));
        List<String> newStringList = (List<String>)objectInputStream.readObject();
        IOUtils.close(objectInputStream);
        if(file.exists()){
            file.delete();
        }
        System.out.println("new StringList" + newStringList);
    }
// init StringList[hello, world, hollis, chuang]
// new StringList[hello, world, hollis, chuang]
```
    

Anyone who knows `ArrayList` knows that `ArrayList` is implemented through an underlying array. The array `elementData` is actually used to save the elements in the list. Through the way this property is declared, we know it cannot be persisted through serialization. So why did the result of code 4 retain the elements in the List through serialization and deserialization?

### writeObject and readObject Methods

Two methods are defined in `ArrayList`: `writeObject` and `readObject`.

Here is the conclusion:

> During the serialization process, if a `writeObject` and `readObject` method are defined in the class being serialized, the virtual machine will try to call these methods in the object class to perform user-defined serialization and deserialization.
> 
> If there are no such methods, the default call is the `defaultWriteObject` method of `ObjectOutputStream` and the `defaultReadObject` method of `ObjectInputStream`.
> 
> User-defined `writeObject` and `readObject` methods allow the user to control the serialization process; for example, they can dynamically change the values being serialized during the serialization process.

Let's look at the specific implementation of these two methods:

code 5

``` java
private void readObject(java.io.ObjectInputStream s)
        throws java.io.IOException, ClassNotFoundException {
        elementData = EMPTY_ELEMENTDATA;
    
        // Read in size, and any hidden stuff
        s.defaultReadObject();
    
        // Read in capacity
        s.readInt(); // ignored
    
        if (size > 0) {
            // be like clone(), allocate array based upon size not capacity
            ensureCapacityInternal(size);
    
            Object[] a = elementData;
            // Read in all elements in the proper order.
            for (int i=0; i<size; i++) {
                a[i] = s.readObject();
            }
        }
    }
```
    

code 6

``` java
private void writeObject(java.io.ObjectOutputStream s)
        throws java.io.IOException{
        // Write out element count, and any hidden stuff
        int expectedModCount = modCount;
        s.defaultWriteObject();
    
        // Write out size as capacity for behavioural compatibility with clone()
        s.writeInt(size);
    
        // Write out all elements in the proper order.
        for (int i=0; i<size; i++) {
            s.writeObject(elementData[i]);
        }
    
        if (modCount != expectedModCount) {
            throw new ConcurrentModificationException();
        }
    }
```
    

So why does `ArrayList` use this method to implement serialization?

### why transient

`ArrayList` is actually a dynamic array that automatically grows by a set length when it is full. If the automatic growth length is set to 100 but only one element is actually placed, 99 `null` elements would be serialized. To ensure that these many `null` elements are not serialized simultaneously, `ArrayList` sets the element array to `transient`.

### why writeObject and readObject

As mentioned earlier, to prevent an array containing many null objects from being serialized and to optimize storage, `ArrayList` uses `transient` to declare `elementData`. However, as a collection, it must still be guaranteed that its elements can be persisted during the serialization process. Therefore, by overriding the `writeObject` and `readObject` methods, the elements are retained.

The `writeObject` method saves elements in the `elementData` array into the output stream (`ObjectOutputStream`) by iterating through them.

The `readObject` method reads objects from the input stream (`ObjectInputStream`) and assigns them to the `elementData` array.

At this point, we can try to answer the question raised earlier:

> How to customize serialization and deserialization strategies?

Answer: This can be done by adding `writeObject` and `readObject` methods to the class being serialized. Then another question arises:

> Although `writeObject` and `readObject` methods are written in `ArrayList`, these two methods are not explicitly called.
> 
> **So if a class contains `writeObject` and `readObject` methods, how are these two methods called?**

## ObjectOutputStream

From code 4, we can see that the object serialization process is implemented through `ObjectOutputStream` and `ObjectInputStream`. So, with the question just raised, let's analyze how the `writeObject` and `readObject` methods in `ArrayList` are called.

To save space, here is the call stack for `writeObject` in `ObjectOutputStream`:

`writeObject ---> writeObject0 ---> writeOrdinaryObject ---> writeSerialData ---> invokeWriteObject`

Let's look at `invokeWriteObject`:

``` java
void invokeWriteObject(Object obj, ObjectOutputStream out)
        throws IOException, UnsupportedOperationException
    {
        if (writeObjectMethod != null) {
            try {
                writeObjectMethod.invoke(obj, new Object[]{ out });
            } catch (InvocationTargetException ex) {
                Throwable th = ex.getTargetException();
                if (th instanceof IOException) {
                    throw (IOException) th;
                } else {
                    throwMiscException(th);
                }
            } catch (IllegalAccessException ex) {
                // should not occur, as access checks have been suppressed
                throw new InternalError(ex);
            }
        } else {
            throw new UnsupportedOperationException();
        }
    }
```
    

The key part is `writeObjectMethod.invoke(obj, new Object[]{ out });`, which calls the `writeObjectMethod` method via reflection. The official explanation for this `writeObjectMethod` is:

> class-defined writeObject method, or null if none

In our example, this method is the `writeObject` method we defined in `ArrayList`. It is called through reflection.

At this point, we can try to answer the question raised earlier:

> **If a class contains `writeObject` and `readObject` methods, how are these two methods called?**

Answer: When using the `writeObject` method of `ObjectOutputStream` and the `readObject` method of `ObjectInputStream`, they are called through reflection.

* * *

We have finished introducing the serialization method of `ArrayList`. Now, I wonder if anyone has raised such a doubt:

<div id="What Serializable Did">
</div>

> **`Serializable` is clearly an empty interface. How does it ensure that only methods implementing this interface can perform serialization and deserialization?**

The definition of the `Serializable` interface:

``` java
public interface Serializable {
}
```
    

The reader can try to remove the code that inherits from `Serializable` in code 1 and execute code 2 again; a `java.io.NotSerializableException` will be thrown.

Actually, this question is also easy to answer. Let's go back to the call stack for `writeObject` in `ObjectOutputStream`:

`writeObject ---> writeObject0 ---> writeOrdinaryObject ---> writeSerialData ---> invokeWriteObject`

There is a segment of code in the `writeObject0` method:

``` 
if (obj instanceof String) {
                writeString((String) obj, unshared);
            } else if (cl.isArray()) {
                writeArray(obj, desc, unshared);
            } else if (obj instanceof Enum) {
                writeEnum((Enum<?>) obj, desc, unshared);
            } else if (obj instanceof Serializable) {
                writeOrdinaryObject(obj, desc, unshared);
            } else {
                if (extendedDebugInfo) {
                    throw new NotSerializableException(
                        cl.getName() + "\n" + debugInfoStack.toString());
                } else {
                    throw new NotSerializableException(cl.getName());
                }
            }
```
    

When performing a serialization operation, it checks whether the class to be serialized is of type `Enum`, `Array`, or `Serializable`. If not, a `NotSerializableException` is thrown directly.

## Summary

1. If a class wants to be serialized, it needs to implement the `Serializable` interface. Otherwise, a `NotSerializableException` will be thrown. This is because types are checked during the serialization operation, requiring the class to be serialized to belong to any of the `Enum`, `Array`, or `Serializable` types.

2. Adding the `transient` keyword before a variable declaration prevents the variable from being serialized into a file.

3. Adding `writeObject` and `readObject` methods to a class allows for the implementation of custom serialization strategies.

## References

[Advanced Understanding of Java Serialization][1]

 [1]: https://www.ibm.com/developerworks/cn/java/j-lo-serial/
