---
title: "Serialversionuid"
---

Serialization is the process of converting the state information of an object into a form that can be stored or transmitted.

We all know that Java objects are stored in the JVM's heap memory. This means that if the JVM heap no longer exists, the objects disappear along with it.

Serialization provides a solution that allows you to save objects even if the JVM is shut down. It's like the USB flash drives we use every day. By serializing a Java object into a storable or transmittable form (such as a binary stream), for example, saving it in a file, when the object is needed again, the binary stream can be read from the file and deserialized back into an object.

However, whether the virtual machine allows deserialization depends not only on whether the class path and functional code are consistent, but also on a very important point: whether the serialization IDs of the two classes are consistent, which means the `serialVersionUID` is required to match.

During deserialization, the JVM compares the `serialVersionUID` in the incoming byte stream with the `serialVersionUID` of the corresponding local entity class. If they are the same, they are considered consistent, and deserialization can proceed; otherwise, an exception for inconsistent serialization versions will occur, namely `InvalidClassException`.

This is done to ensure security, as the content in file storage might be tampered with.

When a class implementing the `java.io.Serializable` interface does not explicitly define a `serialVersionUID` variable, the Java serialization mechanism automatically generates a `serialVersionUID` based on the compiled Class for serialization version comparison. In this case, if the Class file does not change, the `serialVersionUID` will not change even if it is recompiled multiple times.

However, if a change occurs, the `serialVersionUID` corresponding to that file will also change.

Based on the above principles, if a class of ours implements the `Serializable` interface but does not define a `serialVersionUID`, and is then serialized. If we make changes to that class for some reason after serialization, an error will occur when we try to deserialize the previously serialized object after restarting the application.
