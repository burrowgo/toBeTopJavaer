---
title: "Bug In Fastjson"
---

Everyone must be familiar with Fastjson, Alibaba's open-source JSON parsing library, commonly used to convert between Java Beans and JSON strings.

Recently, Fastjson has been reported multiple times to have vulnerabilities. Many articles have reported this and provided upgrade recommendations.

But as a developer, I am more concerned with why it frequently has vulnerabilities reported. So, with doubt, I looked at the release notes and some source code of Fastjson.

Ultimately, I found that this is actually related to a feature in Fastjson called `AutoType`.

From v1.2.59 released in July 2019 to v1.2.71 released in June 2020, every version upgrade has involved an upgrade to `AutoType`.

Even in the Fastjson open-source repository, there is an issue suggesting the author provide a version without `autoType`:

![-w747][1]

So, what is `AutoType`? Why did Fastjson introduce `AutoType`? Why does `AutoType` lead to security vulnerabilities? This article will analyze it deeply.

### What is AutoType?

Fastjson's main function is to serialize Java Beans into JSON strings, allowing the resulting strings to be persisted through databases or other means.

However, Fastjson does not use [Java's built-in serialization mechanism][2] during the serialization and deserialization process, but rather a custom mechanism.

In fact, for a JSON framework, if you want to convert a Java object into a string, you have two choices:
1. Based on attributes
2. Based on setters/getters

In common JSON serialization frameworks, Fastjson and Jackson serialize objects into JSON strings by traversing all getter methods in the class. Gson does not do this; it traverses all attributes in the class via reflection and serializes their values into JSON.

Suppose we have the following Java class:

```java
class Store {
``` java
```java
private String name;
private Fruit fruit;
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
public Fruit getFruit() {
    return fruit;
}
public void setFruit(Fruit fruit) {
    this.fruit = fruit;
}
```
```
}
    
interface Fruit {
}
    
class Apple implements Fruit {
``` java
```java
private BigDecimal price;
// Omitted setters/getters, toString, etc.
```
```
}
```

**When we want to serialize it, Fastjson scans the getter methods, i.e., it finds `getName` and `getFruit`. At this point, it serializes the values of the `name` and `fruit` fields into a JSON string.**

The problem arises: our defined `Fruit` is just an interface. Can Fastjson correctly serialize the attribute values during serialization? If so, what type will Fastjson deserialize this `fruit` into during deserialization?

Let's try to verify this based on (Fastjson v1.2.68):

```java
Store store = new Store();
store.setName("Hollis");
Apple apple = new Apple();
apple.setPrice(new BigDecimal(0.5));
store.setFruit(apple);
String jsonString = JSON.toJSONString(store);
System.out.println("toJSONString : " + jsonString);
```

The code above is simple: we created a `store`, specified its name, and created a sub-type `Apple` of `Fruit`. Then we serialized this `store` using `JSON.toJSONString`, resulting in the following JSON content:

```json
toJSONString : {"fruit":{"price":0.5},"name":"Hollis"}
```

So, what is the actual type of this `fruit`, and can it be deserialized into `Apple`? Let's execute the following code:

```java
Store newStore = JSON.parseObject(jsonString, Store.class);
System.out.println("parseObject : " + newStore);
Apple newApple = (Apple)newStore.getFruit();
System.out.println("getFruit : " + newApple);
```

Execution result:

```
toJSONString : {"fruit":{"price":0.5},"name":"Hollis"}
parseObject : Store{name='Hollis', fruit={}}
Exception in thread "main" java.lang.ClassCastException: com.hollis.lab.fastjson.test.$Proxy0 cannot be cast to com.hollis.lab.fastjson.test.Apple
at com.hollis.lab.fastjson.test.FastJsonTest.main(FastJsonTest.java:26)
```

As you can see, after deserializing the `store`, we tried to cast `Fruit` to `Apple`, but an exception was thrown.

From the above phenomenon, we know that **when a class contains an interface (or an abstract class), using Fastjson for serialization will erase the sub-type and only keep the interface (abstract class) type, making it impossible to retrieve the original type during deserialization.**

So, how can we solve this problem? Fastjson introduced `AutoType`, which records the original type during serialization.

The method of use is to mark it with `SerializerFeature.WriteClassName`, i.e., changing the code to:

```java
String jsonString = JSON.toJSONString(store, SerializerFeature.WriteClassName);
```

The output result is as follows:

```json
{
``` 
"@type":"com.hollis.lab.fastjson.test.Store",
"fruit":{
    "@type":"com.hollis.lab.fastjson.test.Apple",
    "price":0.5
},
"name":"Hollis"
```
}
```

As you can see, **after marking with `SerializerFeature.WriteClassName`, an extra `@type` field appears in the JSON string, indicating the original type corresponding to the class, facilitating locating the specific type during deserialization.**

This is `AutoType` and the reason for its introduction in Fastjson.

But it is precisely this feature, because security considerations were not comprehensive enough at the beginning of functional design, that has brought endless pain to subsequent Fastjson users.

### What's wrong with AutoType?

Because of the `autoType` function, when Fastjson deserializes a JSON string, it reads the `@type` content and attempts to deserialize the JSON content into this object, calling its setter methods.

This feature can be exploited by constructing a JSON string and using `@type` to specify an attack library.

For example, a common attack library is `com.sun.rowset.JdbcRowSetImpl`, provided by Sun officially. The `dataSourceName` of this class supports passing an RMI source. When this URI is parsed, it supports RMI remote calls.

Fastjson calls the target class's setter methods during deserialization. If an attacker sets a command they want to execute in the `dataSourceName` of `JdbcRowSetImpl`, it will lead to serious consequences.

This is the so-called **Remote Code Execution (RCE) vulnerability**.

In early Fastjson versions (before v1.2.25), `AutoType` was enabled by default with no restrictions. From v1.2.25 onwards, Fastjson disabled `autotype` by default and added `checkAutotype`, with blacklists and whitelists to defend when `autotype` is enabled.

However, this is also when the game between attackers and the Fastjson author began, focusing on "how to bypass checkAutotype".

### SafeMode?

Introduction of `safeMode` in v1.2.68. Once `safeMode` is configured, `autoType` is not supported regardless of white or black lists.

Enable safeMode as follows:

```java
ParserConfig.getGlobalInstance().setSafeMode(true);
```

### Afterword

Fastjson v1.2.72 has fixed known issues in historical versions. Developers can upgrade to the latest version and consider using `safeMode` if `AutoType` is not needed.

Salute to Fastjson! Salute to security researchers! Salute to Wen Shao!

 [1]: https://www.hollischuang.com/wp-content/uploads/2020/07/15938379635086.jpg
 [2]: https://www.hollischuang.com/archives/1140
