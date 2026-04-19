---
title: "Mock"
---

```java
Crash testing is an important part of automotive development. All cars must undergo crash tests before they are marketed, and the test results are published. The purpose of crash tests is to assess the impact strength of transport packages subjected to repeated mechanical collisions during transport and the ability of the package to protect the contents. Simply put, it is to test the damage caused by the collision to the car itself, to the people inside and outside the car, and to objects.
```

<img src="http://www.hollischuang.com/wp-content/uploads/2017/03/mock-193x300.jpg" alt="mock" width="193" height="300" class="aligncenter size-medium wp-image-1795" /> When conducting car crash tests, of course, real people cannot be used for testing, generally dummies are used. However, in order to ensure the authenticity and reliability of the test, the biomechanical performance of the dummy should be the same as that of the human body - such as the size and mass of various parts of the body, and the rigidity of joints, etc., only in this way can the simulation using them match reality. In order to ensure that the cases covered are comprehensive enough, various different dummies are generally used, and different dummies simulate male or female bodies, as well as human bodies of different heights and ages.

Think about software testing, it is actually similar to the process of automotive crash testing. A software must undergo various tests before it is released online, and test reports are produced, more strictly, it must be ensured that the single test coverage cannot be lower than a certain value. Similar to automotive crash testing, we also use many "dummies" in software testing. The purpose of using these "dummies" is also to ensure that the testing is carried out effectively.

---

### why

Don't know if you have encountered the following problems or needs in daily development:

1. Working on the same project with others, the interface has been agreed upon between each other. Then you start developing, after finishing your own code, you want to test whether your service implementation logic is correct. But because you only depend on the interface, the real service has not yet been developed.

2. Still a similar scenario to the above, the service you depend on is called through RPC, and the stability of external services is difficult to guarantee.

3. For an interface or method, you hope to test its various different situations, but you can't decide the execution strategy and return value of the dependent service.

4. The service or object you depend on is difficult to create! (Such as a specific web container)

5. Some behaviors of the dependent object are difficult to trigger! (Such as network exceptions)

6. You don't have any of the above problems, but the service you want to use is really too slow to process.

The above situations are all relatively troublesome problems that may be encountered in the daily development and testing process. These problems will greatly increase the testing cost. It can be said that many developers are unwilling to write unit tests largely because of these six points.

Fortunately, Mock objects can solve the above problems. Testing using mock objects is mock testing.

### what

Mock testing is a testing method that uses a virtual object to create for testing during the testing process for some objects that are not easy to construct or not easy to obtain.

A mock object is a non-real object, a simulated object. It can be understood as the dummy in the automotive crash test. The mock object is a substitute for the real object during debugging.

<img src="http://www.hollischuang.com/wp-content/uploads/2017/03/Mock1-300x196.jpg" alt="Mock1" width="300" height="196" class="aligncenter size-medium wp-image-1796" />

The cost of creating such a "dummy" is relatively low, and this "dummy" can run according to the "plot" you set.

In Java unit testing, many Mock frameworks can be used, and those used more frequently include easymock, mockito, powermock, jmockit, etc.

In object-oriented development, we usually define an interface and use an interface to describe this object. In the code under test, the object is only referenced through the interface, so it does not know whether the referenced object is a real object or a mock object.

Well, the content of this article is almost like this, mainly to let everyone know that in Java you can use mock objects to simulate real objects for unit testing, there are many benefits. The next article will introduce in detail how to use the mockito framework for unit testing.
