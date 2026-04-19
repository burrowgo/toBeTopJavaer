---
title: "Success Issuccess And Boolean Boolean"
---

In daily development, we frequently define boolean variables in classes. For instance, when providing an RPC interface, we often include a field to indicate the success of a request.

Defining this "success" field involves subtle pitfalls that can lead to bugs. This article analyzes the best practices for defining boolean member variables.

Generally, there are four ways to define a boolean member variable:
1. `boolean success`
2. `boolean isSuccess`
3. `Boolean success`
4. `Boolean isSuccess`

Which one is the correct approach? Let's break it down.

### success vs. isSuccess

From a semantic standpoint, both names are clear. However, the *Alibaba Java Development Manual* has a **[Mandatory]** regulation:

![Regulation Image][1]

Why this rule? Let's look at how IDEs (like IntelliJ IDEA) generate setters and getters for different naming conventions:

```java
class Model3 {
``` java
```java
private boolean isSuccess;
public boolean isSuccess() { return isSuccess; }
public void setSuccess(boolean success) { isSuccess = success; }
```
```
}

class Model4 {
``` java
```java
private boolean success;
public boolean isSuccess() { return success; }
public void setSuccess(boolean success) { this.success = success; }
```
```
}
```

Observations:
- Primitive `boolean` generates `isXXX()` and `setXXX()`.
- Wrapper `Boolean` generates `getXXX()` and `setXXX()`.

In both `Model3` and `Model4`, the generated methods are `isSuccess()` and `setSuccess()`.

**JavaBeans Specification**
According to the [JavaBeans Specification][2], a property `propertyName` should have:
- `public <PropertyType> get<PropertyName>();`
```java
- `public void set<PropertyName>(<PropertyType> a);`
```

For `boolean` types:
- `public boolean is<PropertyName>();`
```java
- `public void set<PropertyName>(boolean m);`
```

![JavaBeans Spec Image][3]

In `Model3`, where the variable is named `isSuccess`, a strict implementation of the spec would require the getter to be `isIsSuccess()`. However, most IDEs and frameworks simply use `isSuccess()`. This leads to major issues during serialization.

**Impact of Serialization**
Consider JSON serialization with different libraries:
- **FastJSON/Jackson**: These libraries scan for getter methods. They see `isSuccess()`, strip the `is` prefix, and conclude the property name is `success`.
- **Gson**: This library uses reflection to find class fields directly, so it sees `isSuccess`.

If you serialize an object with FastJSON (`{"success":true}`) and try to deserialize it with Gson, Gson will look for a field named `success`. Since it only finds `isSuccess`, the field will remain at its default value (`false`).

To avoid this, **always use `success` instead of `isSuccess`** as the variable name. This ensures that the getter is `isSuccess()`, which is perfectly compliant and works across all frameworks.

### Boolean vs. boolean

Should you use the primitive `boolean` or the wrapper `Boolean`?

```java
class Model {
``` java
```java
private Boolean success; // Default is null
private boolean failure; // Default is false
```
```
}
```

The *Alibaba Java Development Manual* recommends using wrapper types for POJOs and RPC return values.

**Why?**
Consider a billing system that retrieves a rate from an external service. If the service returns `null` due to an error:
- A `Double` wrapper will throw a `NullPointerException` during calculation, immediately halting the process and alerting you to the failure.
- A primitive `double` will default to `0.0`. The system might proceed to calculate a charge of $0.0, allowing a silent failure to go unnoticed.

Using wrapper types forces you to handle `null` or allows the program to fail fast, making bugs easier to detect.

### Summary

When defining boolean variables for POJOs or RPC interfaces:
1.  **Use `success` as the name**, not `isSuccess`, to comply with JavaBeans and ensure serialization compatibility.
2.  **Use the wrapper type `Boolean`** to avoid silent errors caused by the default values of primitive types.
3.  Always be mindful of handling potential `null` values in your logic.

 [1]: http://www.hollischuang.com/wp-content/uploads/2018/12/15449439364854.jpg
 [2]: https://download.oracle.com/otndocs/jcp/7224-javabeans-1.01-fr-spec-oth-JSpec/
 [3]: http://www.hollischuang.com/wp-content/uploads/2018/12/15449455942045.jpg
