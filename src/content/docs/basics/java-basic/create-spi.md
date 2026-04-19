---
title: "Create Spi"
---

### Step 1: Define an Interface and Its Implementations
Define a set of interfaces (assume `org.foo.demo.IShout`) and write one or more implementations of the interface (assume `org.foo.demo.animal.Dog`, `org.foo.demo.animal.Cat`).

``` java
public interface IShout {
    void shout();
}
public class Cat implements IShout {
    @Override
    public void shout() {
        System.out.println("miao miao");
    }
}
public class Dog implements IShout {
    @Override
    public void shout() {
        System.out.println("wang wang");
    }
}
```

### Step 2: Create the Services Configuration File
Create a `/META-INF/services` directory under `src/main/resources/`. Add a file named after the interface (`org.foo.demo.IShout` file). The content is the implementation classes to be applied (`org.foo.demo.animal.Dog` and `org.foo.demo.animal.Cat` here, one class per line).

``` 
org.foo.demo.animal.Dog
org.foo.demo.animal.Cat
```

### Step 3: Load the Implementations Using ServiceLoader
Use `ServiceLoader` to load the implementations specified in the configuration file.

``` java
public class SPIMain {
    public static void main(String[] args) {
        ServiceLoader<IShout> shouts = ServiceLoader.load(IShout.class);
        for (IShout s : shouts) {
            s.shout();
        }
    }
}
```

### Code output:

``` 
wang wang
miao miao
```
