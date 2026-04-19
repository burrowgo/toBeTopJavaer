---
title: "Stop Use Enum In Api"
---

Recently, an issue occurred in our online environment. The online code threw an `IllegalArgumentException` during execution. After analyzing the stack trace, we found the root cause to be the following:

``` 
java.lang.IllegalArgumentException: 
No enum constant com.a.b.f.m.a.c.AType.P_M
```

It looks quite simple; the error message indicates that the enum constant `P_M` was not found in the `AType` enum class.

```java
After investigation, we found that before this exception started appearing, a downstream system that our application depends on had a release. During the release, an API package changed: the main change was adding a new enum item `P_M` to an enum parameter `AType` in the `Response` class of an RPC interface.
```

However, when the downstream system was released, we were not notified to upgrade our system, so it errored out.

Let's analyze why this happens.

### Problem Reproduction

First, downstream System A provides an interface in a second-party library where one of the return parameters is an enum type.

> **First-party library** refers to dependencies within the project.
> **Second-party library** refers to dependencies provided by other projects within the company.
> **Third-party library** refers to dependencies from third parties such as other organizations or companies.

``` java
public interface AFacadeService {
    
    public AResponse doSth(ARequest aRequest);
}
    
public Class AResponse{
    
    private Boolean success;
    
    private AType aType;
}
    
public enum AType{
    
    P_T,
    
    A_B
}
```

Then, System B depends on this second-party library and calls the `doSth` method of `AFacadeService` via RPC.

``` java
public class BService {
    
    @Autowired
    AFacadeService aFacadeService;
    
    public void doSth(){
        ARequest aRequest = new ARequest();
    
        AResponse aResponse = aFacadeService.doSth(aRequest);
    
        AType aType = aResponse.getAType();
    }
}
```

At this time, if both System A and System B depend on the same version of the second-party library, the `AType` enum used by both will be the same class, and the enum items will be consistent. There won't be any problems.

However, if one day the second-party library is upgraded and a new enum item `P_M` is added to the `AType` enum class, and at this time only System A is upgraded while System B is not.

Then the `AType` System A depends on looks like this:

``` java
public enum AType{
    
    P_T,
    
    A_B,
    
    P_M
}
```

While the `AType` System B depends on looks like this:

``` java
public enum AType{
    
    P_T,
    
    A_B
}
```

In this case, **when System B calls System A via RPC, if the `aType` in the `AResponse` returned by System A is the newly added `P_M`, System B will be unable to parse it. Usually, at this time, the RPC framework will encounter a deserialization exception, causing the program to be interrupted.**

### Principle Analysis

We have analyzed the phenomenon of this problem. Now let's look at the underlying principle and why such an exception occurs.

Actually, the principle is not difficult. **Most of these RPC frameworks use JSON format for data transmission**, meaning the client serializes the return value into a JSON string, and the server then deserializes the JSON string into a Java object.

During the JSON deserialization process, for an enum type, it will try to call the `valueOf` method of the corresponding enum class to obtain the corresponding enum.

When we check the implementation of the `valueOf` method in the `Enum` class, we can find that **if the corresponding enum item cannot be found in the enum class, an `IllegalArgumentException` will be thrown**:

``` java
public static <T extends Enum<T>> T valueOf(Class<T> enumType,
                                            String name) {
    T result = enumType.enumConstantDirectory().get(name);
    if (result != null)
        return result;
    if (name == null)
        throw new NullPointerException("Name is null");
    throw new IllegalArgumentException(
        "No enum constant " + enumType.getCanonicalName() + "." + name);
}
```

Regarding this issue, there is a similar convention in the "Alibaba Java Development Manual":

![-w1538][1]

It stipulates that "**Enums can be used for parameters in second-party libraries, but enums are not allowed for return values.**" The reasoning behind this is what was mentioned above.

### Extended Thinking

**Why can parameters have enums?**

I wonder if you have ever thought about this. It actually has something to do with the responsibilities of a second-party library.

Generally, when System A wants to provide a remote interface for others to call, it defines a second-party library telling callers how to construct parameters and which interface to call.

The caller of this second-party library will make calls according to the definitions in it. The process of parameter construction is completed by System B. If System B uses an old second-party library, the enums used will naturally be some of the existing ones; newly added ones won't be used, so no problem will occur.

For instance, in the previous example, when System B calls System A, it only has the two options `P_T` and `A_B` when constructing the `AType` parameter. Although System A already supports `P_M`, System B does not use it.

If System B wants to use `P_M`, it needs to upgrade the second-party library.

However, return values are different. Return values are not controlled by the client; what the server returns is determined by the second-party library it depends on.

However, compared to the regulations in the manual, **I am more inclined to avoid using enums for both input and output parameters in RPC interfaces.**

Generally, we use enums with a few considerations:

1. Enums strictly control the input of downstream systems, avoiding illegal characters.
2. It's easy for downstream systems to know what values can be passed, making errors less likely.

It is undeniable that using enums does have some benefits, but I do not recommend using them mainly for the following reasons:

1. If a second-party library is upgraded and some enum items are deleted from an enum, using enums for input parameters will also cause problems; the caller will be unable to recognize the enum item.
2. Sometimes there are multiple upstream and downstream systems. For example, System C indirectly calls System A through System B. System A's parameters are passed from System C, and System B only performs parameter conversion and assembly. In this case, once System A's second-party library is upgraded, both B and C must be upgraded simultaneously; any one not upgraded will be incompatible.

**I actually suggest everyone use strings instead of enums in interfaces.** Compared to a strong type like an enum, a string is a weak type.

If strings are used instead of enums in RPC interfaces, the two problems mentioned above can be avoided. The upstream system only needs to pass strings, and the legality of specific values can be checked within System A itself.

**To facilitate use by callers, you can use the Javadoc `@see` annotation to indicate which enum the values for this string field are obtained from.**

``` java
public Class AResponse{
    
    private Boolean success;
    
    /**
    *  @see AType 
    */
    private String aType;
}
```

For a large internet company like Alibaba, **an interface provided casually might have hundreds of callers**, and interface upgrades are common. **We simply cannot require all callers to upgrade every time a second-party library is upgraded.** This is completely unrealistic, and for some callers who don't need the new features, upgrading is entirely unnecessary.

```java
There is another situation that seems special but is actually quite common: sometimes an interface declaration is in package A, while some enum constant definitions are in package B. A common example is Alibaba's transaction-related information; orders are divided into many levels, and every time you introduce one package, you need to introduce dozens more.
```

As a caller, I certainly don't want my system to introduce too many dependencies. **On one hand, too many dependencies will make the application's compilation process very slow, and dependency conflict problems are likely to occur.**

Therefore, when calling downstream interfaces, if the type of a field in the parameters is an enum, I have no choice but to depend on their second-party library. But if it's not an enum and just a string, then I can choose not to depend on it.

So, when we define interfaces, we try to avoid using strong types like enums. The specification stipulates they are not allowed in return values, and I have even higher requirements for myself: I rarely use them even in the input parameters of an interface.

Finally, I am just not suggesting using enums in the input/output parameters of externally provided interfaces; I'm not saying to stop using enums entirely. Many of my previous articles have mentioned that enums have many benefits, and I often use them in my code. So, one must not "give up eating for fear of choking."

Of course, the views in the article only represent my personal opinion. Whether they are applicable to other people, other scenarios, or other companies' practices needs to be discerned by the readers themselves. I suggest you think more about it when using them.

 [1]: https://www.hollischuang.com/wp-content/uploads/2020/11/16066271055035-scaled.jpg
