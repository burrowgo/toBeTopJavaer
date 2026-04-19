---
title: "Ut With Jmockit"
---

```java
JMockit is developed based on the `java.lang.instrument` package in Java SE 5 and uses the ASM library internally to dynamically modify Java bytecode. This allows Java, a static language, to dynamically set private properties of mocked objects, simulate static and private method behavior, etc., much like a dynamic scripting language. For mobile development, embedded development, or scenarios where code needs to be as concise as possible, or when you don't want to make any modifications to the code under test, JMockit can easily handle many test scenarios.
```

[<img src="http://www.hollischuang.com/wp-content/uploads/2015/09/20140104100723093.jpg" alt="20140104100723093" width="885" height="1010" class="alignleft size-full wp-image-571" />][1]

Add JMockit-related dependencies in Maven as follows:

            <dependency>  
                <groupId>com.googlecode.jmockit</groupId>  
                <artifactId>jmockit</artifactId>  
                <version>1.5</version>  
                <scope>test</scope>  
            </dependency>  
            <dependency>  
                <groupId>com.googlecode.jmockit</groupId>  
                <artifactId>jmockit-coverage</artifactId>  
                <version>0.999.24</version>  
                <scope>test</scope>  
            </dependency>
    

JMockit has two Mocking methods: Behavior-based Mocking and State-based Mocking:

Referencing the JMockit APIs and tools from "Mock Usage in Unit Testing and JMockit Practice":

[<img src="http://www.hollischuang.com/wp-content/uploads/2015/09/20140104102342843.jpg" alt="20140104102342843" width="913" height="472" class="alignleft size-full wp-image-572" />][2]

### (1). Behavior-based Mocking:

The working principle is very similar to EasyMock and PowerMock. The basic steps are:

1. Record expected behavior of methods.
2. Real invocation.
3. Verify that recorded behavior was called.

Introduction to the basic JMockit process through a simple example:

**Method to be mocked for testing:**

``` java
public class MyObject {
    public String hello(String name){
        return "Hello " + name;
    }
}
```
    

**Unit test written using JMockit:**

``` java
@Mocked  // Objects annotated with @Mocked don't need assignment; JMockit mocks them automatically
MyObject obj;  
    
@Test  
public void testHello() {  
    new NonStrictExpectations() {// Record expected mock behavior
        {  
            obj.hello("Zhangsan");  
            returns("Hello Zhangsan");  
            // Can also use: result = "Hello Zhangsan";  
        }  
    };  
    assertEquals("Hello Zhangsan", obj.hello("Zhangsan"));// Call test method
    new Verifications() {// Verify that expected Mock behavior was called
        {  
            obj.hello("Hello Zhangsan");  
            times = 1;  
        }  
    };  
}  
```
    

JMockit can also be classified into non-local mocking and local mocking. The difference lies in whether the Expectations block has parameters; if it does, it's local mocking, otherwise, it's non-local mocking.

Expectations blocks are generally defined by the `Expectations` class and the `NonStrictExpectations` class, similar to Strict Mock and normal Mock in EasyMock and PowerMock.

If defined with the `Expectations` class, the mock object can only call methods in the order defined in the Expectations block at runtime, no more and no less, so the Verifications block can be omitted.

If defined with the `NonStrictExpectations` class, there are no such restrictions, so a Verifications block needs to be added if verification is required.

The above example uses non-local mocking. Let's rewrite the above test using local mocking as follows:

``` java
@Test  
public void testHello() {  
    final MyObject obj = new MyObject();  
    new NonStrictExpectations(obj) {// Record expected mock behavior
        {  
            obj.hello("Zhangsan");  
            returns("Hello Zhangsan");  
            // Can also use: result = "Hello Zhangsan";  
        }  
    };  
    assertEquals("Hello Zhangsan", obj.hello("Zhangsan"));// Call test method
    new Verifications() {// Verify that expected Mock behavior was called
        {  
            obj.hello("Hello Zhangsan");  
            times = 1;  
        }  
    };  
}  
```
    

**Mocking Static Methods:**

``` java
@Test  
public void testMockStaticMethod() {  
    new NonStrictExpectations(ClassMocked.class) {  
        {  
            ClassMocked.getDouble(1);// Can also use argument matching: ClassMocked.getDouble(anyDouble);  
            result = 3;  
        }  
    };  
    
    assertEquals(3, ClassMocked.getDouble(1));  
    
    new Verifications() {  
        {  
            ClassMocked.getDouble(1);  
            times = 1;  
        }  
    };  
}  
```
    

**Mocking Private Methods:**

If the `getTripleString(int)` method in the `ClassMocked` class calls a private `multiply3(int)` method, we can mock it as follows:

``` java
@Test  
public void testMockPrivateMethod() throws Exception {  
    final ClassMocked obj = new ClassMocked();  
    new NonStrictExpectations(obj) {  
        {  
            this.invoke(obj, "multiply3", 1);// If the private method is static, use: this.invoke(null, "multiply3")  
            result = 4;  
        }  
    };  
    
    String actual = obj.getTripleString(1);  
    assertEquals("4", actual);  
    
    new Verifications() {  
        {  
            this.invoke(obj, "multiply3", 1);  
            times = 1;  
        }  
    };  
}  
```
    

**Setting Private Property Values of Mocked Objects:** We know that EasyMock and PowerMock's mock objects are implemented through JDK/CGLIB dynamic proxies, which are essentially class inheritance or interface implementation. However, in Java object-oriented programming, private properties in a base class cannot be inherited by subclasses. Therefore, if a method of a mocked object uses its own private properties and these properties do not provide object access methods, traditional mocking methods cannot be used for testing. JMockit provides methods to set the private property values of mocked objects:
Code under test:

``` java
public class ClassMocked {  
    private String name = "name_init";  
    
    public String getName() {  
        return name;  
    }  
    
    private static String className="Class3Mocked_init";  
    
    public static String getClassName(){  
        return className;  
    }  
}  
```
    

**Using JMockit to Set Private Properties:**

``` java
@Test  
public void testMockPrivateProperty() throws IOException {  
    final ClassMocked obj = new ClassMocked();  
    new NonStrictExpectations(obj) {  
        {  
            this.setField(obj, "name", "name has bean change!");  
        }  
    };  
    
    assertEquals("name has bean change!", obj.getName());  
}  
```
    

**Using JMockit to Set Static Private Properties:**

``` java
@Test  
public void testMockPrivateStaticProperty() throws IOException {  
    new NonStrictExpectations(ClassMocked.class) {  
        {  
            this.setField(ClassMocked.class, "className", "className has bean change!");  
        }  
    };  
    
    assertEquals("className has bean change!", ClassMocked.getClassName());  
}  
```
    

### (2). State-based Mocking:

The behavior-based mocking method in JMockit above is basically similar to traditional EasyMock and PowerMock processes, treating the mocked method as a black box. In contrast, JMockit's state-based mocking can directly rewrite the internal logic of the mocked method, acting more like white-box testing in a true sense. Let's introduce JMockit's state-based mocking through a simple example.
Code under test:

``` java
public class StateMocked {  
    
    public static int getDouble(int i){  
        return i*2;  
    }  
    
    public int getTriple(int i){  
        return i*3;  
    }  
} 
```
    

**Rewriting Normal Method Content:**

``` java
@Test  
public void testMockNormalMethodContent() throws IOException {  
    StateMocked obj = new StateMocked();  
    new MockUp<StateMocked>() {// Use MockUp to modify internal logic of the method under test
        @Mock  
      public int getTriple(int i) {  
            return i * 30;  
        }  
    };  
    assertEquals(30, obj.getTriple(1));  
    assertEquals(60, obj.getTriple(2));  
    Mockit.tearDownMocks();// Note: After JMockit 1.5, the Mockit class no longer exists; use MockUp instead. mockUp and tearDown methods are in the MockUp class.
}  
```
    

**Modifying Static Method Content:** Rewriting static/final method content with state-based JMockit is no different from testing normal methods. Note that methods in `MockUp` have the same signature as the mocked method except they don't include the `static` keyword and are annotated with `@Mock`. Test code is as follows:

``` java
@Test  
    public void testGetTriple() {  
        new MockUp<StateMocked>() {  
            @Mock    
            public int getDouble(int i){    
                return i*20;    
            }  
        };    
        assertEquals(20, StateMocked.getDouble(1));    
        assertEquals(40, StateMocked.getDouble(2));   
    }  
```
    

Original Link: http://blog.csdn.net/chjttony/article/details/17838693

 [1]: http://www.hollischuang.com/wp-content/uploads/2015/09/20140104100723093.jpg
 [2]: http://www.hollischuang.com/wp-content/uploads/2015/09/20140104102342843.jpg
